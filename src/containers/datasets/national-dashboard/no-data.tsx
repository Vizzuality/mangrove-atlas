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

const NoData = () => {
  return (
    <div className="flex flex-col items-start space-y-4 rounded-lg bg-black/5 px-6 py-5">
      <p className="font-sans text-xs leading-5 sm:text-base sm:leading-6">
        <b>No data</b> available. Help us expand our coverage by submitting yours.
      </p>

      <Dialog>
        <DialogTrigger
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'text-brand-800 border-brand-800/20 w-fit justify-start border-2 text-left'
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
            <div className="flex w-full flex-col space-y-4 font-sans text-black/85">
              <DialogTitle className="text-2xl leading-4 font-light md:pt-0 md:text-3xl">
                Contact Us
              </DialogTitle>
            </div>
          </div>
          <ContactForm />
          <DialogClose />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoData;
