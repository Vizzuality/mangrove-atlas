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
export type UpdateUserPayload = {
  user: {
    email: string;
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

export function updateUser(payload: UpdateUserPayload, _token: string) {
  return AuthAPI.patch<UpdateUserResponse>('/users', payload, {}).then((r) => r.data);
}
