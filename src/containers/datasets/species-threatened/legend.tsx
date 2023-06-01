import React, { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import Icon from 'components/icon';

import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';

import type { LegendItem } from './types';
type Legend = {
  items: LegendItem[];
};

const Legend = ({ items }: Legend) => {
  const [collapse, toggleCollapse] = useState({});

  const handleCollapse = useCallback((id) => toggleCollapse({ [id]: !collapse?.[id] }), [collapse]);

  return (
    <div className="space-y-1 text-sm">
      {items?.map((d) => (
        <div key={d.label} className="flex">
          <ul>
            <li key={`item-${d.color}`}>
              <div
                className="overflow-y-scroll pr-2"
                style={{ maxHeight: collapse[d.label] ? 85 : 20 }}
              >
                <button
                  className="flex items-center space-x-2"
                  onClick={() => handleCollapse(d.label)}
                >
                  <span className="h-4 w-2 rounded-md" style={{ backgroundColor: d.color }} />
                  <span className="whitespace-nowrap text-black/85">{d.label}</span>
                  <Icon
                    icon={ARROW_SVG}
                    className={cn({ 'w-3 text-grey-400': true, 'rotate-180': !!collapse[d.label] })}
                  />
                </button>

                {
                  <ul className="overflow-y-scroll py-1 pl-4 font-bold italic text-brand-800 underline">
                    {d?.species.map((s) => (
                      <a
                        key={s?.scientific_name}
                        href={s.iucn_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <li>{s?.scientific_name}</li>
                      </a>
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
