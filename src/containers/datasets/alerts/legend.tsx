const DATA = [
  { color: '#FFC201', label: '> 24' },
  { color: '#F78E1C', label: '12 - 24' },
  { color: '#ED4F3F', label: '6 - 12' },
  { color: '#DC3982', label: '3 – 6' },
  { color: '#C62AD6', label: '< 3' },
];

const AlertsLegend = () => {
  return (
    <div className="flex flex-col space-y-1 font-sans text-black/60">
      <p className="text-xs">Months since alert detection:</p>
      <div className="flex space-x-6">
        {DATA?.map(({ color, label }) => {
          return (
            <div key={label} className="flex items-start space-x-2">
              <div style={{ backgroundColor: color }} className="h-4 w-2 shrink-0 rounded-md" />
              <div className="flex flex-col items-start text-sm">
                <p>{label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsLegend;
