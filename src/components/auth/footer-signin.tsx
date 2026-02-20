import Link from 'next/link';

const Footer = (): JSX.Element => (
  <div className="relative z-20 flex w-full justify-center bg-white p-4">
    <div className="flex flex-col items-center justify-center gap-1">
      <p className="text-sm text-gray-800">
        Already have an account?{' '}
        <Link href="/auth/signin" className="text-brand-800 font-semibold">
          Sign In
        </Link>
      </p>
    </div>
  </div>
);

export default Footer;
