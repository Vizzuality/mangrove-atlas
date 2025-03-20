const Detail = ({
  label,
  pct,
  value,
  unit,
}: {
  label: string;
  pct: number;
  value: string;
  unit?: string;
}) => (
  <div className="flex w-full items-center font-sans">
    <div className="w-[165px] whitespace-nowrap text-right text-sm font-light">{label}</div>
    <div className="mx-4 flex h-4 w-[126px]">
      <div
        className="relative h-full bg-[#B2CBF9]"
        style={{ width: `${100}%`, marginRight: !!pct && pct > 0 ? 2 : 0 }}
      >
        <span
          className="absolute h-full grow bg-slate-100 text-xxs"
          style={{ left: `${pct * 10}%`, right: 0 }}
        />
      </div>
    </div>
    <div className="whitespace-nowrap text-sm font-semibold">
      {value}
      {!!unit && typeof value === 'number' && unit}
    </div>
  </div>
);

export default Detail;
