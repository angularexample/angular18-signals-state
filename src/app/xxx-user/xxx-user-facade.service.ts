import {inject, Injectable, Signal} from '@angular/core';
import {XxxUser} from "./xxx-user.types";
import {XxxUserStore} from "./xxx-user.store";

@Injectable({
  providedIn: 'root'
})
export class XxxUserFacade {
  userStore: XxxUserStore = inject(XxxUserStore);
  $isUsersEmpty: Signal<boolean> = this.userStore.$isUsersEmpty_;
  $isUsersLoaded: Signal<boolean> = this.userStore.$isUsersLoaded_;
  $isUsersLoading: Signal<boolean> = this.userStore.$isUsersLoading_;
  $selectedUserId: Signal<number | undefined> = this.userStore.$selectedUserId_;
  $users: Signal<XxxUser[]> = this.userStore.$users_;

  showUsers(): void {
    this.userStore.showUsersAction();
  }

  selectUser(userId: number): void {
    this.userStore.selectUserAction(userId);
  }
}
