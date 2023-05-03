const Legend = ({ items }) => {
  return (
    <div>
      {items.map(({ color, label, value, unit }) => (
        <div key={label} className="flex items-start">
          <div
            style={{ backgroundColor: color }}
            className="my-0.5 mr-2.5 h-4 w-2 rounded-md text-sm"
          />
          <div className="flex flex-col items-start text-sm">
            <p className="font-bold">{label}</p>
            <div className="flex space-x-2">
              <p>{value}</p>
              {unit && <p>{unit}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Legend;
