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
        'box-border flex w-full cursor-pointer flex-col items-start p-6 font-sans': true,
        'max-h-[72px] w-full overflow-hidden': !isOpen,
      })}
    >
      <div className="flex w-full items-center justify-between pb-6" onClick={handleClick}>
        <span className="text-xxs">
          <h3>ECOSYSTEM SERVICES</h3>
          <p>for restored mangroves</p>
        </span>
        <span className="text-3xl text-brand-800">{isOpen ? '-' : '+'}</span>
      </div>
      <div className="w-full">
        <div className="flex grow items-center justify-between">
          <RestorationDataGroup label="Mean soil organic carbon" value={SOC} unit="mtCO2e" />
          <RestorationDataGroup label="Mean aboveground carbon" value={AGB} unit="mtCO2e" />
        </div>
        <div className="flex grow items-center justify-between">
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
    </div>
  );
};

export default EcosystemServices;
