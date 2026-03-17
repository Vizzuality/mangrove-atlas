import SafeHTML from '@/components/dompurify';
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

import CHECK_SVG from '@/svgs/ui/check';
import UNCHECK_SVG from '@/svgs/ui/check-cross';
import INFO_SVG from '@/svgs/ui/info';

const Indicator = (indicator: IndicatorTypes) => {
  const { label, value, check, url, info } = indicator;
  const CheckIcon = check ? CHECK_SVG : UNCHECK_SVG;
  return (
    <div className="grid grid-cols-2 space-x-3 text-sm text-black/85">
      <div className="col-span-1 flex items-start">
        <SafeHTML html={label} className="mr-2 font-bold whitespace-nowrap" />
        {info && (
          <Tooltip>
            <TooltipTrigger className="border-brand-800/20 text-brand-800 flex h-5 w-5 items-center justify-center rounded-full border-2">
              <INFO_SVG className="h-3 w-3 shrink-0 fill-current" role="img" title="Info" />
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

      {value && !url && <p className="col-span-1">{value}</p>}
      {value && !!url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-800 col-span-1 underline"
        >
          {value}
        </a>
      )}
      {!!check && (
        <CheckIcon className="col-span-1 h-5 w-5 fill-current" role="img" title="Check" />
      )}
    </div>
  );
};

export default Indicator;
