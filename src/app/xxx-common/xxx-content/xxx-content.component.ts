import { ChangeDetectionStrategy, Component, inject, Input, OnInit, Signal } from '@angular/core';
import { XxxContentFacade } from "./xxx-content-facade.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'xxx-content',
  standalone: true,
  styleUrl: './xxx-content.component.scss',
  templateUrl: './xxx-content.component.html',
})
export class XxxContentComponent implements OnInit {
  @Input({required: true}) contentKey!: string;
  private contentFacade: XxxContentFacade = inject(XxxContentFacade);
  $contentErrorMessage: Signal<string | undefined> = this.contentFacade.$contentErrorMessage;
  $isContentEmpty: Signal<boolean> = this.contentFacade.$isContentEmpty;
  $isContentError: Signal<boolean> = this.contentFacade.$isContentError;
  $isContentLoaded: Signal<boolean> = this.contentFacade.$isContentLoaded;
  $isContentLoading: Signal<boolean> = this.contentFacade.$isContentLoading;

  ngOnInit(): void {
    this.contentFacade.showContent(this.contentKey);
  }
}
