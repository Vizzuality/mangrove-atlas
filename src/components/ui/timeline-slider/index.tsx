import cn from '@/lib/classnames';

import { LuPause, LuPlay } from 'react-icons/lu';

import Slider from '@/components/ui/slider';

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
        <Slider
          min={0}
          max={years.length - 1}
          step={1}
          value={[value]}
          onValueChange={handleValueChange}
          showValueLabel={false}
          trackClassName="bg-black/20"
          rangeClassName="bg-brand-800"
          thumbClassName="h-3.5 w-3.5 bg-brand-800 rounded-full border-2 shadow"
        />

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
