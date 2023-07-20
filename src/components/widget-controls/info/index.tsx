import { INFO } from 'containers/datasets';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';

import INFO_SVG from 'svgs/ui/info.svg?sprite';

const Info = ({ id, content }) => {
  const Info = INFO[id];

  if (!Info && !content) return null;
  return (
    <div className="flex h-[30px] w-[30px] flex-col items-center justify-center rounded-full bg-white text-brand-800">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex justify-center">
            <Icon icon={INFO_SVG} className="h-7.5 w-7.5 text-brand-800" />
          </div>
        </DialogTrigger>
        <DialogContent className="scroll-y left-18 top-16 h-[90%] rounded-3xl">
          <div className="no-scrollbar max-h-fit overflow-y-auto ">
            {/* Supports external content or look by id for static info about widgets */}
            {id && <Info />}
            {content && <p>{content}</p>}
          </div>
          <DialogClose />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Info;
