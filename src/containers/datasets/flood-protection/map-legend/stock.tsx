const FloodProtectionStockMapLegend = () => {
  return (
    <div className="flex w-[280px] flex-col justify-between space-y-2 font-sans text-black/60">
      <p className="w-full text-end text-xs">$</p>

      <div
        className="relative h-3 w-full"
        style={{
          background:
            'linear-gradient(90deg, #D1EEEA 0%, #A8DBD9 17%, #85C4C9 33%, #68ABB8 50%, #4F90A6 67%, #3B738F 83%, #2A5674 100%)',
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

export default FloodProtectionStockMapLegend;
