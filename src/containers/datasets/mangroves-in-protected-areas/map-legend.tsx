import { useMangrovesInProtectedAreas } from './hooks';

const ProtectionMapLegend = () => {
  const { data } = useMangrovesInProtectedAreas({ unit: 'ha' });

  return (
    <div className="flex w-full flex-col justify-between space-y-2 font-sans text-black/60">
      {data?.legend?.map(({ color, label, labelFormatted }) => {
        return (
          <div key={label} className="flex items-start">
            <div
              style={{ backgroundColor: color }}
              className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md text-sm"
            />
            <div className="flex flex-col items-start text-sm">
              <p>{labelFormatted || label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProtectionMapLegend;
