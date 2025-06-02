import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {XxxContent} from "../xxx-common/xxx-content/xxx-content.types";
import {XxxContentComponent} from '../xxx-common/xxx-content/xxx-content.component';
import {XxxContentFacade} from "../xxx-common/xxx-content/xxx-content-facade.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    XxxContentComponent,
  ],
  selector: 'xxx-home',
  standalone: true,
  templateUrl: './xxx-home.component.html',
})
export class XxxHomeComponent {
  contentFacade: XxxContentFacade = inject(XxxContentFacade);
  contentKey = 'home';
  $content: Signal<XxxContent | undefined> = this.contentFacade.$content;

  constructor() {
    this.contentFacade.showContent(this.contentKey);
  }
}
