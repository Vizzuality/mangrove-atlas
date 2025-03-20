import cn from 'lib/classnames';

// import Helper from 'containers/help/helper';

import ContactForm from 'components/contact';
import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/ui/dialog';

const Contact = ({ className }: { className?: string }) => {
  return (
    <Dialog>
      {/* <Helper
        className={{
          button: '-top-2 -right-4',
          tooltip: 'w-fit-content',
        }}
        tooltipPosition={{ top: -40, left: 0 }}
        message=""
      > */}
      <DialogTrigger className={cn({ [className]: !!className })}>Contact</DialogTrigger>
      {/* </Helper> */}

      <DialogContent
        data-testid="ContactForm-content"
        className={cn({
          'font-sans md:mb-20 md:w-[436px]': true,
        })}
      >
        <div className="space-y-10 py-10">
          <div className="flex w-full flex-col space-y-4 font-sans text-black/85">
            <h2 className="text-2xl font-light leading-4 md:pt-0 md:text-3xl">Contact</h2>
          </div>
        </div>
        <ContactForm />
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default Contact;
