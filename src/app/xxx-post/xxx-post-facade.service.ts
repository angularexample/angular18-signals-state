import { inject, Injectable, Signal } from '@angular/core';
import { XxxPost } from "./xxx-post.types";
import { XxxPostStore } from './xxx-post.store';

@Injectable({
  providedIn: 'root'
})
export class XxxPostFacadeService {
  private postStore: XxxPostStore = inject(XxxPostStore);
  readonly $isNoSelectedPost: Signal<boolean> = this.postStore.$isNoSelectedPost_;
  readonly $isNoSelectedUser: Signal<boolean> = this.postStore.$isNoSelectedUser_;
  readonly $isPostsEmpty: Signal<boolean> = this.postStore.$isPostsEmpty_;
  readonly $isPostsLoaded: Signal<boolean> = this.postStore.$isPostsLoaded_;
  readonly $isPostsLoading: Signal<boolean> = this.postStore.$isPostsLoading_;
  readonly $isSaveButtonDisabled: Signal<boolean> = this.postStore.$isSaveButtonDisabled_;
  readonly $posts: Signal<XxxPost[]> = this.postStore.$posts_;
  readonly $selectedPost: Signal<XxxPost | undefined> = this.postStore.$selectedPost_;
  readonly $selectedPostId: Signal<number | undefined> = this.postStore.$selectedPostId_;

  selectPost(postId: number): void {
    this.postStore.selectPostAction(postId);
  }

  setPostForm(post: XxxPost): void {
    this.postStore.setPostFormAction(post)
  }

  showPosts(): void {
    this.postStore.showPostsAction();
  }

  updatePost(): void {
    this.postStore.updatePostAction()
  }
}
