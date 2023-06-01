import cn from 'lib/classnames';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import FilterSites from './filter-sites';
import { useMangroveRestorationSites } from './hooks';

export const BUTTON_STYLES = 'rounded-[20px] py-1 px-4 text-sm font-semibold';
const RestorationSitesWidget = () => {
  const { isFetching, isFetched, data } = useMangroveRestorationSites();
  console.log(data);
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-8">
          <p>
            There are <span className="font-bold">{data.data.length}</span> restoration sites in{' '}
            {data.location}.
          </p>
          <Dialog>
            <DialogTrigger>
              <button className={cn({ 'bg-brand-800  text-white': true, [BUTTON_STYLES]: true })}>
                Filter sites
              </button>
            </DialogTrigger>
            <DialogContent className="h-fit-content rounded-[20px] p-10">
              <FilterSites />
              <DialogClose />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default RestorationSitesWidget;
