import {computed, inject, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {
  XxxContent,
  XxxContentApi,
  xxxContentInitialState,
  XxxContentState,
  XxxContentStatus
} from "./xxx-content.types";
import {catchError, of} from "rxjs";
import {XxxContentService} from "./xxx-content.service";
import {HttpErrorResponse} from "@angular/common/http";
import {XxxHttpUtilities} from "../xxx-utilities/xxx-http-utilities";

/**
 * XxxContentStore is the feature state for all content.
 * State management for Angular using only Signals and RxJS.
 * If you already know NgRx then we have organized it using the same categories.
 */
@Injectable({
  providedIn: 'root'
})
export class XxxContentStore {
  private contentService: XxxContentService = inject(XxxContentService);

  // State
  // Where we store all the properties needed to support the view
  private $contentState: WritableSignal<XxxContentState> = signal<XxxContentState>(xxxContentInitialState);

  // Actions
  // To trigger state changes which then change the view
  // If the operation is asynchronous use RxJS Subject
  // If not then we can call the effect or reducer directly

  // Action methods run the reducer and effect
  private getContentAction(key: string) {
    this.getContentReducer(key);
    this.getContentEffect(key);
  }

  private getContentErrorAction(key: string, err: HttpErrorResponse) {
    this.getContentErrorReducer(key, err);
  }

  private getContentSuccessAction(response: XxxContentApi) {
    this.getContentSuccessReducer(response);
  }

  showContentAction(key: string) {
    this.showContentReducer(key);
    this.showContentEffect(key);
  }

  // Selectors
  // Used to read current values from state.
  // All selectors have a name that ends with underscore.
  private $contents_: Signal<XxxContent[]> = computed(() =>
    this.$contentState().contents
  );

  // NOTE: A computed signal cannot take a parameter,
  // While an NgRx selector cam take a parameter.
  // The workaround is to store the parameter in state, then access it with a selector.
  // The flaw is the selected key could be overwritten if there are nearly simultaneous transactions of different keys!
  private $selectedKey_: Signal<string | undefined> = computed(() =>
    this.$contentState().selectedKey
  )

  $content_: Signal<XxxContent | undefined> = computed(() => {
    const selectedKey: string | undefined = this.$selectedKey_();
    const contents: XxxContent[] = this.$contents_();
    let content: XxxContent | undefined;
    if (selectedKey) {
      content = contents.find(item => item.key === selectedKey);
    }
    return content;
  })

  $errorMessage_: Signal<string | undefined> = computed(() => {
    const content: XxxContent | undefined = this.$content_();
    if (content) {
      return content?.errorMessage;
    }
    return undefined;
  })

  $isContentEmpty_: Signal<boolean> = computed(() => {
    const content: XxxContent | undefined = this.$content_();
    if (content) {
      return content?.status !== XxxContentStatus.ERROR && content?.status === XxxContentStatus.EMPTY;
    }
    return false;
  })

  $isContentError_: Signal<boolean> = computed(() => {
    const content: XxxContent | undefined = this.$content_();
    if (content) {
      return content?.status === XxxContentStatus.ERROR;
    }
    return false;
  })

  $isContentLoaded_: Signal<boolean> = computed(() => {
    const content: XxxContent | undefined = this.$content_();
    if (content) {
      return content?.status === XxxContentStatus.LOADED;
    }
    return false;
  })

  $isContentLoading_: Signal<boolean> = computed(() => {
    const content: XxxContent | undefined = this.$content_();
    if (content) {
      return content?.status === XxxContentStatus.LOADING;
    }
    return false;
  })

  // Reducers
  // The only place where we change or update the state values
  // When an action fires, we run the reducer before the effect
  // Reducers are where we update state
  private showContentReducer(selectedKey: string) {
    this.$contentState.update(state => ({...state, selectedKey}));
  }

  private getContentReducer(key: string) {
    // Remove any existing content, also replaces old array for immutability
    const contents: XxxContent[] = this.$contents_().filter(item => item.key !== key);
    // Create a new content object
    const content: XxxContent = {
      contentModel: undefined,
      errorMessage: undefined,
      status: XxxContentStatus.LOADING,
      key
    };
    // Add the new content object
    contents.push(content);
    // Finally update the state
    this.$contentState.update(state => ({
        ...state,
        contents
      })
    );
  }

  private getContentErrorReducer(key: string, err: HttpErrorResponse) {
    // Set the error message
    const errorMessage: string = `Key '${key}'. ${XxxHttpUtilities.setErrorMessage(err)}`;
    // Remove any existing content, also replaces old array for immutability
    const contents: XxxContent[] = this.$contents_().filter(item => item.key !== key);
    // Create a new content object
    const content: XxxContent = {
      contentModel: undefined,
      errorMessage,
      status: XxxContentStatus.ERROR,
      key
    };
    // Add the new content object
    contents.push(content);
    // Finally update the state
    this.$contentState.update(state => ({
        ...state,
        contents
      })
    );
  }

  private getContentSuccessReducer(contentApi: XxxContentApi) {
    // Create a new content object
    const content: XxxContent = {
      contentModel: contentApi.contentModel,
      status: contentApi.contentModel.pageTitle && contentApi.contentModel.pageTitle ? XxxContentStatus.LOADED : XxxContentStatus.EMPTY,
      key: contentApi.key
    };
    // Remove any existing content, also replaces old array for immutability
    const contents: XxxContent[] = this.$contents_().filter(item => item.key !== content.key);
    // Add the new content object
    contents.push(content);
    // Finally update the state
    this.$contentState.update(state => ({
        ...state,
        contents
      })
    );
  }

  // Effects
  // For data access, navigation, or to open a dialog
  // They are often used to run a service
  getContentEffect(key: string) {
    let isError = false;
    this.contentService.getContent(key)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          isError = true;
          this.getContentErrorAction(key, err);
          // return an empty response object
          return of({
            contentModel: {},
            key
          });
        })
      )
      .subscribe(response => {
        if (!isError) {
          this.getContentSuccessAction(response);
        }
      });
  }

  showContentEffect(key: string) {
    // Check to see if content already exists
    const isContentLoaded: boolean = this.$isContentLoaded_();
    // If content is not loaded then load it
    if (!this.$isContentLoaded_()) {
      this.getContentAction(key);
    }
  }
}
