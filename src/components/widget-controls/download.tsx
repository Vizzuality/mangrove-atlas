import { DOWNLOAD } from 'containers/datasets';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import DOWNLOAD_SVG from 'svgs/ui/download.svg?sprite';

import Helper from 'containers/help/helper';
import { HELPER_POSITION } from './constants';
import { trackEvent } from 'lib/analytics/ga';

/**
 * Download component
 *
 * This component renders a download button that opens a modal dialog.
 * It can display one of two types of content depending on the props:
 *
 * 1. Static Markdown-based dataset info:
 *    - If the `id` prop is passed and matches an entry in the `DOWNLOAD` map,
 *      the corresponding component (typically rendering markdown) is shown.
 *    - This is used in standard widgets where each widget is tied to a single dataset,
 *      and the info is static and general for the dataset/widget.
 *
 * 2. Dynamic content object:
 *    - If the `content` prop is passed (and `id` is not), it expects an object with
 *      `{ name, description, link }` to display a download resource.
 *    - This is specifically used for the "National Dashboards" widget, where each location
 *      can have multiple dataset resources with dynamic metadata.
 *    - These resources are location-specific and change depending
 *      on the selected geography.
 *
 * Props:
 * - id (string): Optional ID used to retrieve static dataset info from the DOWNLOAD map.
 * - content (object): Optional dynamic object for location-specific download info.
 *   - name (string): Title of the dataset or resource.
 *   - description (string): (Optional) Additional description.
 *   - link (string): URL to the downloadable resource.
 */

const Download = ({ id, content }) => {
  const DownloadInfo = DOWNLOAD[id];

  if (!DownloadInfo && !content) return null;

  // Google Analytics tracking
  const handleAnalytics = () =>
    trackEvent(`Widget Download data - ${id}`, {
      action: 'widget download data',
      label: `Download data for widget ${id}`,
    });

  return (
    <Dialog onOpenChange={handleAnalytics}>
      <Helper
        className={{
          button: HELPER_POSITION,
          tooltip: 'w-fit-content max-w-[400px]',
        }}
        tooltipPosition={{ top: -35, left: 0 }}
        message="Use this function to download spatial data associated with this widget and map layer. Links may point to external sources. Not all data layers are available for download. "
      >
        <DialogTrigger className="flex h-full items-center">
          <Icon icon={DOWNLOAD_SVG} className="h-7.5 w-7.5 text-brand-800" description="Download" />
        </DialogTrigger>
      </Helper>
      <DialogContent>
        <div className="no-scrollbar w-[480px] overflow-y-auto">
          {id && <DownloadInfo />}
          {content && !id && (
            <div className="flex flex-col items-start justify-start space-y-4">
              <h2 className="font-black/85 text-3xl font-light leading-10">Download Data</h2>
              <p className="text-sm font-extralight text-black/85">{content.description}</p>
              {content.link && (
                <a
                  title={content.name}
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-800 underline"
                >
                  {content.name || content.link}
                </a>
              )}
            </div>
          )}
        </div>
        <DialogClose className="top-6" />
      </DialogContent>
    </Dialog>
  );
};

export default Download;
