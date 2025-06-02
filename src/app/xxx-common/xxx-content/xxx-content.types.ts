export interface XxxContent {
  contentModel?: XxxContentModel;
  errorMessage?: string;
  key: string;
  status: XxxContentStatus;
}

export interface XxxContentApi {
  contentModel: XxxContentModel;
  key: string;
}

export interface XxxContentModel {
  bodyText?: string;
  pageTitle?: string;
}

export const xxxContentInitialState: XxxContentState = {
  contents: [],
};

export interface XxxContentState {
  contents: XxxContent[];
  selectedKey?: string;
}

export enum XxxContentStatus {
  EMPTY = 'EMPTY',
  ERROR = 'ERROR',
  LOADED = 'LOADED',
  LOADING = 'LOADING',
}
