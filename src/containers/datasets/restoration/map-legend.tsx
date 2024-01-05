const RestorationMapLegend = () => {
  return (
    <div className="w-[280px]">
      <div className="flex justify-between text-xs text-black/60">
        <p>0%</p>
        <p>100%</p>
      </div>

      <div
        className="h-3 w-full border"
        style={{
          background:
            'linear-gradient(90deg, #F9DDDA 0%, #FFADAD 25.52%, #CE78B3 50.52%, #8478CE 78.13%, #224294 100%)',
        }}
      />
    </div>
  );
};

export default RestorationMapLegend;
