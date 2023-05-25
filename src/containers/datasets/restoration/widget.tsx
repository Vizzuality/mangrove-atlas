import PotentialBenefitsToFisheries from './fisheries/widget';
import Loss from './loss/widget';
import Overview from './overview/widget';
import RestorationValue from './restoration-value/widget';

const Restoration = () => {
  return (
    <div className="space-y-4">
      <Overview />
      <Loss />
      <RestorationValue />
      <PotentialBenefitsToFisheries />
    </div>
  );
};

export default Restoration;
