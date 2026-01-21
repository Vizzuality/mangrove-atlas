const LegalStatus = ({
  location,
  legalStatus,
}: {
  location: string;
  legalStatus: 'forest' | 'mangrove';
}) => (
  <p>
    The mangroves in <span className="font-bold">{location}</span> have the legal status of{' '}
    <span className="font-bold">{legalStatus}</span>
  </p>
);

export default LegalStatus;
