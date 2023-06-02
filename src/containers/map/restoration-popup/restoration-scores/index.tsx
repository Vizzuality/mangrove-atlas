import cn from 'lib/classnames';

import RestorationDataGroup from 'containers/map/restoration-popup/restoration-data-group';

const RestorationScores = ({
  data,
  isOpen,
  handleClick,
}: {
  data: Record<string, any>;
  isOpen: boolean;
  handleClick: () => void;
}) => {
  const { Class, Max_Area_20_ha, Area_loss_ha, Rest_Area_Loss, Loss_Driver, Rest_Score } = data;

  const nonRestScore = 100 - Rest_Score;
  return (
    <div
      className={cn({
        'box-border flex w-full cursor-pointer flex-col items-start p-6 font-sans': true,
        'max-h-[72px] w-full overflow-hidden': !isOpen,
      })}
    >
      <div className="flex w-full items-center justify-between pb-6" onClick={handleClick}>
        <span>
          <h3 className="m-0 text-sm font-semibold">RESTORATION SCORES</h3>
        </span>
        <span className="text-3xl text-brand-800">{isOpen ? '-' : '+'}</span>
      </div>
      <div className="w-full">
        <div className="flex grow items-center justify-between">
          <RestorationDataGroup label="Mangrove type" value={Class} />
          <RestorationDataGroup
            label="Max mangrove area 1996 - 2020"
            value={Max_Area_20_ha}
            unit="ha"
          />
        </div>
        <div className="flex grow items-start justify-between">
          <RestorationDataGroup label="Area of Loss" value={Area_loss_ha} unit="ha" />
          <RestorationDataGroup label="Restorable Area" value={Rest_Area_Loss} unit="ha" />
          <RestorationDataGroup label="Primary Loss Driver" value={Loss_Driver} />
        </div>
      </div>

      <div className="w-full">
        <h4 className="py-4 font-sans text-sm font-light">Restoration potential score</h4>
        <div className="flex grow items-center justify-between space-x-6">
          <div className="h-6 w-full bg-slate-100">
            <div
              className="relative h-full w-full"
              style={{
                background:
                  'linear-gradient(90deg, #F9DDDA 0%, #FFADAD 25.52%, #CE78B3 50.52%, #8478CE 78.13%, #224294 100%)',
              }}
            >
              <span
                className="absolute right-0 h-full bg-slate-100"
                style={{
                  width: `${nonRestScore}%`,
                }}
              />
            </div>
          </div>
          <div className="text-4xl">{Rest_Score}</div>
        </div>
      </div>
    </div>
  );
};

export default RestorationScores;
