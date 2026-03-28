export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface UserWithStringDate {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export type GetUsersResult =
  | { success: true; users: User[]; adminCount: number }
  | { success: false; error: string };

export type DeleteUserResult =
  | { success: true; deletedSelf?: boolean }
  | { success: false; error: string };

export type PromoteUserResult = { success: true } | { success: false; error: string };

export type DeleteAllAnalyticsEntriesResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type DeleteAllDomainsResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type ResetDatabaseResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type LoginResult =
  | { success: true; user: { id: string; email: string } }
  | { success: false; error: string };

export type RegisterResult =
  | { success: true; user: { id: string; email: string; role: string } }
  | { success: false; error: string };

export type CurrentUserResult = { id: string; email: string; role: string } | null;

export type UsersExistResult = { hasUsers: boolean };

export type VerifyTokenResult =
  | { valid: true; email: string; role: string }
  | { valid: false; error: string };

export type VerifyResult = { success: true; message: string } | { success: false; error: string };

export type RequestResetResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type ValidateResetTokenResult =
  | { valid: true; email: string }
  | { valid: false; error: string };

export type ResetPasswordResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type InviteResult = { success: true; message: string } | { success: false; error: string };

export type ChangePasswordResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type CreateUserResult = { success: true } | { success: false; error: string };

export interface CurrentUser {
  id: string;
  email: string;
  role: string;
}
