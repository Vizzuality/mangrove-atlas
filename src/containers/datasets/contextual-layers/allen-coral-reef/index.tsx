import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const AllenCoralReefContent = () => {
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <p>
        This layer maps the geomorphic zonation and benthic habitat for the world&apos;s shallow
        coral reefs at 5 m pixel resolution.
      </p>
      <div className="flex">
        <div className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md bg-[#FF6577] text-sm" />
        <p className="text-sm font-normal">Shallow coral reefs</p>
      </div>
    </div>
  );
};

export default AllenCoralReefContent;
