import NoData from 'containers/widgets/no-data';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Loading from 'components/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import IUCNEcoregionsChart from './chart';
import { useMangroveEcoregions } from './hooks';

const IUCNEcoregions = () => {
  const { data, isLoading, isFetched } = useMangroveEcoregions();

  if (!data) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isLoading && !isFetched} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && !isLoading && (
        <div>
          <p className={WIDGET_SENTENCE_STYLE}>
            According to the IUCN evaluation, there are{' '}
            <span className="font-bold"> {data.ecoregion_total}</span> marine provinces classified
            under vulnerable status.
          </p>
          <p className={WIDGET_SENTENCE_STYLE}>Click on the map for more information.</p>
          <IUCNEcoregionsChart config={data?.config} />
          <Dialog>
            <DialogTrigger>
              <div className="w-full text-center text-sm font-normal text-brand-800 underline">
                <p>Associate reports</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <div className="no-scrollbar space-y-4 overflow-y-auto p-4">
                <h2 className="font-sans text-2xl font-light text-black/85">
                  IUCN Ecosystem Red List Assesment
                </h2>
                <h4 className="py-4 text-sm font-bold ">Associated reports</h4>
                <ul className="text-light space-y-4 text-sm text-brand-800 underline">
                  {data.reports.map(({ name, url }) => (
                    <li key={name} className="">
                      <a target="_blank" rel="noopener noreferrer" href={url}>
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <DialogClose />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default IUCNEcoregions;
