import { catchError, of } from "rxjs";
import { computed, inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { XxxAlertService } from "../xxx-common/xxx-alert/xxx-alert.service";
import { XxxHttpUtilities } from "../xxx-common/xxx-utilities/xxx-http-utilities";
import { XxxLoadingService } from "../xxx-common/xxx-loading/xxx-loading.service";
import { XxxPost, xxxPostInitialState, XxxPostState } from "./xxx-post.types";
import { XxxPostDataService } from "./xxx-post-data.service"
import { XxxUserStore } from "../xxx-user/xxx-user.store";

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
  private getPostsAction(): void {
    this.getPostsReducer();
    this.getPostsEffect();
  }

  private getPostsErrorAction(err: HttpErrorResponse): void {
    this.getPostsErrorReducer();
    this.getPostsErrorEffect(err);
  }

  private getPostsSuccessAction(posts: XxxPost[]): void {
    this.getPostsSuccessReducer(posts);
    this.getPostsSuccessEffect();
  }

  selectPostAction(postId: number): void {
    this.selectPostReducer(postId);
    this.selectPostEffect();
  }

  setPostFormAction(post: XxxPost): void {
    this.setPostFormReducer(post);
  }

  showPostsAction(): void {
    this.showPostsEffect();
  }

  updatePostAction(): void {
    this.updatePostReducer();
    this.updatePostEffect();
  }

  private updatePostErrorAction(err: HttpErrorResponse | undefined): void {
    this.updatePostErrorReducer();
    this.updatePostErrorEffect(err);
  }

  private updatePostSuccessAction(): void {
    this.updatePostSuccessReducer();
    this.updatePostSuccessEffect();
  }


  // Selectors
  readonly $isNoSelectedPost_: Signal<boolean> = computed(() => this.$postState().selectedPostId === undefined);

  readonly $isNoSelectedUser_: Signal<boolean> = this.userStore.$isNoSelectedUser_;

  readonly $isPostsEmpty_: Signal<boolean> = computed(() => !this.$postState().isPostsLoading && this.$postState().posts.length === 0);

  readonly $isPostsLoaded_: Signal<boolean> = computed(() => this.$postState().posts.length > 0);

  readonly $isPostsLoading_: Signal<boolean> = computed(() => this.$postState().isPostsLoading);

  readonly $isPostUpdating_: Signal<boolean> = computed(() => this.$postState().isPostUpdating);

  readonly $selectedPostId_: Signal<number | undefined> = computed(() => this.$postState().selectedPostId);

  private readonly $postForm_: Signal<XxxPost | undefined> = computed(() => this.$postState().postForm);

  readonly $posts_: Signal<XxxPost[]> = computed(() => this.$postState().posts);

  readonly $selectedPost_: Signal<XxxPost | undefined> = computed(() => {
    let post: XxxPost | undefined;
    const posts: XxxPost[] = this.$posts_();
    const postId: number | undefined = this.$selectedPostId_();
    if (postId !== undefined && posts.length > 0) {
      post = posts.find(item => item.id === postId);
    }
    return post;
  });

  readonly $isSaveButtonDisabled_: Signal<boolean> = computed(() => {
    const postForm: XxxPost | undefined = this.$postForm_();
    const selectedPost: XxxPost | undefined = this.$selectedPost_();
    const isPostFormEqual: boolean = JSON.stringify(selectedPost) === JSON.stringify(postForm);
    return this.$isPostUpdating_() || (!this.$isPostsLoaded_()) || (this.$selectedPost_() === undefined) || (postForm === undefined) || isPostFormEqual;
  });

// Reducers
  private getPostsReducer(): void {
    this.$postState.update(state =>
      ({
        ...state,
        isLoading: true,
        Posts: []
      })
    )
  }

  private getPostsErrorReducer(): void {
    this.$postState.update(state =>
      ({
        ...state,
        isLoading: false
      })
    )
  }

  private getPostsSuccessReducer(posts: XxxPost[]): void {
    this.$postState.update(state =>
      ({
        ...state,
        isLoading: false,
        posts
      })
    )
  }

  private selectPostReducer(postId: number): void {
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

  private setPostFormReducer(post: XxxPost): void {
    // Create a new object for immutability
    const postForm: XxxPost = <XxxPost>JSON.parse(JSON.stringify(post));
    this.$postState.update(state =>
      ({
        ...state,
        postForm
      })
    )
  }

  private updatePostReducer(): void {
    this.$postState.update(state =>
      ({
        ...state,
        isPostUpdating: true
      })
    )
  }

  private updatePostErrorReducer(): void {
    this.$postState.update(state =>
      ({
        ...state,
        isPostUpdating: false
      })
    )
  }

  private updatePostSuccessReducer(): void {
    this.$postState.update(state =>
      ({
        ...state,
        isPostUpdating: false
      })
    )
  }

  // Effects
  private getPostsEffect(): void {
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

  private getPostsErrorEffect(err: HttpErrorResponse): void {
    this.loadingService.loadingOff();
    const errorMessage: string = XxxHttpUtilities.setErrorMessage(err);
    this.alertService.showError(errorMessage);
  }

  private getPostsSuccessEffect(): void {
    this.loadingService.loadingOff();
  }

  private selectPostEffect(): void {
    void this.router.navigateByUrl('/post/edit')
  }

  private showPostsEffect(): void {
    if (!this.$isPostsLoaded_()) {
      this.getPostsAction();
    }
  }

  private updatePostEffect(): void {
    this.loadingService.loadingOn();
    const post: XxxPost | undefined = this.$postForm_();
    if (post === undefined) {
      this.updatePostErrorAction(undefined);
      return;
    } else {
      let isError: boolean = false;
      this.postDataService.updatePost(post).pipe(
        catchError((err: HttpErrorResponse) => {
          isError = true;
          this.updatePostErrorAction(err);
          return of({});
        })
      ).subscribe(() => {
        if (!isError) {
          this.updatePostSuccessAction()
        }
      })
    }
  }

  private updatePostErrorEffect(err: HttpErrorResponse | undefined): void {
    this.loadingService.loadingOff();
    let errorMessage: string = 'Error occurred. Unable to update post.';
    if (err) {
      errorMessage = `${errorMessage} ${XxxHttpUtilities.setErrorMessage(err)}`;
    }
    this.alertService.showError(errorMessage);
  }

  private updatePostSuccessEffect(): void {
    this.loadingService.loadingOff();
    this.alertService.showInfo('Successfully updated post');
    void this.router.navigateByUrl('/post')
  }
}
