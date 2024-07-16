import { FC } from 'react';

type TooltipProps = {
  payload: {
    title: string;
    alerts: number;
    year: number;
  };
  active: boolean;
};

const Tooltip: FC = ({ active, payload }: TooltipProps) => {
  if (!active) return null;
  const { title, year, alerts } = payload || {};
  return (
    <div className="space-y-2 space-x-2 rounded-2xl bg-white py-2 px-6 font-sans text-sm shadow-lg">
      <p className="flex space-x-2">
        <span className="font-bold">
          Alerts in {title} {year}:
        </span>{' '}
        <span>{alerts}</span>
      </p>
    </div>
  );
};

export default Tooltip;
