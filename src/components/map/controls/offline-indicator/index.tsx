import cn from '@/lib/classnames';

import { isOnlineAtom } from '@/store/offline';

import { useAtomValue } from 'jotai';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Shows a small badge while the browser is offline, signalling that the map is
 * running from cached tiles/data. Renders nothing when online.
 */
const OfflineIndicator = () => {
  const isOnline = useAtomValue(isOnlineAtom);

  if (isOnline) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          role="status"
          aria-label="Offline — showing cached map data"
          className={cn(
            'shadow-control inline-flex h-12 w-12 flex-col items-center justify-center rounded-full bg-amber-500'
          )}
        >
          <span className="h-3 w-3 animate-pulse rounded-full bg-white" aria-hidden />
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-600 px-2 text-white">
        Offline — showing cached map data
      </TooltipContent>
    </Tooltip>
  );
};

export default OfflineIndicator;
