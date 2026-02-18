import { LuBookmark } from 'react-icons/lu';

import cn from '@/lib/classnames';

import Helper from '@/containers/help/helper';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import LoginForm from '@/containers/auth/login-form';
import { useSession } from 'next-auth/react';
import SavedAreasContent from '../navigation/menu/profile/saved-areas';

const LuBookmarkIcon = LuBookmark as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

const SavedAreas = ({ menuItemStyle }: { menuItemStyle?: string }) => {
  const { status, update } = useSession();

  return (
    <Dialog>
      <Helper
        className={{
          button: '-top-1 right-4 z-20',
          tooltip: 'w-fit-content max-w-[400px]',
        }}
        tooltipPosition={{ top: -65, left: -5 }}
        message="Coming soon"
      >
        <DialogTrigger>
          <div className="mb-2 flex cursor-pointer flex-col items-center justify-center space-y-1 rounded-3xl p-2 text-sm">
            <LuBookmarkIcon
              className={cn({
                'h-8 w-8 stroke-1 text-white': true,
              })}
            />
            <p className="font-sans text-sm text-white md:whitespace-nowrap">Saved areas</p>
          </div>
        </DialogTrigger>
      </Helper>
      <DialogContent classNameContent="max-w-[calc(100vw-2rem)]">
        <div className={menuItemStyle}>
          {status === 'authenticated' ? (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-black/85">My areas</h2>
              <SavedAreasContent />{' '}
            </div>
          ) : (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-black/85">
                Log in to save areas of interest and receive alerts.
              </h2>
              <LoginForm />
            </div>
          )}
        </div>
        <DialogClose className="md:0 -top-2 md:absolute" />
      </DialogContent>
    </Dialog>
  );
};

export default SavedAreas;
