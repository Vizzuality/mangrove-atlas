import { useCallback, useState } from 'react';

import Image from 'next/image';

import { useLocalStorage } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const WelcomeIntroMessage = () => {
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage<boolean>(
    'welcomeIntroMessage',
    false
  );
  const [dismissed, setDismissed] = useState(false);
  const isOpen = !hasSeenWelcome && !dismissed;

  const handleClose = useCallback(() => {
    setDismissed(true);
    setHasSeenWelcome(true);
  }, [setHasSeenWelcome]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger className="sr-only">Welcome message</DialogTrigger>
      <DialogContent
        classNameContent="animate-none duration-0"
        // From `md` up the card gets a *definite* height (`h-[405px]`, clamped by
        // `max-h` on short viewports). Without it the row height is content-driven,
        // `h-full` on the columns can't resolve, and the image column ends up
        // shorter than the text column. The fixed height also stops the content
        // stretching on tall viewports.
        className="fixed top-0 right-0 bottom-0 left-0 w-screen max-w-screen p-0 text-black/85 shadow-sm sm:max-h-none sm:p-0 md:top-1/2 md:right-auto md:bottom-auto md:left-1/2 md:h-[405px] md:max-h-[calc(100vh-4rem)] md:w-3xl md:max-w-[calc(100vw-7rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:overflow-visible md:p-0"
        hideScrollFade
      >
        {/* Stays `relative` at every breakpoint so the close button anchors to the
            card itself — the wrapper above it is capped at `sm:max-w-135`, which
            put the `md:-right-10` offset inside the card. */}
        <div className="relative flex h-full min-h-0 w-full flex-col md:grid md:grid-cols-2">
          <div className="relative min-h-30 w-full flex-1 overflow-hidden md:h-full md:min-h-0 md:rounded-l-3xl">
            <Image
              src="/images/welcome-modal.webp"
              alt="Mangrove"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
            />
          </div>
          {/* `shrink-0` keeps the copy at its natural height on mobile, where the
              image column absorbs the leftover space instead. */}
          <div className="flex shrink-0 flex-col gap-4 overflow-y-auto p-6 md:h-full md:min-h-0 md:p-8">
            <DialogHeader>
              <DialogTitle className="text-3xl font-light">
                Thriving mangroves are key to the health of nature and effective climate action
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-sm font-light">
              Global Mangrove Watch (GMW) is an online platform that provides the remote sensing
              data and tools for monitoring mangroves necessary for this. It gives universal access
              to near real-time information on where and what changes there are to mangroves across
              the world, and highlights why they are valuable...
            </DialogDescription>
            <Button onClick={handleClose} className="self-start text-sm font-bold">
              Let’s explore the tool
            </Button>
          </div>
          <DialogClose
            onClose={handleClose}
            className="sm:top-4 sm:right-4 sm:rounded-none md:-right-10 md:rounded-r-[20px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeIntroMessage;
