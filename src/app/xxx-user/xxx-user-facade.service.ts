import { inject, Injectable, Signal } from '@angular/core';
import { XxxUser } from "./xxx-user.types";
import { XxxUserStore } from "./xxx-user.store";

@Injectable({
  providedIn: 'root'
})
export class XxxUserFacade {
  private userStore: XxxUserStore = inject(XxxUserStore);
  readonly $isUsersEmpty: Signal<boolean> = this.userStore.$isUsersEmpty_;
  readonly $isUsersLoaded: Signal<boolean> = this.userStore.$isUsersLoaded_;
  readonly $isUsersLoading: Signal<boolean> = this.userStore.$isUsersLoading_;
  readonly $selectedUserId: Signal<number | undefined> = this.userStore.$selectedUserId_;
  readonly $users: Signal<XxxUser[]> = this.userStore.$users_;

  showUsers(): void {
    this.userStore.showUsersAction();
  }

  selectUser(userId: number): void {
    this.userStore.selectUserAction(userId);
  }
}
