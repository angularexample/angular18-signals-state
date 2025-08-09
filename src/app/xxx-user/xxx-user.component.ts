import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { XxxContent } from "../xxx-common/xxx-content/xxx-content.types";
import { XxxContentComponent } from '../xxx-common/xxx-content/xxx-content.component';
import { XxxContentFacade } from "../xxx-common/xxx-content/xxx-content-facade.service";
import { XxxUser } from "./xxx-user.types";
import { XxxUserFacade } from "./xxx-user-facade.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    XxxContentComponent,
  ],
  selector: 'xxx-user',
  standalone: true,
  templateUrl: './xxx-user.component.html',
})
export class XxxUserComponent {
  contentKey: string = 'user';
  private contentFacade: XxxContentFacade = inject(XxxContentFacade);
  $content: Signal<XxxContent | undefined> = this.contentFacade.$content;
  private userFacade: XxxUserFacade = inject(XxxUserFacade);
  $isUsersEmpty: Signal<boolean> = this.userFacade.$isUsersEmpty;
  $isUsersLoaded: Signal<boolean> = this.userFacade.$isUsersLoaded;
  $isUsersLoading: Signal<boolean> = this.userFacade.$isUsersLoading;
  $selectedUserId: Signal<number | undefined> = this.userFacade.$selectedUserId;
  $users: Signal<XxxUser[]> = this.userFacade.$users;

  constructor() {
    this.contentFacade.showContent(this.contentKey)
    this.userFacade.showUsers();
  }

  rowClick(user: XxxUser) {
    this.userFacade.selectUser(user.id);
  }
}
