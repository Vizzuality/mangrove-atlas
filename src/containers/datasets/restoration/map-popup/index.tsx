import cn from 'lib/classnames';

import Details from 'containers/datasets/restoration/map-popup/sections/details';
import EcosystemServices from 'containers/datasets/restoration/map-popup/sections/ecosystem-services';
import RestorationScores from 'containers/datasets/restoration/map-popup/sections/restoration-scores';

import type { RestorationPopUp } from 'types/map';

const PopupRestoration = ({ info, className }: { info: RestorationPopUp; className?: string }) => {
  return (
    <div
      className={cn({
        'relative flex w-full flex-col items-start divide-y divide-gray-100': true,
        [className]: !!className,
      })}
    >
      <RestorationScores data={info} />
      <Details data={info} />
      <EcosystemServices data={info} />
    </div>
  );
};

export default PopupRestoration;
