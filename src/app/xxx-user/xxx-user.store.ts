import {catchError, of} from "rxjs";
import {computed, inject, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {XxxAlertService} from "../xxx-common/xxx-alert/xxx-alert.service";
import {XxxHttpUtilities} from "../xxx-common/xxx-utilities/xxx-http-utilities";
import {XxxLoadingService} from "../xxx-common/xxx-loading/xxx-loading.service";
import {XxxUser, XxxUserApiResponse, xxxUserInitialState, XxxUserState} from "./xxx-user.types";
import {XxxUserDataService} from "./xxx-user-data.service"

/**
 * XxxUserStore is the feature state for the user page.
 * State management for Angular using only Signals and RxJS.
 * If you already know NgRx then we have organized it using the same categories.
 */
@Injectable({
  providedIn: 'root'
})
export class XxxUserStore {
  private router: Router = inject(Router);
  private alertService: XxxAlertService = inject(XxxAlertService);
  private loadingService: XxxLoadingService = inject(XxxLoadingService);
  private userDataService: XxxUserDataService = inject(XxxUserDataService);

  // State
  // Where we store all the properties needed to support the view
  private $userState: WritableSignal<XxxUserState> = signal<XxxUserState>(xxxUserInitialState);

// Actions
  getUsersAction() {
    this.getUsersReducer();
    this.getUsersEffect();
  }

  getUsersErrorAction(err: HttpErrorResponse) {
    this.getUsersErrorReducer();
    this.getUsersErrorEffect(err);
  }

  getUsersSuccessAction(users: XxxUser[]) {
    this.getUsersSuccessReducer(users);
    this.getUsersSuccessEffect(users);
  }

  selectUserAction(userId: number) {
    this.selectUserReducer(userId);
    this.selectUserEffect(userId);
  }

  showUsersAction() {
    this.showUsersEffect();
  }

// Selectors
  $isUsersEmpty_: Signal<boolean> = computed(() => !this.$userState().isUsersLoading && this.$userState().users.length === 0);

  $isUsersLoaded_: Signal<boolean> = computed(() => this.$userState().users.length > 0);

  $isUsersLoading_: Signal<boolean> = computed(() => this.$userState().isUsersLoading);

  $selectedUserId_: Signal<number | undefined> = computed(() => this.$userState().selectedUserId);

  $isNoSelectedUser_: Signal<boolean> = computed(() => this.$selectedUserId_() === undefined);

  $users_: Signal<XxxUser[]> = computed(() => this.$userState().users);

// Reducers
  getUsersReducer() {
    this.$userState.update(state =>
      ({
        ...state,
        isLoading: true,
        users: []
      })
    )
  }

  getUsersErrorReducer() {
    this.$userState.update(state =>
      ({
        ...state,
        isLoading: false
      })
    )
  }

  getUsersSuccessReducer(users: XxxUser[]) {
    this.$userState.update(state =>
      ({
        ...state,
        isLoading: false,
        users
      })
    )
  }

  selectUserReducer(userId: number) {
    this.$userState.update(state =>
      ({
        ...state,
        selectedUserId: userId
      })
    )
  }

// Effects
  getUsersEffect() {
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
    ).subscribe((response: unknown) => {
      const apiResponse: XxxUserApiResponse = response as XxxUserApiResponse;
      this.getUsersSuccessAction(apiResponse.users);
    })
  }

  getUsersErrorEffect(err: HttpErrorResponse) {
    this.loadingService.loadingOff();
    const errorMessage: string = XxxHttpUtilities.setErrorMessage(err);
    this.alertService.showError(errorMessage);
  }

  getUsersSuccessEffect(users: XxxUser[]) {
    this.loadingService.loadingOff();
  }

  selectUserEffect(userId: number) {
    this.router.navigateByUrl('/post')
  }

  showUsersEffect() {
    if (!this.$isUsersLoaded_()) {
      this.getUsersAction();
    }
  }
}
