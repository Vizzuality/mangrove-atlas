import Loading from 'components/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import { useClimateWatchNDCS } from './hooks';

const ClimateWatchNationalDashboard = () => {
  const { isFetched, isFetching, data } = useClimateWatchNDCS();

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && <div>data</div>}
    </div>
  );
};

export default ClimateWatchNationalDashboard;
