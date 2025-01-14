import React, { useState } from 'react';

import { cn } from 'lib/classnames';

import * as SliderPrimitive from '@radix-ui/react-slider';

const Slider = ({ defaultValue, max = 1, step = 0.1, onValueChange, className }) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  return (
    <>
      <SliderPrimitive.Root
        className={cn({
          'relative flex h-4 w-full touch-none select-none items-center': true,
          [className]: !!className,
        })}
        defaultValue={defaultValue}
        max={max}
        step={step}
        onValueChange={(value) => {
          onValueChange(value);
          setCurrentValue(value);
        }}
      >
        <SliderPrimitive.Track className="relative h-[3px] grow rounded-full bg-black/30">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-black" />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb className="relative block h-3 w-3 cursor-pointer rounded-[10px] border border-white bg-black focus:outline-none">
          <p className="absolute bottom-3 text-xs text-black/40">{currentValue}</p>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    </>
  );
};

export default Slider;
