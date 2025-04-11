import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from 'components/ui/dialog';

const WelcomeIntroMessage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('welcomeIntroMessage');
    if (!hasSeenWelcome) {
      setIsOpen(true);
      localStorage.setItem('welcomeIntroMessage', 'true');
    }

    setIsReady(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!isReady) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* TO - DO - fix this and improve dialog component*/}
      <DialogContent
        classNameContent="animate-none duration-0"
        className="min-w-screen max-w-screen fixed top-0 left-0 right-0 bottom-0 space-y-6 p-0 text-black/85 shadow-sm sm:left-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:-translate-x-1/2 sm:p-8 md:max-w-3xl"
      >
        <DialogDescription className="relative flex h-full w-full flex-col sm:static sm:grid sm:grid-cols-12">
          <div className="relative h-[calc(100vh/2)] w-full overflow-hidden sm:col-span-6 sm:h-full sm:rounded-bl-3xl sm:rounded-tl-3xl">
            <div className="absolute inset-0 h-full w-full sm:h-full">
              <Image
                src="/images/welcome-modal.webp"
                alt="Mangrove"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
          <div className="flex h-[calc(100vh/2)] flex-col justify-between space-y-4 p-6 sm:col-span-6 sm:h-full">
            <DialogHeader className="space-y-6">
              <DialogTitle className="text-3xl font-light">
                Thriving mangroves are key to the health of nature and effective climate action
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm font-light">
              Global Mangrove Watch (GMW) is an online platform that provides the remote sensing
              data and tools for monitoring mangroves necessary for this. It gives universal access
              to near real-time information on where and what changes there are to mangroves across
              the world, and highlights why they are valuable. With hi-res information on
              topography, soil conditions and hydrology, Global Mangrove Watch gives coastal and
              park managers, conservationists, policymakers and practitioners the evidence needed to
              respond to illegal logging, pinpoint the causes of local mangrove loss and track
              restoration progress. It is a tool that can help mangroves be central to climate
              mitigation, adaptation and sustainable development plans and policies.
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
