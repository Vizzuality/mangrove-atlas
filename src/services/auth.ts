import { NextAPI, AuthAPI } from 'services/api';

import API from 'services/api';

// Types
export type ResetPasswordPayload = { user: { email: string } };
export type ResetPasswordUpdatePayload = {
  user: { password: string; password_confirmation: string; reset_password_token: string };
};
export type ResetPasswordResponse = { message?: string };
export type SignupPayload = { user: { email: string; password: string; name: string } };
export type SignupResponse =
  | { ok: true; data?: any; message?: string }
  | { ok: false; error?: string; message?: string; errors?: Record<string, string[]> };
export type UpdateUserPayload = {
  user: {
    email: string;
    password?: string;
    name?: string;
    organization?: string;
    current_password: string;
  };
};
export type UpdateUserResponse =
  | { ok: true; data?: any; message?: string }
  | { ok: false; error?: string; message?: string; errors?: Record<string, string[]> };

// Functions
export function requestPasswordReset(payload: ResetPasswordPayload) {
  console.info('Requesting password reset for:', payload, AuthAPI.defaults.baseURL);
  return AuthAPI.post<ResetPasswordResponse>('/password', payload).then((r) => r.data);
}

export function updatePassword(payload: ResetPasswordUpdatePayload) {
  console.info('Updating password for:', payload, AuthAPI.defaults.baseURL);
  return AuthAPI.put<ResetPasswordResponse>('/password', payload).then((r) => r.data);
}

export function signupUser(payload: SignupPayload) {
  return NextAPI.post<SignupResponse>('/auth/signup', payload).then((r) => r.data);
}

export function updateUser(payload: UpdateUserPayload, token: string) {
  return AuthAPI.put<UpdateUserResponse>('/users', payload, {}).then((r) => r.data);
}
