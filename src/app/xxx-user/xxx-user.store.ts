import { catchError, of } from "rxjs";
import { computed, inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { XxxAlertService } from "../xxx-common/xxx-alert/xxx-alert.service";
import { XxxHttpUtilities } from "../xxx-common/xxx-utilities/xxx-http-utilities";
import { XxxLoadingService } from "../xxx-common/xxx-loading/xxx-loading.service";
import { XxxUser, XxxUserApiResponse, xxxUserInitialState, XxxUserState } from "./xxx-user.types";
import { XxxUserDataService } from "./xxx-user-data.service"

/**
 * XxxUserStore is the feature state for the user page.
 * State management for Angular using only Signals and RxJS.
 * If you already know NgRx, then we have organized it using the same categories.
 */
@Injectable({
  providedIn: 'root'
})
export class XxxUserStore {
  private alertService: XxxAlertService = inject(XxxAlertService);
  private loadingService: XxxLoadingService = inject(XxxLoadingService);
  private router: Router = inject(Router);
  private userDataService: XxxUserDataService = inject(XxxUserDataService);

  // State
  // Where we store all the properties needed to support the view
  private $userState: WritableSignal<XxxUserState> = signal<XxxUserState>(xxxUserInitialState);

  // Actions
  selectUserAction(userId: number): void {
    this.selectUserReducer(userId);
    this.selectUserEffect();
  }

  showUsersAction(): void {
    this.showUsersEffect();
  }

  private getUsersAction(): void {
    this.getUsersReducer();
    this.getUsersEffect();
  }

  private getUsersErrorAction(err: HttpErrorResponse): void {
    this.getUsersErrorReducer();
    this.getUsersErrorEffect(err);
  }

  private getUsersSuccessAction(users: XxxUser[]): void {
    this.getUsersSuccessReducer(users);
    this.getUsersSuccessEffect();
  }

  // Selectors
  readonly $isNoSelectedUser_: Signal<boolean> = computed(() => this.$selectedUserId_() === undefined);

  readonly $isUsersEmpty_: Signal<boolean> = computed(() => !this.$userState().isUsersLoading && this.$userState().users.length === 0);

  readonly $isUsersLoaded_: Signal<boolean> = computed(() => this.$userState().users.length > 0);

  readonly $isUsersLoading_: Signal<boolean> = computed(() => this.$userState().isUsersLoading);

  readonly $selectedUserId_: Signal<number | undefined> = computed(() => this.$userState().selectedUserId);

  readonly $users_: Signal<XxxUser[]> = computed(() => this.$userState().users);

  // Reducers
  private getUsersReducer(): void {
    this.$userState.update(state =>
      ({
        ...state,
        isLoading: true,
        users: []
      })
    )
  }

  private getUsersErrorReducer(): void {
    this.$userState.update(state =>
      ({
        ...state,
        isLoading: false
      })
    )
  }

  private getUsersSuccessReducer(users: XxxUser[]): void {
    this.$userState.update(state =>
      ({
        ...state,
        isLoading: false,
        users
      })
    )
  }

  private selectUserReducer(userId: number): void {
    this.$userState.update(state =>
      ({
        ...state,
        selectedUserId: userId
      })
    )
  }

  // Effects
  private getUsersEffect(): void {
    this.loadingService.loadingOn();
    this.userDataService.getUsers().pipe(
      catchError((err: HttpErrorResponse) => {
        this.getUsersErrorAction(err);
        const emptyResponse: XxxUserApiResponse = {
          limit: 0,
          skip: 0,
          total: 0,
          users: []
        };
        return of(emptyResponse);
      })
    ).subscribe((response: unknown): void => {
      const apiResponse: XxxUserApiResponse = response as XxxUserApiResponse;
      this.getUsersSuccessAction(apiResponse.users);
    })
  }

  private getUsersErrorEffect(err: HttpErrorResponse): void {
    this.loadingService.loadingOff();
    const errorMessage: string = XxxHttpUtilities.setErrorMessage(err);
    this.alertService.showError(errorMessage);
  }

  private getUsersSuccessEffect(): void {
    this.loadingService.loadingOff();
  }

  private selectUserEffect(): void {
    void this.router.navigateByUrl('/post')
  }

  private showUsersEffect(): void {
    if (!this.$isUsersLoaded_()) {
      this.getUsersAction();
    }
  }
}
