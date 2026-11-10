import { type ComponentProps, useMemo, useState } from 'react';

import cn from '@/lib/classnames';

import * as SliderPrimitive from '@radix-ui/react-slider';

type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
  showValueLabel?: boolean;
  thumbAriaLabel?: string;
  thumbAriaValueText?: string;
};

function Slider({
  className,
  trackClassName,
  rangeClassName,
  thumbClassName,
  defaultValue,
  value,
  min = 0,
  max = 1,
  step = 0.1,
  showValueLabel = true,
  thumbAriaLabel,
  thumbAriaValueText,
  onValueChange,
  ...props
}: SliderProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const _values = useMemo(
    () => value ?? uncontrolledValue ?? [min, max],
    [value, uncontrolledValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={(val) => {
        if (value === undefined) setUncontrolledValue(val);
        onValueChange?.(val);
      }}
      // touch-pan-y (not touch-none): the slider is horizontal, so vertical swipes
      // must keep scrolling the mobile widget list; Radix handles horizontal drags.
      className={cn(
        'relative flex h-4 w-full touch-pan-y items-center select-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'relative h-[3px] grow overflow-hidden rounded-full bg-black/30',
          trackClassName
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn('absolute h-full rounded-full bg-black', rangeClassName)}
        />
      </SliderPrimitive.Track>

      {_values.map((thumbValue, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={thumbAriaLabel}
          aria-valuetext={thumbAriaValueText}
          className={cn(
            'focus-visible:ring-brand-800 relative flex min-h-6 min-w-6 cursor-pointer items-center justify-center bg-transparent before:block before:h-4 before:w-4 before:rounded-full before:border before:border-white before:bg-black before:content-[""] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none',
            thumbClassName
          )}
        >
          {showValueLabel && (
            <p className="absolute bottom-3 text-xs text-black/60">{thumbValue}</p>
          )}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
export default Slider;
