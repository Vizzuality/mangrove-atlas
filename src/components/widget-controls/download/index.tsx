import { DOWNLOAD } from 'containers/datasets';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';

import DOWNLOAD_SVG from 'svgs/ui/download.svg?sprite';

const Download = ({ id, content }) => {
  const DownloadInfo = DOWNLOAD[id];

  if (!DownloadInfo && !content) return null;

  const markdownParser = (text) => {
    const toHTML = text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
      .replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
      .replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>') // bold text
      .replace(/\*(.*)\*/gim, '<i>$1</i>'); // italic text
    return toHTML.trim(); // using trim method to remove whitespace
  };
  return (
    <div className="flex h-[30px] w-[30px] flex-col items-center justify-center rounded-full bg-white text-brand-800">
      <Dialog>
        <DialogTrigger>
          <Icon icon={DOWNLOAD_SVG} className="h-7.5 w-7.5 text-brand-800" description="Download" />
        </DialogTrigger>
        <DialogContent className="scroll-y top-0 left-0 min-h-screen w-screen md:left-18 md:top-16 md:max-h-[90%] md:min-h-fit md:rounded-3xl">
          <div className="no-scrollbar overflow-y-auto">
            {id && <DownloadInfo />}
            {content && !id && (
              <div className="flex p-4">
                <h2 className="font-black/85 text-3xl font-light leading-10">Download Data</h2>
                <div className="space-y-2">
                  <div
                    className="prose py-4"
                    dangerouslySetInnerHTML={{ __html: markdownParser(content) }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogClose className="top-6" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Download;
