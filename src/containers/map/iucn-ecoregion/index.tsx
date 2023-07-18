import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';
const legendItems = [
  { color: '#F3AD6A', label: 'Vulnerable' },
  {
    color: '#B4DCAA',
    label: 'Least Concern',
  },
  {
    color: '#ECECEF',
    label: 'Not Evaluated',
  },
];
const IucnEcoregionRestoration = () => {
  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPPER_STYLE]: true,
        'min-w-[800px] space-x-2 p-5 pt-0': true,
      })}
    >
      <header className="flex w-full items-center justify-between">
        <h2 className="cursor-pointer whitespace-nowrap py-5 text-xs font-bold uppercase -tracking-tighter text-black/85">
          ECOSYSTEM ASSESMENT
        </h2>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap text-sm text-brand-800 underline"
        >
          Ecoregional assesment (PDF)
        </a>
      </header>
      <ul className="flex space-x-2 text-sm text-black/85">
        {legendItems.map(({ color, label }) => (
          <li key={label} className="flex items-center space-x-2">
            {color && (
              <div
                className={cn({
                  'h-4 w-2 shrink-0 rounded-full font-normal': true,
                })}
                style={{ backgroundColor: color }}
              />
            )}
            {<span>{label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IucnEcoregionRestoration;
