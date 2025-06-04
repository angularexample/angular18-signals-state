import {inject, Injectable, Signal} from '@angular/core';
import {XxxPost} from "./xxx-post.types";
import {XxxPostStore} from './xxx-post.store';

@Injectable({
  providedIn: 'root'
})
export class XxxPostFacadeService {
  private postStore: XxxPostStore = inject(XxxPostStore);
  $isNoSelectedPost: Signal<boolean> = this.postStore.$isNoSelectedPost_;
  $isNoSelectedUser: Signal<boolean> = this.postStore.$isNoSelectedUser_;
  $isPostsEmpty: Signal<boolean> = this.postStore.$isPostsEmpty_;
  $isPostsLoaded: Signal<boolean> = this.postStore.$isPostsLoaded_;
  $isPostsLoading: Signal<boolean> = this.postStore.$isPostsLoading_;
  $isSaveButtonDisabled: Signal<boolean> = this.postStore.$isSaveButtonDisabled_;
  $posts: Signal<XxxPost[]> = this.postStore.$posts_;
  $selectedPost: Signal<XxxPost | undefined> = this.postStore.$selectedPost_;
  $selectedPostId: Signal<number | undefined> = this.postStore.$selectedPostId_;

  showPosts(): void {
    this.postStore.showPostsAction();
  }

  selectPost(postId: number): void {
    this.postStore.selectPostAction(postId);
  }

  setPostForm(post: XxxPost): void {
    this.postStore.setPostFormAction(post)
  }

  updatePost(): void {
    this.postStore.updatePostAction()
  }
}
