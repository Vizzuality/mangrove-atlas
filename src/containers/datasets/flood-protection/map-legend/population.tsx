const FloodProtectionPopulationMapLegend = () => {
  return (
    <div className="flex w-[280px] flex-col justify-between space-y-2 font-sans text-black/60">
      <p className="w-full text-end text-xs">individuals</p>

      <div
        className="relative h-3 w-full"
        style={{
          background:
            'linear-gradient(90deg, #FFC6C4 0%, #F4A3A8 17%, #E38191 33%, #CC607D 50%, #AD466C 67%, #8B3058 83%, #672044 100%)',
        }}
      />
      <div className="flex w-full justify-between text-xs text-black/60">
        {['low', 'high'].map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
    </div>
  );
};

export default FloodProtectionPopulationMapLegend;
