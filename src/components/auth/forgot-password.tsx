import Link from 'next/link';

export function ForgotPassword() {
  return (
    <Link href="/auth/forgot-password" className="text-sm font-semibold hover:text-teal-300">
      Forgot your password?
    </Link>
  );
}

export default ForgotPassword;
