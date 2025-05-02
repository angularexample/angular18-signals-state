import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {XxxPost} from "./xxx-post.types";

@Injectable({
    providedIn: 'root'
})
export class XxxPostFacadeService {
    isNoSelectedPost$: Observable<boolean> =of(false);
    isNoSelectedUser$: Observable<boolean> = of(false);
    isPostsEmpty$: Observable<boolean> = of(false);
    isPostsLoaded$: Observable<boolean> = of(false);
    isPostsLoading$: Observable<boolean> = of(false);
    isSaveButtonDisabled$: Observable<boolean> = of(false);
    posts$: Observable<XxxPost[]> = of([]);
    selectedPost$: Observable<XxxPost | undefined> = of(undefined);
    selectedPostId$: Observable<number | undefined> = of(undefined);

    getUserPosts(): void {
    }

    selectPost(postId: number): void {
    }

    setPostForm(post: XxxPost): void {
    }

    updatePost(): void {
    }
}
