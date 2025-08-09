import { inject, Injectable, Signal } from '@angular/core';
import { XxxContent } from "./xxx-content.types";
import { XxxContentStore } from "./xxx-content-store";


@Injectable({
  providedIn: 'root'
})
export class XxxContentFacade {
  // Store needs to be declared before it is used
  private contentStore: XxxContentStore = inject(XxxContentStore);

  $content: Signal<XxxContent | undefined> = this.contentStore.$content_;
  $contentErrorMessage: Signal<string | undefined> = this.contentStore.$errorMessage_;
  $isContentEmpty: Signal<boolean> = this.contentStore.$isContentEmpty_;
  $isContentError: Signal<boolean> = this.contentStore.$isContentError_;
  $isContentLoaded: Signal<boolean> = this.contentStore.$isContentLoaded_;
  $isContentLoading: Signal<boolean> = this.contentStore.$isContentLoading_;

  /**
   * Call this when you render a page that needs content.
   * @param key the key to the content for a given page
   */
  showContent(key: string): void {
    this.contentStore.showContentAction(key);
  }
}
