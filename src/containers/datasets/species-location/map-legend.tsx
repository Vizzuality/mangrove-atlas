const SpeciesLocationMapLegend = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="border-brand-800 my-0.5 h-4 w-2 rounded-md border bg-[url(/small-pattern.svg)] bg-center text-sm" />
      <span className="text-sm text-black/60">Countries where the species is located</span>
    </div>
  );
};

export default SpeciesLocationMapLegend;
