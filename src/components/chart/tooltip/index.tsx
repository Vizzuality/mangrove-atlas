const Tooltip: React.FC = (info) => {
  return (
    <div className="rounded-2xl bg-white py-2 px-6 shadow-lg">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase">{'title'}</h2>
      </header>
    </div>
  );
};

export default Tooltip;
