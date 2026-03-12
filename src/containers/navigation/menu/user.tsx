import Link from 'next/link';

import { signOut, useSession } from 'next-auth/react';

async function handleLogout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  await signOut();
}

export const UserMenu = ({ setSection }) => {
  const session = useSession();

  return (
    <div className="flex w-full flex-col space-y-4 font-sans text-black/85">
      {session.status === 'authenticated' && (
        <>
          <button
            type="button"
            className="text-2lg hover:text-brand-800 text-left font-light"
            onClick={() => setSection('profile')}
          >
            My profile
          </button>

          <button
            type="button"
            className="text-2lg hover:text-brand-800 text-left font-light"
            onClick={handleLogout}
          >
            Log out
          </button>
        </>
      )}

      {session.status !== 'authenticated' && (
        <Link href="/auth/signin" className="text-2lg hover:text-brand-800 text-left font-light">
          Log in
        </Link>
      )}
    </div>
  );
};
