import {catchError, of} from "rxjs";
import {computed, inject, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {XxxAlertService} from "../xxx-common/xxx-alert/xxx-alert.service";
import {XxxHttpUtilities} from "../xxx-common/xxx-utilities/xxx-http-utilities";
import {XxxLoadingService} from "../xxx-common/xxx-loading/xxx-loading.service";
import {XxxPost, xxxPostInitialState, XxxPostState} from "./xxx-post.types";
import {XxxPostDataService} from "./xxx-post-data.service"
import {XxxUserStore} from "../xxx-user/xxx-user.store";

/**
 * XxxPostStore is the feature state for the post page.
 * State management for Angular using only Signals and RxJS.
 * If you already know NgRx then we have organized it using the same categories.
 */
@Injectable({
  providedIn: 'root'
})
export class XxxPostStore {
  private alertService: XxxAlertService = inject(XxxAlertService);
  private loadingService: XxxLoadingService = inject(XxxLoadingService);
  private postDataService: XxxPostDataService = inject(XxxPostDataService);
  private router: Router = inject(Router);
  private userStore: XxxUserStore = inject(XxxUserStore);

  // State
  // Where we store all the properties needed to support the view
  private $postState: WritableSignal<XxxPostState> = signal<XxxPostState>(xxxPostInitialState);

  // Actions
  // In this design actions are methods that trigger reducers and effects
  getPostsAction() {
    this.getPostsReducer();
    this.getPostsEffect();
  }

  getPostsErrorAction(err: HttpErrorResponse) {
    this.getPostsErrorReducer();
    this.getPostsErrorEffect(err);
  }

  getPostsSuccessAction(posts: XxxPost[]) {
    this.getPostsSuccessReducer(posts);
    this.getPostsSuccessEffect();
  }

  selectPostAction(postId: number) {
    this.selectPostReducer(postId);
    this.selectPostEffect();
  }

  setPostFormAction(post: XxxPost) {
    this.setPostFormReducer(post);
  }

  showPostsAction() {
    this.showPostsEffect();
  }

  updatePostAction() {
    this.updatePostReducer();
    this.updatePostEffect();
  }

  // Selectors
  $isNoSelectedPost_: Signal<boolean> = computed(() => this.$postState().selectedPostId === undefined);

  $isPostsEmpty_: Signal<boolean> = computed(() => !this.$postState().isPostsLoading && this.$postState().posts.length === 0);

  $isPostsLoaded_: Signal<boolean> = computed(() => this.$postState().posts.length > 0);

  $isPostsLoading_: Signal<boolean> = computed(() => this.$postState().isPostsLoading);

  $isPostUpdating_: Signal<boolean> = computed(() => this.$postState().isPostUpdating);

  private: Signal<boolean> = this.userStore.$isUsersLoaded_;

  $selectedPostId_: Signal<number | undefined> = computed(() => this.$postState().selectedPostId);

  $selectedPost_: Signal<XxxPost | undefined> = computed(() => {
    let post: XxxPost | undefined;
    const posts: XxxPost[] = this.$posts_();
    const postId: number | undefined = this.$selectedPostId_();
    if (postId !== undefined && posts.length > 0) {
      post = posts.find(item => item.id === postId);
    }
    return post;
  });

  private $postForm_: Signal<XxxPost | undefined> = computed(() => this.$postState().postForm);

  $isNoSelectedUser_: Signal<boolean> = this.userStore.$isNoSelectedUser_;

  $isSaveButtonDisabled_: Signal<boolean> = computed(() => {
    const postForm: XxxPost | undefined = this.$postForm_();
    const selectedPost: XxxPost | undefined = this.$selectedPost_();
    const isPostFormEqual: boolean = JSON.stringify(selectedPost) === JSON.stringify(postForm);
    return this.$isPostUpdating_() || (!this.$isPostsLoaded_()) || (this.$selectedPost_() === undefined) || (postForm === undefined) || isPostFormEqual;
  });

  $posts_: Signal<XxxPost[]> = computed(() => this.$postState().posts);

// Reducers
  private getPostsReducer() {
    this.$postState.update(state =>
      ({
        ...state,
        isLoading: true,
        Posts: []
      })
    )
  }

  private getPostsErrorReducer() {
    this.$postState.update(state =>
      ({
        ...state,
        isLoading: false
      })
    )
  }

  private getPostsSuccessReducer(posts: XxxPost[]) {
    this.$postState.update(state =>
      ({
        ...state,
        isLoading: false,
        posts
      })
    )
  }

  private selectPostReducer(postId: number) {
    // make sure post exists
    if (this.$postState().posts.some(item => item.id === postId)) {
      this.$postState.update(state =>
        ({
          ...state,
          selectedPostId: postId
        })
      )
    }
  }

  private setPostFormReducer(post: XxxPost) {
    // Create a new object for immuntability
    const postForm: XxxPost = <XxxPost>JSON.parse(JSON.stringify(post));
    this.$postState.update(state =>
      ({
        ...state,
        postForm
      })
    )
  }

  private updatePostReducer() {
    this.$postState.update(state =>
      ({
        ...state,
        isPostUpdating: true
      })
    )
  }

// Effects
  private getPostsEffect() {
    const userId: number | undefined = this.userStore.$selectedUserId_();
    if (userId === undefined) {
      return;
    }
    this.loadingService.loadingOn();
    this.postDataService.getPosts(userId).pipe(
      catchError((err: HttpErrorResponse) => {
        this.getPostsErrorAction(err);
        return of([]);
      })
    ).subscribe((response: unknown) => {
      const posts: XxxPost[] = response as XxxPost[];
      this.getPostsSuccessAction(posts);
    })
  }

  getPostsErrorEffect(err: HttpErrorResponse) {
    this.loadingService.loadingOff();
    const errorMessage: string = XxxHttpUtilities.setErrorMessage(err);
    this.alertService.showError(errorMessage);
  }

  getPostsSuccessEffect() {
    this.loadingService.loadingOff();
  }

  selectPostEffect() {
    this.router.navigateByUrl('/post')
  }

  showPostsEffect() {
    if (!this.$isPostsLoaded_()) {
      this.getPostsAction();
    }
  }

  updatePostEffect() {
    //TODO
  }
}
