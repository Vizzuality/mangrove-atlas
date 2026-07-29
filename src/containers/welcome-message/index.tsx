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
        className="fixed top-0 right-0 bottom-0 left-0 w-screen max-w-screen space-y-6 p-0 text-black/85 shadow-sm sm:max-h-none sm:p-0 md:top-1/2 md:right-auto md:bottom-auto md:left-1/2 md:max-h-[calc(100vh-4rem)] md:w-3xl md:max-w-[calc(100vw-7rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:overflow-visible md:p-0"
        hideScrollFade
      >
        <div className="relative m-0 flex h-full min-h-0 w-full flex-col md:static md:grid md:grid-cols-12">
          <div className="relative min-h-30 w-full flex-1 overflow-hidden md:col-span-6 md:h-full md:rounded-tl-3xl md:rounded-bl-3xl">
            <div className="absolute inset-0 h-full w-full">
              <Image
                src="/images/welcome-modal.webp"
                alt="Mangrove"
                fill
                priority
                className="absolute top-0 bottom-0 left-0 object-cover md:rounded-tl-3xl md:rounded-bl-3xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
          <div className="flex shrink-0 flex-col justify-between space-y-4 p-6 md:col-span-6 md:h-full md:overflow-y-auto">
            <DialogHeader className="space-y-6">
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
            <div className="flex items-center justify-between space-x-7">
              <Button onClick={handleClose} className="text-sm font-bold">
                Let’s explore the tool
              </Button>
            </div>
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
