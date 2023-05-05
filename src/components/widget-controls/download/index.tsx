import { DOWNLOAD } from 'containers/datasets';
import { EXT_MENU_OPTIONS } from 'containers/sidebar/constants';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import DOWNLOAD_SVG from 'svgs/ui/download.svg?sprite';

const Download = ({ id }) => {
  const DownloadInfo = DOWNLOAD[id];
  return (
    <>
      <div className="w-full pb-1 text-center font-sans text-xxs text-white">Download</div>
      <div className="flex h-[60px] w-[60px] flex-col items-center justify-center rounded-full bg-white text-brand-800">
        <Dialog>
          <DialogTrigger>
            <div className="flex justify-center">
              <Icon icon={DOWNLOAD_SVG} className="h-7.5 w-7.5 text-brand-800" />
            </div>
          </DialogTrigger>
          <DialogContent className="scroll-y top-24 h-[540px] rounded-[20px]">
            {DownloadInfo}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Download;
