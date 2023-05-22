import { useMangroveProtectedAreas } from './hooks';

const Protection = () => {
  const { location, data } = useMangroveProtectedAreas();

  const currentYear = 2020;
  return (
    <div>
      <p>
        Mangroves found in protected areas <span className="font-bold">{location} </span> in{' '}
        {currentYear} represented 6,128,720.38
        {'ha unit selector'}
        out of a total 14,735,899.10
        {'ha unit selector'}.
      </p>
    </div>
  );
};

export default Protection;
