import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  requestPasswordReset,
  signupUser,
  updatePassword,
  updateUser,
  UpdateUserPayload,
  UpdateUserResponse,
  type UserSettings,
  type ResetPasswordPayload,
  type ResetPasswordUpdatePayload,
  type SignupPayload,
  type SignupResponse,
} from 'services/auth';

/* =========================
   Reset password
   ========================= */

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => requestPasswordReset(payload),

    onSuccess: (data) => {
      console.info('Email sent successfully:', data);
      toast.success('Please check your inbox for instructions to reset your password.');
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error('Reset password error:', error.response?.data);
      }
    },
  });
}

/* =========================
   Reset password update
   ========================= */

export function usePutResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordUpdatePayload) => updatePassword(payload),

    onSuccess: (data) => {
      console.info('Password updated successfully:', data);
      toast.success('Your password has been updated successfully.');
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error('Reset password error:', error.response?.data);
      }
    },
  });
}

/* =========================
   Signup
   ========================= */

export function useSignup() {
  return useMutation<SignupResponse, unknown, SignupPayload>({
    mutationFn: (payload) => signupUser(payload),

    onSuccess: () => {
      toast.success(
        'A confirmation link has been sent to the email provided. Please click the link in that email to activate your account.'
      );
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error('Signup error:', error.response?.data);
      }
    },
  });
}

/* =========================
   Default map view (user settings)
   ========================= */

export function useUpdateDefaultView() {
  const { data: session, update: updateSession } = useSession();

  return useMutation<UpdateUserResponse, unknown, UserSettings | null>({
    mutationFn: (settings) => updateUser({ user: { email: session?.user?.email ?? '', settings } }),

    onSuccess: (res, settings) => {
      // Prefer the persisted record (carries the server-set saved_at).
      type Persisted = { settings?: UserSettings | null };
      const body = res as { user?: Persisted; data?: Persisted };
      const persisted = body?.user ?? body?.data;
      void updateSession({
        settings: persisted?.settings !== undefined ? persisted.settings : settings,
      });
      toast.success(
        settings ? 'Your default view has been saved.' : 'Your default view has been reset.'
      );
    },

    onError: (error) => {
      toast.error('We could not update your default view. Please try again.');
      if (axios.isAxiosError(error)) {
        console.error('Update default view error:', error.response?.data);
      }
    },
  });
}

export function usePutUpdateUser() {
  return useMutation<UpdateUserResponse, unknown, UpdateUserPayload>({
    mutationFn: (payload) => {
      return updateUser(payload);
    },

    onSuccess: () => {
      toast.success('User details have been updated successfully.');
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error('Update user error:', error.response?.data);
      }
    },
  });
}
