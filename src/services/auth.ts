import { NextAPI, AuthAPI } from 'services/api';

// Types
export type ResetPasswordPayload = { user: { email: string } };
export type ResetPasswordResponse = { message?: string };
export type SignupPayload = { user: { email: string; password: string; name: string } };
export type SignupResponse =
  | { ok: true; data?: any; message?: string }
  | { ok: false; error?: string; message?: string; errors?: Record<string, string[]> };

// Functions
export function requestPasswordReset(payload: ResetPasswordPayload) {
  console.log('Requesting password reset for:', payload, AuthAPI.defaults.baseURL);
  return AuthAPI.post<ResetPasswordResponse>('/auth/password', payload).then((r) => r.data);
}

export function signupUser(payload: SignupPayload) {
  return NextAPI.post<SignupResponse>('/auth/signup', payload).then((r) => r.data);
}
