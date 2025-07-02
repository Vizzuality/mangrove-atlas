import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import { useLocalStorage } from 'usehooks-ts';

import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';

const WelcomeIntroMessage = () => {
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage<boolean>(
    'welcomeIntroMessage',
    false
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, [hasSeenWelcome]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setHasSeenWelcome(true);
  }, [setHasSeenWelcome]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        classNameContent="animate-none duration-0 min-h-fit min-h-[460px]"
        className="max-w-screen fixed top-0 left-0 right-0 bottom-0 min-h-[460px] w-screen space-y-6 p-0 text-black/85 shadow-sm sm:left-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:-translate-x-1/2 md:max-w-3xl"
      >
        <DialogDescription className="relative flex h-full w-full flex-col sm:grid sm:grid-cols-12">
          <div className="relative min-h-min w-full sm:col-span-6 sm:h-full sm:rounded-bl-3xl sm:rounded-tl-3xl">
            <div className="absolute top-0 h-full w-full sm:h-full">
              <Image
                src="/images/welcome-modal.webp"
                alt="Mangrove"
                fill
                className="rounded-tl-3xl rounded-bl-3xl object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
          <div className="flex flex-col justify-between space-y-4 p-6 sm:col-span-6 sm:h-full sm:p-8">
            <DialogHeader className="space-y-6">
              <DialogTitle className="text-3xl font-light">
                Thriving mangroves are key to the health of nature and effective climate action
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm font-light">
              Global Mangrove Watch (GMW) is an online platform that provides the remote sensing
              data and tools for monitoring mangroves necessary for this. It gives universal access
              to near real-time information on where and what changes there are to mangroves across
              the world, and highlights why they are valuable...
            </p>
            <div className="flex items-center justify-between space-x-7">
              <Button onClick={handleClose} className="text-sm font-bold">
                Let’s explore the tool
              </Button>
            </div>
          </div>
        </DialogDescription>
        <DialogClose onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeIntroMessage;
