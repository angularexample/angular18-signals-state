import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { XxxContent } from "../xxx-common/xxx-content/xxx-content.types";
import { XxxContentComponent } from '../xxx-common/xxx-content/xxx-content.component';
import { XxxContentFacade } from "../xxx-common/xxx-content/xxx-content-facade.service";
import { XxxPost } from "./xxx-post.types";
import { XxxPostFacadeService } from "./xxx-post-facade.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    XxxContentComponent,
  ],
  selector: 'xxx-post',
  standalone: true,
  templateUrl: './xxx-post.component.html',
})
export class XxxPostComponent {
  protected readonly contentKey: string = 'post';
  private contentFacade: XxxContentFacade = inject(XxxContentFacade);
  protected readonly $content: Signal<XxxContent | undefined> = this.contentFacade.$content;
  private postFacade: XxxPostFacadeService = inject(XxxPostFacadeService);
  protected readonly $isNoSelectedUser: Signal<boolean> = this.postFacade.$isNoSelectedUser;
  protected readonly $isPostsEmpty: Signal<boolean> = this.postFacade.$isPostsEmpty;
  protected readonly $isPostsLoaded: Signal<boolean> = this.postFacade.$isPostsLoaded;
  protected readonly $isPostsLoading: Signal<boolean> = this.postFacade.$isPostsLoading;
  protected readonly $posts: Signal<XxxPost[]> = this.postFacade.$posts;
  protected readonly $selectedPostId: Signal<number | undefined> = this.postFacade.$selectedPostId;

  constructor() {
    this.contentFacade.showContent(this.contentKey)
    this.postFacade.showPosts();
  }

  protected selectPost(post: XxxPost): void {
    this.postFacade.selectPost(post.id);
  }
}
