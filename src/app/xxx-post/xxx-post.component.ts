import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {Observable} from "rxjs";
import {XxxContent} from "../xxx-common/xxx-content/xxx-content.types";
import {XxxContentComponent} from '../xxx-common/xxx-content/xxx-content.component';
import {XxxContentFacade} from "../xxx-common/xxx-content/xxx-content-facade.service";
import {XxxPost} from "./xxx-post.types";
import {XxxPostFacadeService} from "./xxx-post-facade.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    XxxContentComponent,
  ],
  selector: 'xxx-post',
  standalone: true,
  templateUrl: './xxx-post.component.html',
})
export class XxxPostComponent {
  contentKey: string = 'post';
  private contentFacade: XxxContentFacade = inject(XxxContentFacade);
  private postFacade: XxxPostFacadeService = inject(XxxPostFacadeService);
  $content: Signal<XxxContent | undefined> = this.contentFacade.$content;
  isNoSelectedUser$: Observable<boolean> = this.postFacade.isNoSelectedUser$;
  isPostsEmpty$: Observable<boolean> = this.postFacade.isPostsEmpty$;
  isPostsLoaded$: Observable<boolean> = this.postFacade.isPostsLoaded$;
  isPostsLoading$: Observable<boolean> = this.postFacade.isPostsLoading$;
  posts$: Observable<XxxPost[]> = this.postFacade.posts$;
  selectedPostId$: Observable<number | undefined> = this.postFacade.selectedPostId$;

  constructor() {
    this.contentFacade.showContent(this.contentKey)
    this.postFacade.getUserPosts();
  }

  selectPost(post: XxxPost) {
    this.postFacade.selectPost(post.id);
  }
}
