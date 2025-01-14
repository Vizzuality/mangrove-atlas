import cn from 'lib/classnames';

import Helper from 'containers/guide/helper';

import ContactForm from 'components/contact';
import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/ui/dialog';

const Contact = () => {
  return (
    <Dialog>
      <Helper
        className={{
          button: '-top-2 -right-4',
          tooltip: 'w-fit-content',
        }}
        theme="dark"
        tooltipPosition={{ top: -40, left: 0 }}
        message=""
      >
        <DialogTrigger>
          <span className="text-left text-2lg font-light hover:text-brand-800">Contact</span>
        </DialogTrigger>
      </Helper>

      <DialogContent
        data-testid="ContactForm-content"
        className={cn({
          'min-w-[540px] font-sans md:mb-20': true,
        })}
      >
        <div className="space-y-10 py-10">
          <div className="flex w-full flex-col space-y-4 font-sans text-black/85">
            <h2 className="pb-8 text-2xl font-light leading-4 md:pt-0 md:text-3xl">Contact</h2>
          </div>
        </div>
        <ContactForm />
        <DialogClose className="md:fixed md:!top-18 md:left-[595px]" />
      </DialogContent>
    </Dialog>
  );
};

export default Contact;
