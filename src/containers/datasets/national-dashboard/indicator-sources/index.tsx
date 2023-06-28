import cn from 'lib/classnames';

import Icon from 'components/icon';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from 'components/tooltip';
import WidgetControls from 'components/widget-controls';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

const LABEL_UNITS = {
  km2: 'km²',
};

type DataSourceTypes = {
  value: number;
  layer_link: string;
  download_link: string;
  layer_info: string;
};

type IndicatorSourceTypes = {
  source: string;
  years: number[];
  unit: string;
  dataSource: DataSourceTypes;
  color: string;
};

const IndicatorSources = ({ source, years, unit, dataSource, color }: IndicatorSourceTypes) => {
  return (
    <div key={source} className="flex flex-1 items-start justify-between space-x-2 py-4">
      {
        <span
          style={{ backgroundColor: color }}
          className="mt-1 w-2 shrink-0 rounded-md pt-4 first-letter:h-4"
        />
      }
      <span className="max-w-[180px]">{source}</span>
      {years.length === 1 && <span>{years[0]}</span>}
      {years.length < 1 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
              {'year'}
              <Icon
                icon={ARROW_SVG}
                className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2"
              />
            </span>
          </TooltipTrigger>

          <TooltipPortal>
            <TooltipContent
              side="bottom"
              align="center"
              className="rounded-3xl bg-white text-black/85 shadow-soft"
            >
              <ul
                className={cn({
                  'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true,
                })}
              >
                {years?.map((u) => (
                  <li key={u}>
                    <button
                      className={cn({
                        'font-bold': true,
                      })}
                      type="button"
                      // onClick={() => setYear(u)}
                      // disabled={selectedYear === u}
                    >
                      {u}
                    </button>
                  </li>
                ))}
              </ul>

              <TooltipArrow className="fill-white" width={10} height={5} />
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}
      {dataSource?.value && <span>{dataSource.value}</span>}
      {unit && <span>{LABEL_UNITS[unit] || unit}</span>}

      <WidgetControls
        content={{
          layer: `national-dashboard-${dataSource.download_link}`,
          download: dataSource.download_link,
          info: dataSource.layer_info,
        }}
      />
    </div>
  );
};

export default IndicatorSources;
