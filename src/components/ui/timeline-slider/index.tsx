import cn from '@/lib/classnames';

import * as SliderPrimitive from '@radix-ui/react-slider';
import { LuPause, LuPlay } from 'react-icons/lu';

const PauseIcon = LuPause as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
const PlayIcon = LuPlay as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

type TimelineSliderProps = {
  years: number[];
  currentYear: number;
  isPlaying: boolean;
  onYearChange: (year: number) => void;
  onTogglePlay: () => void;
};

const TimelineSlider = ({
  years,
  currentYear,
  isPlaying,
  onYearChange,
  onTogglePlay,
}: TimelineSliderProps) => {
  const currentIndex = years.indexOf(currentYear);
  const value = currentIndex >= 0 ? currentIndex : years.length - 1;

  const handleValueChange = ([index]: number[]) => {
    if (isPlaying) onTogglePlay();
    onYearChange(years[index]);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        aria-label={isPlaying ? 'Pause' : 'Play'}
        type="button"
        onClick={onTogglePlay}
        className="bg-brand-800 hover:bg-brand-800/80 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-colors"
      >
        {isPlaying ? (
          <PauseIcon className="h-3.5 w-3.5" />
        ) : (
          <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
        )}
      </button>

      <div className="relative flex w-full flex-col">
        <SliderPrimitive.Root
          className="relative flex h-4 w-full touch-none items-center select-none"
          min={0}
          max={years.length - 1}
          step={1}
          value={[value]}
          onValueChange={handleValueChange}
        >
          <SliderPrimitive.Track className="relative h-[3px] grow rounded-full bg-black/20">
            <SliderPrimitive.Range className="bg-brand-800 absolute h-full rounded-full" />
          </SliderPrimitive.Track>

          <SliderPrimitive.Thumb className="bg-brand-800 block h-3.5 w-3.5 cursor-pointer rounded-full border-2 border-white shadow focus:outline-none" />
        </SliderPrimitive.Root>

        <div className="relative mt-0.5 flex w-full justify-between px-0">
          {years.map((y, i) => (
            <span
              key={y}
              className={cn(
                'text-[10px] leading-none',
                y === currentYear ? 'text-brand-800 font-semibold' : 'text-black/40'
              )}
              style={{
                position: 'absolute',
                left: `${(i / (years.length - 1)) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {y}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;
