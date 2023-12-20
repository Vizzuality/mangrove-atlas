const RestorationMapLegend = () => {
  return (
    <div className="w-[260px]">
      <div className="flex  justify-between text-black/85">
        <p>0</p>
        <p>100</p>
      </div>
      <div className="flex  justify-between text-black/85"></div>
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
