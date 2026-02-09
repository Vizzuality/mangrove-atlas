import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { toast } from 'sonner';

import {
  requestPasswordReset,
  signupUser,
  updatePassword,
  updateUser,
  UpdateUserPayload,
  UpdateUserResponse,
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

export function usePutUpdateUser(token: string) {
  return useMutation<UpdateUserResponse, unknown, UpdateUserPayload>({
    mutationFn: (payload) => {
      return updateUser(payload, token);
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
