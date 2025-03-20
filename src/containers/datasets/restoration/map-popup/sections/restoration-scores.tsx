import { useMemo } from 'react';

import RestorationDataGroup from 'containers/datasets/restoration/map-popup/restoration-data-group';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';
import type { RestorationPopUp } from 'types/map';

const RestorationScores = ({ data }: { data: RestorationPopUp }) => {
  const { Class, Max_Area_20_ha, Area_loss_ha, Rest_Area_Loss, Loss_Driver, Rest_Score } = data;

  const nonRestScore = useMemo(() => 100 - Rest_Score, [Rest_Score]);

  return (
    <Collapsible className="w-full min-w-[450px]">
      <CollapsibleTrigger>
        <h3 className={WIDGET_SUBTITLE_STYLE}>RESTORATION SCORES</h3>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <section className="flex w-full flex-col space-y-2 px-6 pb-6">
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
              <div className="relative h-6 w-full bg-slate-100">
                <div
                  className=" h-full w-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #F9DDDA 0%, #FFADAD 25.52%, #CE78B3 50.52%, #8478CE 78.13%, #224294 100%)',
                  }}
                >
                  <span
                    className="absolute right-0 top-0 bottom-0 h-full w-full border-none bg-slate-100"
                    style={{
                      width: `${nonRestScore}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-4xl">{Rest_Score}</div>
            </div>
          </div>
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RestorationScores;
