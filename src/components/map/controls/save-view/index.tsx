import { useEffect, useRef, useState } from 'react';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { useSession } from 'next-auth/react';

import { useDefaultView } from 'hooks/use-default-view';

import { useUpdateDefaultView } from '@/containers/auth/hooks';

import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@/components/ui/tooltip';

import SAVE_SVG from '@/svgs/map/save';
import SAVE_CHECK_SVG from '@/svgs/map/save-check';
import SAVE_PLUS_SVG from '@/svgs/map/save-plus';

// How long the "saved" confirmation icon stays before settling back to `save`.
const SAVED_FEEDBACK_MS = 3000;

const SaveViewControl = ({ className }: { className?: string }) => {
  const { data: session } = useSession();
  const { getCurrentView } = useDefaultView();
  const updateDefaultView = useUpdateDefaultView();

  const [justSaved, setJustSaved] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  // No saved view → save-plus; right after saving → save-check; saved view → save.
  // Resetting (settings back to null) lands on save-plus again.
  const hasDefaultView = !!session?.user?.settings;
  const Icon = justSaved ? SAVE_CHECK_SVG : hasDefaultView ? SAVE_SVG : SAVE_PLUS_SVG;
  const label = justSaved
    ? 'Default view saved'
    : hasDefaultView
      ? 'Replace default view with current view'
      : 'Save current view as default';

  const handleClick = () => {
    updateDefaultView.mutate(getCurrentView(), {
      onSuccess: () => {
        setJustSaved(true);
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setJustSaved(false), SAVED_FEEDBACK_MS);
      },
    });
    trackEvent('Default view - save', {
      category: 'Map controls - save view',
      action: hasDefaultView ? 'Replace' : 'Save',
      label: 'Default view',
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          disabled={updateDefaultView.isPending}
          onClick={handleClick}
          className={cn(
            className,
            'group shadow-control focus-visible:shadow-control-focus inline-flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white text-black/85 hover:bg-gray-100 disabled:cursor-default disabled:bg-gray-50 disabled:outline-none'
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="bg-gray-600 px-2 text-white">{label}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export default SaveViewControl;
