import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { toast } from 'sonner';

import {
  requestPasswordReset,
  signupUser,
  type ResetPasswordPayload,
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
