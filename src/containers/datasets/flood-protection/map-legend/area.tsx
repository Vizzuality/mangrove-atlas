const FloodProtectionAreaMapLegend = () => {
  return (
    <div className="flex w-[280px] flex-col justify-between space-y-2 font-sans text-black/60">
      <p className="w-full text-end text-xs">km²</p>

      <div
        className="relative h-3 w-full"
        style={{
          background:
            'linear-gradient(90deg, #F3E0F7 0%, #E4C7F1 17%, #D1AFE8 33%, #AB91CF 50%, #9F82CE 67%, #826DBA 83%, #63589F 100%)',
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

export default FloodProtectionAreaMapLegend;
