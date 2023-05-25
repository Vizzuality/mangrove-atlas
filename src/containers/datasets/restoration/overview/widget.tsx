import MeanRestoration from './mean-restoration/widget';
import RestorableAreas from './restorable-areas/widget';

const Overview = () => {
  return (
    <div className="space-y-4">
      <MeanRestoration />
      <RestorableAreas />
    </div>
  );
};

export default Overview;
