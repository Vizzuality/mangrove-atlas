import React, { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import Icon from 'components/ui/icon';

import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';

import type { LegendItem, Category } from './types';
type Legend = {
  items: LegendItem[];
};

const Legend = ({ items }: Legend) => {
  const [collapse, toggleCollapse] = useState({});

  const handleCollapse = useCallback(
    (id: Category) => toggleCollapse({ ...collapse, [id]: !collapse?.[id] }),
    [collapse]
  );

  return (
    <div className="space-y-1 text-sm">
      {items?.map((d) => (
        <div key={d.label} className="flex">
          <ul>
            <li key={`item-${d.color}`}>
              <div className="m-0 overflow-hidden p-0 md:pr-4">
                <button
                  className="flex items-center space-x-2"
                  onClick={() => handleCollapse(d.label)}
                >
                  <span className="h-4 w-2 rounded-md" style={{ backgroundColor: d.color }} />
                  <span className="whitespace-nowrap text-black/85">{d.label}</span>
                  <Icon
                    icon={ARROW_SVG}
                    className={cn({
                      'w-3 text-grey-400': true,
                      'rotate-180': !!collapse[d.label],
                    })}
                  />
                </button>

                {
                  <ul
                    style={{ maxHeight: !!collapse[d.label] ? 85 : 0 }}
                    className={cn({
                      'w-fit overflow-y-auto py-1 px-4 font-bold italic text-brand-800 underline':
                        true,
                      'py-0': !collapse[d.label],
                    })}
                  >
                    {d?.species.map((s) => (
                      <li key={s?.scientific_name}>
                        <a href={s.iucn_url} target="_blank" rel="noopener noreferrer">
                          {s?.scientific_name}
                        </a>
                      </li>
                    ))}
                  </ul>
                }
              </div>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Legend;
