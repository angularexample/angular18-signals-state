import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { debounceTime, distinctUntilChanged } from "rxjs";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { XxxContent } from "../../xxx-common/xxx-content/xxx-content.types";
import { XxxContentComponent } from '../../xxx-common/xxx-content/xxx-content.component';
import { XxxContentFacade } from "../../xxx-common/xxx-content/xxx-content-facade.service";
import { XxxPost, xxxPostFormDataInitial } from "../xxx-post.types";
import { XxxPostFacadeService } from "../xxx-post-facade.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    XxxContentComponent,
  ],
  selector: 'xxx-post-edit',
  standalone: true,
  templateUrl: './xxx-post-edit.component.html',
})
export class XxxPostEditComponent {
  contentKey: string = 'post-edit';
  postForm: FormGroup = new FormGroup({
    body: new FormControl(xxxPostFormDataInitial.body, Validators.required),
    id: new FormControl(xxxPostFormDataInitial.id),
    title: new FormControl(xxxPostFormDataInitial.title, Validators.required),
    userId: new FormControl(xxxPostFormDataInitial.userId)
  });
  private contentFacade: XxxContentFacade = inject(XxxContentFacade)
  $content: Signal<XxxContent | undefined> = this.contentFacade.$content;
  private postFacade: XxxPostFacadeService = inject(XxxPostFacadeService);
  $isNoSelectedPost: Signal<boolean> = this.postFacade.$isNoSelectedPost;
  $isSaveButtonDisabled: Signal<boolean> = this.postFacade.$isSaveButtonDisabled;
  $selectedPost: Signal<XxxPost | undefined> = this.postFacade.$selectedPost;

  constructor() {
    this.contentFacade.showContent(this.contentKey)
    this.loadFormData();
    this.subscribeToFormChanges();
  }

  onSubmit() {
    this.postFacade.updatePost();
  }

  private loadFormData(): void {
    const post: XxxPost | undefined = this.$selectedPost();
    if (post !== undefined) {
      this.postForm.setValue(post);
    }
  }

  private subscribeToFormChanges(): void {
    this.postForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(value => {
      const post: XxxPost = <XxxPost>value;
      this.postFacade.setPostForm(post);
    });
  }
}
