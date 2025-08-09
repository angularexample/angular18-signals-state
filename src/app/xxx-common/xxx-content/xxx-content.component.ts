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
  protected readonly $contentErrorMessage: Signal<string | undefined> = this.contentFacade.$contentErrorMessage;
  protected readonly $isContentEmpty: Signal<boolean> = this.contentFacade.$isContentEmpty;
  protected readonly $isContentError: Signal<boolean> = this.contentFacade.$isContentError;
  protected readonly $isContentLoading: Signal<boolean> = this.contentFacade.$isContentLoading;

  ngOnInit(): void {
    this.contentFacade.showContent(this.contentKey);
  }
}
