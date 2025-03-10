import { useCallback, useState, useEffect } from 'react';

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

// import { LuCirclePlay } from 'react-icons/lu';

const WelcomeIntroMessage = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(() => {
    return !localStorage.getItem('welcomeIntroMessage');
  });

  useEffect(() => {
    if (showWelcomeDialog) {
      localStorage.setItem('welcomeIntroMessage', 'true');
    }
  }, [showWelcomeDialog]);

  const handleClose = useCallback(() => {
    setShowWelcomeDialog(false);
  }, [setShowWelcomeDialog]);

  return (
    <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
      <DialogContent
        className="min-w-3xl sm:min-w-4xl fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-6 p-8 p-0 text-black/85 shadow-sm data-[state=open]:fade-in-60 data-[state=close]:fade-out
    data-[state=open]:slide-in-from-left-96 data-[state=close]:slide-out-to-right-96 md:max-w-3xl"
      >
        <DialogDescription className="grid h-full w-full grid-cols-12">
          <div className="relative col-span-6 h-full w-full overflow-hidden rounded-tl-3xl rounded-bl-3xl">
            <div className="absolute inset-0 h-full w-full">
              <Image
                src="/images/welcome-message.png"
                alt="Mangrove"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
          <div className="col-span-6 flex h-full flex-col justify-between space-y-4 p-6">
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
              {/* <button type="button" onClick={handleClose} className="text-sm font-bold">
                Demo video
              </button> */}
            </div>
          </div>
        </DialogDescription>
        <DialogClose onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeIntroMessage;
