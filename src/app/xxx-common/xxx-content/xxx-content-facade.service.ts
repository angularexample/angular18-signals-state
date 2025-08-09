import { inject, Injectable, Signal } from '@angular/core';
import { XxxContent } from "./xxx-content.types";
import { XxxContentStore } from "./xxx-content-store";

@Injectable({
  providedIn: 'root'
})
export class XxxContentFacade {
  // Store needs to be declared before it is used
  private contentStore: XxxContentStore = inject(XxxContentStore);
  readonly $content: Signal<XxxContent | undefined> = this.contentStore.$content_;
  readonly $contentErrorMessage: Signal<string | undefined> = this.contentStore.$errorMessage_;
  readonly $isContentEmpty: Signal<boolean> = this.contentStore.$isContentEmpty_;
  readonly $isContentError: Signal<boolean> = this.contentStore.$isContentError_;
  readonly $isContentLoading: Signal<boolean> = this.contentStore.$isContentLoading_;

  /**
   * Call this when you render a page that needs content.
   * @param key the key to the content for a given page
   */
  showContent(key: string): void {
    this.contentStore.showContentAction(key);
  }
}
