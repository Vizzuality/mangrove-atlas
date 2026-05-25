import { FC } from 'react';

import cn from '@/lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { widgetsCollapsedAtom } from '@/store/widgets';

import { DialogTitle } from '@radix-ui/react-dialog';
import { useAtom, useAtomValue } from 'jotai';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { WidgetSlugType } from 'types/widget';

import Info from './info.mdx';

type ApplicabilityProps = {
  id: WidgetSlugType;
  className?: string;
  applicability?: string;
};

const WidgetApplicability: FC<ApplicabilityProps> = (props: ApplicabilityProps) => {
  const { id, applicability } = props;
  const { enabled: isDrawingToolEnabled } = useAtomValue(drawingToolAtom);
  const { enabled: isDrawingUploadToolEnabled } = useAtomValue(drawingUploadToolAtom);

  const [widgetsCollapsed] = useAtom<Record<string, boolean>>(widgetsCollapsedAtom);

  const isCollapsed: boolean =
    isDrawingToolEnabled || isDrawingUploadToolEnabled ? false : widgetsCollapsed[id];

  return (
    <p
      className={cn({
        'text-sm text-black/85': true,
        hidden: isCollapsed,
        block: !isCollapsed,
      })}
    >
      <span className="font-normal">Data applicability:</span>{' '}
      <span className="font-light">{applicability}.</span>{' '}
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="text-brand-800 cursor-pointer underline hover:no-underline"
          >
            Learn more
          </button>
        </DialogTrigger>
        <DialogContent className="md:mb-20">
          <DialogTitle className="sr-only">Data applicability</DialogTitle>
          <div className="no-scrollbar overflow-y-auto">
            <Info />
          </div>
          <DialogClose />
        </DialogContent>
      </Dialog>
    </p>
  );
};

export default WidgetApplicability;
