import { FC } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { widgetsCollapsedAtom } from 'store/widgets';

import { useRecoilState, useRecoilValue } from 'recoil';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/ui/dialog';
import { WidgetSlugType } from 'types/widget';

import Info from './info.mdx';

type ApplicabilityProps = {
  id: WidgetSlugType;
  className?: string;
  applicability?: string;
};

const WidgetApplicability: FC<ApplicabilityProps> = (props: ApplicabilityProps) => {
  const { id, applicability } = props;
  const { enabled: isDrawingToolEnabled } = useRecoilValue(drawingToolAtom);
  const { enabled: isDrawingUploadToolEnabled } = useRecoilValue(drawingUploadToolAtom);

  const [widgetsCollapsed] = useRecoilState<Record<string, boolean>>(widgetsCollapsedAtom);

  const isCollapsed: boolean =
    isDrawingToolEnabled || isDrawingUploadToolEnabled ? false : widgetsCollapsed[id];

  return (
    <p
      className={cn({
        'flex text-sm text-black/85 md:whitespace-nowrap md:text-center': true,
        hidden: isCollapsed,
        block: !isCollapsed,
      })}
    >
      <span className="font-normal">Data applicability:</span>{' '}
      <span className="font-light">{applicability}.</span>{' '}
      <Dialog>
        <DialogTrigger>
          <div className="inline-flex text-brand-800 underline hover:no-underline">Learn more</div>
        </DialogTrigger>
        <DialogContent className="md:mb-20">
          <div className="no-scrollbar overflow-y-auto">
            <Info />
          </div>
          <DialogClose className="fixed !top-18 left-[595px]" />
        </DialogContent>
      </Dialog>
    </p>
  );
};

export default WidgetApplicability;
