import cn from '@/lib/classnames';

import ContactForm from '@/components/contact';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';

const Contact = ({ className }: { className?: string }) => {
  return (
    <Dialog>
      <DialogTrigger className={cn(className)}>Contact Us</DialogTrigger>

      <DialogContent
        data-testid="ContactForm-content"
        className="font-sans md:mb-20"
        classNameWrapper="sm:max-w-[436px]"
      >
        <DialogTitle className="mb-6 text-3xl leading-8 font-light text-black/85">
          Contact
        </DialogTitle>
        <ContactForm />
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default Contact;
