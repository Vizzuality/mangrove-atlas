import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type IndicatorTypes = {
  label: string;
  value: string;
  check: boolean;
  url?: string;
  info: string;
};

import UNCHECK_SVG from '@/svgs/ui/check-cross';
import CHECK_SVG from '@/svgs/ui/check';
import INFO_SVG from '@/svgs/ui/info';

const Indicator = (indicator: IndicatorTypes) => {
  const { label, value, check, url, info } = indicator;
  const CheckIcon = check ? CHECK_SVG : UNCHECK_SVG;
  return (
    <div className="grid grid-cols-2 space-x-4 text-sm text-black/85">
      <div className="flex items-center">
        <div dangerouslySetInnerHTML={{ __html: label }} className="mr-2 font-bold" />
        {info && (
          <Tooltip>
            <TooltipTrigger>
              <INFO_SVG className="fill-current h-5 w-5" role="img" title="Info" />
            </TooltipTrigger>

            <TooltipPortal>
              <TooltipContent
                side="bottom"
                align="center"
                className="shadow-soft max-w-sm rounded-3xl bg-white p-4 text-black/85 first-letter:uppercase"
              >
                {info}
                <TooltipArrow className="fill-white" width={10} height={5} />
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        )}
      </div>

      {value && !url && <p>{value}</p>}
      {value && !!url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-800 underline"
        >
          {value}
        </a>
      )}
      {!!check && (
        <CheckIcon className="fill-current h-5 w-5" role="img" title="Check" />
      )}
    </div>
  );
};

export default Indicator;
