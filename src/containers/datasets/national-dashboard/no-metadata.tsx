import cn from '@/lib/classnames';
import NO_DATA_SVG from '@/svgs/ui/no-data';

import ContactForm from '@/components/contact';
import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

const NoMetadata = () => {
  return (
    <div className="m-auto flex w-full max-w-full break-inside-avoid flex-col items-center justify-center space-y-4 rounded-3xl bg-white py-8">
      <NO_DATA_SVG className="h-40 w-40 fill-current" role="img" title="No data" />
      <p className="max-w-80 text-center font-sans text-lg leading-5 font-light sm:text-base sm:leading-6">
        No data available. Help us expand our coverage by submitting yours.
      </p>
      {process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && (
        <Dialog>
          <DialogTrigger
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'text-brand-800 border-brand-800/20 w-fit justify-start border-2 text-left text-sm'
            )}
          >
            Submit Data
          </DialogTrigger>
          <DialogContent
            data-testid="ContactForm-content"
            className={cn({
              'w-fit font-sans md:mb-20 md:w-[540px]': true,
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
