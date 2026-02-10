import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = (): JSX.Element => {
  const pathname = usePathname();

  return (
    <div className="relative z-20 flex w-full justify-center bg-white p-4">
      <div className="flex flex-col items-center justify-center gap-1">
        {pathname !== '/auth/signin' ? (
          <p className="text-sm text-gray-800">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-brand-800 font-semibold">
              Sign In
            </Link>
          </p>
        ) : (
          <p className="text-sm text-gray-800">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-brand-800 font-semibold">
              Sign Up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Footer;
