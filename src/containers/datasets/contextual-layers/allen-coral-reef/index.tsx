import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const AllenCoralReefContent = () => {
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <p>
        This layer depicts the Allen Coral Atlas’s benthic classes and geomorphic zones that account
        for the world’s tropical shallow coral reefs at 5 m resolution. For more information, visit{' '}
        <a
          href="https://www.allencoralatlas.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-normal text-brand-800"
        >
          AllenCoralAtlas.org
        </a>
        .
      </p>
      <div className="flex">
        <div className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md bg-[#FF6577] text-sm" />
        <p className="text-sm font-normal">Shallow coral reefs</p>
      </div>
    </div>
  );
};

export default AllenCoralReefContent;
