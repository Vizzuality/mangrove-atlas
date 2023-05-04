const Tooltip: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white py-2 px-6 shadow-lg">
      {<h2 className="text-sm font-bold uppercase">{'title'}</h2>}
      {/* {items.map(({ label, value, unit }) => (
        <div>
          {label}
          {value}
          {unit}
        </div>
      ))} */}
    </div>
  );
};

export default Tooltip;
