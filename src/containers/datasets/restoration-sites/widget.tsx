import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import FilterSites from './filter-sites';
import { useMangroveRestorationSites } from './hooks';

const RestorationSitesWidget = () => {
  const { location, isFetching, isFetched, data } = useMangroveRestorationSites();
  console.log(data);
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <>
          <p>
            There are <span className="font-bold">{data.data.length}</span> restoration sites in{' '}
            {data.location}.
          </p>
          <Dialog>
            <DialogTrigger>
              <button>Filter sites</button>
            </DialogTrigger>
            <DialogContent className="h-[90vh] w-[540px] rounded-[20px] px-10 pt-10 pb-0">
              <FilterSites />
              <DialogClose />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default RestorationSitesWidget;
