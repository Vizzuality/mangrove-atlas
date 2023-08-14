import Icon from 'components/icon';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from 'components/tooltip';

type IndicatorTypes = {
  label: string;
  value: string;
  check: 'Yes' | 'No';
  info: string;
};

import UNCHECK_SVG from 'svgs/ui/check-cross.svg?sprite';
import CHECK_SVG from 'svgs/ui/check.svg?sprite';
import INFO_SVG from 'svgs/ui/info.svg?sprite';

const Indicator = ({ label, value, check, info }: IndicatorTypes) => (
  <div className="grid grid-cols-2 text-sm text-black/85">
    <div className="flex items-center">
      <div dangerouslySetInnerHTML={{ __html: label }} className="mr-2 font-bold" />
      {info && (
        <Tooltip>
          <TooltipTrigger>
            <Icon icon={INFO_SVG} className="h-5 w-5" description="Info" />
          </TooltipTrigger>

          <TooltipPortal>
            <TooltipContent
              side="bottom"
              align="center"
              className="rounded-3xl bg-white p-4 text-black/85 shadow-soft first-letter:uppercase"
            >
              {info}
              <TooltipArrow className=" fill-white" width={10} height={5} />
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}
    </div>

    {value && <p>{value}</p>}
    {!!check && (
      <Icon
        icon={check?.toLowerCase() === 'yes' ? CHECK_SVG : UNCHECK_SVG}
        className="h-5 w-5"
        description="Check"
      />
    )}
  </div>
);

export default Indicator;
