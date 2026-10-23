import { NextAPI, AuthAPI } from 'services/api';

// Types
export type ResetPasswordPayload = { user: { email: string; source?: 'gmw' | undefined } }; // Optional. Specifies which frontend should handle the password reset. 'gmw' uses GMW_UI_BASE_URL, other values or omitted will use MRTT_UI_BASE_URL
export type ResetPasswordUpdatePayload = {
  user: { password: string; password_confirmation: string; reset_password_token: string };
};
type ResetPasswordResponse = { message?: string };
export type SignupPayload = {
  user: {
    email: string;
    password: string;
    name: string;
    organization?: string;
    user_roles?: string[];
    user_role_other?: string;
  };
};
export type SignupResponse =
  | { ok: true; data?: any; message?: string }
  | { ok: false; error?: string; message?: string; errors?: Record<string, string[]> };
// Saved default map view (GMW-1159). Stored on the user as nullable JSON; `null` means
// "use the platform default". `saved_at` is server-set.
export type UserSettings = {
  basemap: 'light' | 'dark' | 'satellite';
  bounds?: [[number, number], [number, number]];
  widgets: string[];
  layers: { id: string; opacity: number }[];
  saved_at?: string;
};
export type UpdateUserPayload = {
  user: {
    email: string;
    settings?: UserSettings | null;
    password?: string;
    name?: string;
    organization?: string;
    user_roles?: string[];
    user_role_other?: string;
    // Only required by the API when changing the password.
    current_password?: string;
  };
};
export type UpdateUserResponse =
  | { ok: true; data?: any; message?: string }
  | { ok: false; error?: string; message?: string; errors?: Record<string, string[]> };

// Functions
export function requestPasswordReset(payload: ResetPasswordPayload) {
  return AuthAPI.post<ResetPasswordResponse>('/users/password', payload).then((r) => r.data);
}

export function updatePassword(payload: ResetPasswordUpdatePayload) {
  return AuthAPI.patch<ResetPasswordResponse>('/users/password', payload).then((r) => r.data);
}

export function signupUser(payload: SignupPayload) {
  return NextAPI.post<SignupResponse>('/auth/signup', payload).then((r) => r.data);
}

export function updateUser(payload: UpdateUserPayload) {
  // Update goes straight to the auth service (Devise registrations#update on /users).
  // The same-origin /auth/me proxy 401s in some envs, so we call the BE directly; the
  // bearer token is attached client-side by the AuthAPI interceptor from the (SSO-kept)
  // session. current_user is GET-only, so the PATCH target is /users.
  return AuthAPI.patch<UpdateUserResponse>('/users', payload).then((r) => r.data);
}
