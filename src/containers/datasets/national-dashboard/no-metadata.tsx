import cn from '@/lib/classnames';

import ContactForm from '@/components/contact';
import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

import NO_DATA_SVG from '@/svgs/ui/no-data';

const NoMetadata = () => {
  return (
    <div className="flex w-full break-inside-avoid flex-col items-center justify-center gap-4 px-10 font-sans">
      <NO_DATA_SVG className="h-40 w-40 shrink-0 p-2" aria-hidden="true" />
      <p className="text-2lg text-center leading-7.25 font-light text-black/85">
        No data available. Help us expand our coverage by submitting yours.
      </p>
      {process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && (
        <Dialog>
          <DialogTrigger
            className={cn(
              buttonVariants({ variant: 'outline', size: 'none' }),
              'text-brand-800 border-brand-800/20 h-7.5 border-2 px-5 py-1.25 text-sm font-semibold'
            )}
          >
            Submit Data
          </DialogTrigger>
          <DialogContent
            data-testid="ContactForm-content"
            className={cn({
              'w-fit font-sans md:mb-20 md:w-135': true,
            })}
          >
            <div className="space-y-10 py-10">
              <div className="flex w-full flex-col space-y-4 py-4 font-sans text-black/85">
                <DialogTitle className="text-2xl leading-4 font-light md:pt-0 md:text-3xl">
                  Contact Us
                </DialogTitle>
              </div>
            </div>
            <ContactForm />
            <DialogClose />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NoMetadata;
