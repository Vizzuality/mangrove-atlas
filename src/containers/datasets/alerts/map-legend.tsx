const AlertsMapLegend = () => {
  return (
    <div className="flex flex-col space-y-2 font-sans text-sm text-black/60">
      <div className="flex space-x-4">
        <span
          style={{
            background: 'linear-gradient(180deg, #C72BD6 0%, #EB4444 52.39%, #FFC200 100%)',
          }}
          className="h-4 w-2 shrink-0 rounded-md"
        />
        <p>Alerts</p>
      </div>
      <div className="flex space-x-2">
        <div className="flex">
          <div className="flex flex-col">
            <div className="text-brand-900 h-2 w-2 border-2 border-brand-800" />
            <div className="text-brand-900 h-2 w-2 border-2 border-brand-800" />
          </div>
          <div className="text-brand-900 h-2 w-2 border-2 border-brand-800" />
        </div>
        <p className="text-sm font-normal">Monitored area</p>
      </div>
    </div>
  );
};

export default AlertsMapLegend;
