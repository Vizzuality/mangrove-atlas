import BASEMAPS from 'containers/datasets/contextual-layers/basemaps';
import { CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES } from 'containers/datasets/contextual-layers/constants';

import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import CardBasemapContextual from './card';

const BasemapsContextualMapSettings = () => {
  return (
    <div className={`${WIDGET_CARD_WRAPPER_STYLE} flex flex-col`}>
      {BASEMAPS.map((basemap) => (
        <CardBasemapContextual key={basemap.id} {...basemap} />
      ))}
      {CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES.map((basemap) => (
        <CardBasemapContextual key={basemap.id} {...basemap} />
      ))}
    </div>
  );
};

export default BasemapsContextualMapSettings;
// return (
//   <div
//     className={cn({
//       'flex w-full items-center justify-between rounded-lg bg-white px-5 py-4 shadow-medium print:hidden':
//         true,
//       [className]: !!className,
//     })}
//   >

{
  /* <div className="flex items-center space-x-2 md:space-x-2.5">
      {BASEMAPS.map(({ id, name }) => (
        <button
          key={id}
          type="button"
          data-basemap={id}
          className={cn({
            'h-[45px] w-[35px] overflow-hidden rounded-4xl bg-transparent bg-cover bg-center p-0 transition-all duration-500 ease-in-out hover:shadow-[0_2px_5px_0_rgba(7,127,172,0.43)]':
              true,
            'border-2 border-brand-800 shadow-soft': currentBasemap.id === id,
          })}
          onClick={() => setBasemap(id)}
        >
          <Image src={THUMBS[id] as StaticImageData} alt={name} width={35} height={45} />
        </button>
      ))}
    </div>
  </div>
);
}; */
}
