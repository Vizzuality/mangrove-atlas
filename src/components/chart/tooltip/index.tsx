type TooltipProps = {
  payload: {
    payload: {
      settings: { label: string; value: number; unit: string }[];
      label: string;
    };
  };
};

const Tooltip: React.FC = ({ payload }: TooltipProps) => {
  if (!payload) return null;
  const { settings, label } = payload?.payload;

  return (
    <div className="space-y-2 rounded-2xl bg-white py-2 px-6 font-sans text-sm shadow-lg">
      {label && <p className="flex justify-center">{label}</p>}
      {settings.map(({ label, value, unit }) => (
        <p key={label} className="flex space-x-4">
          <span className="font-bold">{label}</span>
          <span>
            {' '}
            {value} {unit}
          </span>
        </p>
      ))}
    </div>
  );
};

export default Tooltip;
