const GlobalTidalWetlandChangeMapLegend = () => {
  return (
    <div className="flex flex-col space-y-2 font-sans text-sm text-black/60">
      <div className="flex">
        <div className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md bg-[#B7E6A5] text-sm" />
        <p className="text-sm font-normal">Intertidal wetland gain</p>
      </div>
      <div className="flex">
        <div className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md bg-[#CA3F2C] text-sm" />
        <p className="text-sm font-normal">Intertidal wetland loss</p>
      </div>
    </div>
  );
};

export default GlobalTidalWetlandChangeMapLegend;
