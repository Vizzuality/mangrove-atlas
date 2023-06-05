import cn from 'lib/classnames';

import RestorationDataGroup from 'containers/map/restoration-popup/restoration-data-group';

const EcosystemServices = ({
  data,
  isOpen,
  handleClick,
}: {
  data: Record<string, any>;
  isOpen: boolean;
  handleClick: () => void;
}) => {
  const { SOC, AGB, Fish_Score_Inv, Fish_Score } = data;
  return (
    <div
      className={cn({
        'box-border flex w-full cursor-pointer flex-col items-start border-t border-slate-100 px-6 pt-6 font-sans':
          true,
        'max-h-[84px] w-full overflow-hidden': !isOpen,
      })}
    >
      <div className="mb-6 flex w-full items-center justify-between" onClick={handleClick}>
        <div className="space-y-0.5">
          <h3 className="m-0 text-sm font-semibold">ECOSYSTEM SERVICES</h3>
          <p className="text-xs font-light">for restored mangroves</p>
        </div>
        <span
          className={cn({
            'text-brand-800': true,
            'text-5xl': isOpen,
            'text-3xl': !isOpen,
          })}
        >
          {isOpen ? '-' : '+'}
        </span>
      </div>
      <div className="w-fit-content grid grid-flow-col grid-rows-2 gap-2">
        <RestorationDataGroup label="Mean soil organic carbon" value={SOC} unit="mtCO2e" />
        <RestorationDataGroup label="Mean aboveground carbon" value={AGB} unit="mtCO2e" />

        <RestorationDataGroup
          label="Commercial invert catch
             enhancement value"
          value={Fish_Score_Inv}
        />
        <RestorationDataGroup
          label="Commercial fish catch
             enhancement value"
          value={Fish_Score}
        />
      </div>
    </div>
  );
};

export default EcosystemServices;
