const SpeciesLocationMapLegend = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="my-0.5 h-4 w-2 rounded-md border border-brand-800 bg-[url('/images/species-location/small-pattern.svg')] bg-center text-sm" />
      <span className="text-sm text-black/85">Countries where the species is located</span>
    </div>
  );
};

export default SpeciesLocationMapLegend;
