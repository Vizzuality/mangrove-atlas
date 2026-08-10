const RestorationMapLegend = () => (
  <div className="w-[280px]">
    <div className="flex justify-between text-xs text-black/60">
      <p>0%</p>
      <p>100%</p>
    </div>

    {/* The bar carried no name: only the two end labels were exposed, with
        nothing saying what the colour ramp between them means. */}
    <div
      role="img"
      aria-label="Restoration potential, from 0% (lightest) to 100% (darkest)"
      className="h-3 w-full border"
      style={{
        background:
          'linear-gradient(90deg, #F9DDDA 0%, #FFADAD 25.52%, #CE78B3 50.52%, #8478CE 78.13%, #224294 100%)',
      }}
    />
  </div>
);

export default RestorationMapLegend;
