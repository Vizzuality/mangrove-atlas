import { INFO } from 'containers/datasets';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import INFO_SVG from 'svgs/ui/info.svg?sprite';

const Info = ({ id, content }) => {
  const Info = INFO[id];

  if (!Info && !content) return null;
  return (
    <div className="flex h-[30px] w-[30px] flex-col items-center justify-center rounded-full bg-white text-brand-800">
      <Dialog>
        <DialogTrigger>
          <Icon icon={INFO_SVG} className="h-7.5 w-7.5 text-brand-800" description="Info" />
        </DialogTrigger>
        <DialogContent className="w-screen md:mb-20 md:w-auto">
          <div className="no-scrollbar overflow-y-auto">
            {/* Supports external content or look by id for static info about widgets */}
            {id && <Info />}
            {content && <p>{content}</p>}
          </div>
          <DialogClose className="md:0 -top-2 md:absolute" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Info;
