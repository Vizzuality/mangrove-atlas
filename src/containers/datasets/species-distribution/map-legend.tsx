import { useMangroveSpeciesDistribution } from './hooks';

const SpeciesDistributionMapLegend = () => {
  const { legend } = useMangroveSpeciesDistribution();

  return (
    <div className="w-[280px]">
      <div className="flex justify-between text-xs text-black/60">
        <p>{legend[0]}</p>
        <p>{legend[2]}</p>
      </div>
      <div
        className="h-3 w-full border"
        style={{
          background:
            'linear-gradient(90deg, #F9FDB7 0%, #E0F1B2 10.22%, #C7E6AC 21.09%, #B0DAA9 32.17%, #99CFA6 43.48%, #7CBCA2 55.87%, #59A29C 67.83%, #3B8793 78.7%, #2D6D82 88.48%, #205272 99.99%, #205272 100%)',
        }}
      />
    </div>
  );
};

export default SpeciesDistributionMapLegend;
