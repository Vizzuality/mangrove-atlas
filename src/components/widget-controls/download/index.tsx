import { DOWNLOAD } from 'containers/datasets';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';

import DOWNLOAD_SVG from 'svgs/ui/download.svg?sprite';

const Download = ({ id, content }) => {
  const DownloadInfo = DOWNLOAD[id];

  if (!DownloadInfo && !content) return null;
  return (
    <div className="flex h-[30px] w-[30px] flex-col items-center justify-center rounded-full bg-white text-brand-800">
      <Dialog>
        <DialogTrigger>
          <div className="flex justify-center">
            <Icon icon={DOWNLOAD_SVG} className="h-7.5 w-7.5 text-brand-800" />
          </div>
        </DialogTrigger>
        <DialogContent className="top-24 rounded-3xl">
          <div className="max-h-[90%] overflow-y-auto">
            {id && <DownloadInfo />}
            {content && <p>{content}</p>}
          </div>
          <DialogClose />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Download;
