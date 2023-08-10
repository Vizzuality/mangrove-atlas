import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const SaltMarshContent = () => {
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <p>Info</p>
      <div className="flex">
        <div className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md bg-[#BB6FF7] text-sm" />
        <p className="text-sm font-normal">Salt Marsh</p>
      </div>
    </div>
  );
};

export default SaltMarshContent;
