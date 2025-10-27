import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = (): JSX.Element => {
  const pathname = usePathname();
  console.log(pathname, pathname === '/auth/signin');
  return (
    <div className="relative z-20 flex h-24 w-full justify-center bg-white p-4">
      <div className="flex flex-col items-center justify-center gap-1">
        {pathname === '/auth/signin' ? (
          <p className="pt-6 text-sm text-gray-800">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-semibold text-brand-800">
              Sign In
            </Link>
          </p>
        ) : (
          <p className="pt-6 text-sm text-gray-800">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-semibold text-brand-800">
              Sign Up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Footer;
