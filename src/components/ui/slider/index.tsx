import { useState } from 'react';

import cn from '@/lib/classnames';

import * as SliderPrimitive from '@radix-ui/react-slider';

type SliderProps = {
  className?: string;
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
  defaultValue?: number[];
  value?: number[];
  min?: number;
  max?: number;
  step?: number;
  showValueLabel?: boolean;
  onValueChange?: (value: number[]) => void;
};

const Slider = ({
  defaultValue,
  value,
  min = 0,
  max = 1,
  step = 0.1,
  showValueLabel = true,
  onValueChange,
  className,
  trackClassName,
  rangeClassName,
  thumbClassName,
}: SliderProps) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const displayValue = value ?? currentValue;

  return (
    <SliderPrimitive.Root
      className={cn('relative flex h-4 w-full touch-none items-center select-none', className)}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={(val) => {
        onValueChange?.(val);
        if (value === undefined) {
          setCurrentValue(val);
        }
      }}
    >
      <SliderPrimitive.Track
        className={cn('relative h-[3px] grow rounded-full bg-black/30', trackClassName)}
      >
        <SliderPrimitive.Range
          className={cn('absolute h-full rounded-full bg-black', rangeClassName)}
        />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb
        className={cn(
          'relative block h-3 w-3 cursor-pointer rounded-[10px] border border-white bg-black focus:outline-none',
          thumbClassName
        )}
      >
        {showValueLabel && (
          <p className="absolute bottom-3 text-xs text-black/40">{displayValue}</p>
        )}
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
};

export default Slider;
