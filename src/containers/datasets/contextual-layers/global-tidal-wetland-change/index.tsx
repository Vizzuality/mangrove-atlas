import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const GlobalTidalWetlandChangeContent = () => (
  <div className={WIDGET_CARD_WRAPPER_STYLE}>
    <p>This layer contains maps of the global extent of tidal wetlands and their change..</p>
    <div className="flex space-x-6">
      <div className="flex">
        <div className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md bg-[#B7E6A5] text-sm" />
        <p className="text-sm font-normal">Intertidal wetland gain</p>
      </div>
      <div className="flex">
        <div className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md bg-[#CA3F2C] text-sm" />
        <p className="text-sm font-normal">Intertidal wetland loss</p>
      </div>
    </div>
  </div>
);

export default GlobalTidalWetlandChangeContent;
