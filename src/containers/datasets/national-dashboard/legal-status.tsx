import { WIDGET_SENTENCE_STYLE } from 'styles/widgets';

const LegalStatus = ({
  location,
  legalStatus,
}: {
  location: string;
  legalStatus: 'forest' | 'mangrove';
}) => (
  <p className={`${WIDGET_SENTENCE_STYLE} pb-6.25`}>
    The mangroves in <span className="font-bold">{location}</span> have the legal status of{' '}
    <span className="font-bold">{legalStatus}</span>.
  </p>
);

export default LegalStatus;
