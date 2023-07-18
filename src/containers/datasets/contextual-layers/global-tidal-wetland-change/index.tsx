import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const GlobalTidalWetlandChangeContent = () => (
  <div className={WIDGET_CARD_WRAPPER_STYLE}>
    <p>
      Simultaneous detection of change in mangrove, tidal flat and saltmarsh ecosystems. Change
      product depicting loss and gain of tidal wetlands over the period 1999-2019. Global extent at
      30-m resolution.
    </p>
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
