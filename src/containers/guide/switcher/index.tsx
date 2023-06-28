import { activeGuideAtom } from 'store/guide';

import { useRecoilState } from 'recoil';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';

export const GuideSwitcher = () => {
  const [isActive, setIsActive] = useRecoilState(activeGuideAtom);
  const handleClick = () => setIsActive(!isActive);
  return (
    <div>
      <SwitchWrapper id="guide">
        <SwitchRoot onClick={handleClick} defaultChecked={isActive} checked={isActive}>
          <SwitchThumb icon="?" />
        </SwitchRoot>
      </SwitchWrapper>
      <p className="max-w-[50px] pt-1.5 text-center font-sans text-xxs font-bold leading-3 text-black/85">
        Activate guide
      </p>
    </div>
  );
};

export default GuideSwitcher;
