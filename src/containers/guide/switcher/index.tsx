import cn from 'lib/classnames';

import { activeGuideAtom } from 'store/guide';
import { basemapAtom } from 'store/map';

import { useRecoilState, useRecoilValue } from 'recoil';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';

export const GuideSwitcher = () => {
  const [isActive, setIsActive] = useRecoilState(activeGuideAtom);
  const handleClick = () => setIsActive(!isActive);
  const basemap = useRecoilValue(basemapAtom);
  return (
    <div>
      <SwitchWrapper id="guide">
        <SwitchRoot onClick={handleClick} defaultChecked={isActive} checked={isActive}>
          <SwitchThumb icon="?" />
        </SwitchRoot>
      </SwitchWrapper>
      <p
        className={cn({
          'max-w-[50px] pt-1.5 text-center font-sans text-[10px] font-bold leading-3': true,
          'text-black/85': basemap === 'light',
          'text-white': basemap === 'dark' || basemap === 'satellite',
        })}
      >
        Activate guide
      </p>
    </div>
  );
};

export default GuideSwitcher;
