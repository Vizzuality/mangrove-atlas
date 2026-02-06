import { ReactElement } from 'react';

import Thumb from './thumb';

import type { WidgetSlugType } from 'types/widget';

import Content from './content';
import Controls from './controls';

type ContextualLayersComponentProps = {
  id: string;
  origin?: WidgetSlugType; // Optional prop to track the origin of the suggestion
  description: string;
  thumbSource?: string;
  children?: ReactElement;
  name: string;
};

const ContextualLayersComponent = ({
  id,
  origin,
  description,
  thumbSource,
  name,
}: ContextualLayersComponentProps) => {
  return (
    <div className="relative flex flex-col space-y-5 rounded-3xl bg-brand-800/10 p-3">
      <div className="flex items-center justify-between space-x-8">
        <div className="flex items-center">
          <div className="flex items-center space-x-4">
            {!!thumbSource && <Thumb source={thumbSource} name={name} />}

            <Content id={id} description={description} />
          </div>
        </div>
        <Controls id={id} origin={origin} />
      </div>
    </div>
  );
};

export default ContextualLayersComponent;
