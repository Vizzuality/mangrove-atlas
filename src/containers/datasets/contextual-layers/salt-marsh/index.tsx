import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const SaltMarshContent = () => {
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <p>
        The map shows the distribution of tidal marshes in the year 2020. It represents the first
        globally consistent tidal marsh map and is available at 10m resoulution. It was created
        using optical and radar images from the European Space Agency’s Sentinel missions. The
        research was a collaboration between the University of Cambridge, The Nature Conservancy and
        James Cook University.
      </p>
      <div className="flex">
        <div className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md bg-[#BB6FF7] text-sm" />
        <p className="text-sm font-normal">Tidal Marsh Distribution</p>
      </div>
    </div>
  );
};

export default SaltMarshContent;
