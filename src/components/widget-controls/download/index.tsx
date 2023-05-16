import { DOWNLOAD } from 'containers/datasets';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';

import DOWNLOAD_SVG from 'svgs/ui/download.svg?sprite';

const Download = ({ id }) => {
  const DownloadInfo = DOWNLOAD[id];
  return (
    <>
      <div className="w-full pb-1 text-center font-sans text-xxs text-white">Download</div>
      <div className="flex h-[30px] w-[30px] flex-col items-center justify-center rounded-full bg-white text-brand-800">
        <Dialog>
          <DialogTrigger>
            <div className="flex justify-center">
              <Icon icon={DOWNLOAD_SVG} className="h-7.5 w-7.5 text-brand-800" />
            </div>
          </DialogTrigger>
          <DialogContent className="scroll-y top-24 rounded-[20px]">
            <DownloadInfo />
            <DialogClose />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Download;
