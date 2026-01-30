import ContactForm from 'containers/contact';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

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
            className="text-left text-2lg font-light hover:text-brand-800"
            onClick={() => setSection('profile')}
          >
            My profile
          </button>

          <button
            type="button"
            className="text-left text-2lg font-light hover:text-brand-800"
            onClick={handleLogout}
          >
            Log out
          </button>
        </>
      )}

      {session.status !== 'authenticated' && (
        <Link href="/auth/signin" className="text-left text-2lg font-light hover:text-brand-800">
          Log in
        </Link>
      )}
      <ContactForm className="text-left text-2lg font-light hover:text-brand-800" />
    </div>
  );
};
