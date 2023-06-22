import { ReactElement, useMemo } from 'react';

import Image, { StaticImageData } from 'next/image';

import { basemapContextualAtom } from 'store/map-settings';

import { useRecoilState } from 'recoil';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';
import { ContextualBasemapsId } from 'types/widget';

import lightThumb from 'images/thumbs/light.png';

type SuggestionTypes = {
  name: string;
  id: ContextualBasemapsId;
  description: string;
  children: ReactElement;
};

const SuggestedLayers = ({ children, name, id, description }: SuggestionTypes) => {
  const [basemapContextualSelected, setBasemapContextual] = useRecoilState(basemapContextualAtom);
  const isActive = useMemo(() => basemapContextualSelected === id, [basemapContextualSelected, id]);

  const handleClick = () => {
    setBasemapContextual(id);
  };

  return (
    <div className="flex flex-col space-y-4 rounded-2xl bg-black bg-opacity-[4%] p-3">
      <div className="flex items-center space-x-2 ">
        <Image
          width={42}
          height={42}
          className="rounded-2xl"
          src={lightThumb as StaticImageData}
          alt={name}
        />
        <p className="text-sm">{description}</p>
        <div className="flex items-start space-x-2">
          <SwitchWrapper id="planet_medres_visual_monthly">
            <SwitchRoot onClick={handleClick} defaultChecked={isActive} checked={isActive}>
              <SwitchThumb />
            </SwitchRoot>
          </SwitchWrapper>
        </div>
      </div>
      {<div>{children}</div>}
    </div>
  );
};

export default SuggestedLayers;
