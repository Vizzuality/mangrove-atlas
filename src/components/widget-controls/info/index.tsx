import { INFO } from 'containers/datasets';
import { EXT_MENU_OPTIONS } from 'containers/sidebar/constants';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import INFO_SVG from 'svgs/ui/info.svg?sprite';

const Info = ({ id }) => {
  const Info = INFO[id];

  if (!Info) return null;
  return (
    <div className="flex h-[30px] w-[30px] flex-col items-center justify-center rounded-full bg-white text-brand-800">
      <Dialog>
        <DialogTrigger>
          <div className="flex justify-center">
            <Icon icon={INFO_SVG} className="h-7.5 w-7.5 text-brand-800" />
          </div>
        </DialogTrigger>
        <DialogContent className="scroll-y top-24 h-[540px] rounded-[20px]">
          <Info />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Info;