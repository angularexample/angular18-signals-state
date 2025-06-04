export interface XxxUser {
  firstName: string;
  id: number;
  lastName: string;
}

// Actual api user object has manu more fields but we require a smaller set
export interface XxxUserApiResponse {
  limit: number;
  skip: number;
  total: number;
  users: XxxUser[];
}

export const xxxUserInitialState: XxxUserState = {
  isUsersLoading: false,
  selectedUserId: undefined,
  users: []
};

export interface XxxUserState {
  isUsersLoading: boolean;
  selectedUserId: number | undefined;
  users: XxxUser[];
}
