import { useState, useCallback } from 'react';

import Icon from 'components/ui/icon';
import cn from 'lib/classnames';
import ARROW_SVG from 'svgs/ui/arrow.svg';

// components

const Download = ({ info }: { info: Record<string, string | number>[] }) => {
  const [isCollapsed, toggleCollapse] = useState<Record<string, boolean>>({});

  const handleClick = useCallback(
    (id: string) => {
      toggleCollapse((prev: Record<string, boolean>) => ({
        ...prev,
        [id]: !prev[id],
      }));
    },
    [toggleCollapse],
  );

  return (
    <div className="mb-10 flex flex-col space-y-12 md:space-y-6">
      <h2 className="font-black/85 text-3xl font-light leading-10">Download Data</h2>
      <div className="space-y-2">
        {info.map(({ id, title, href, description, license }) => (
          <div key={id} className="text-xs font-bold uppercase tracking-widest">
            <div className="flex w-full items-center justify-between">
              <div className="flex" onClick={() => handleClick(id as string)}>
                <Icon
                  icon={ARROW_SVG}
                  className={cn({
                    'h-3 w-3 font-bold': true,
                    'rotate-180 transform': isCollapsed[id],
                    hidden: !description,
                  })}
                  description="Download"
                />
                <h3 className={cn({ 'ml-6': description })}>{title}</h3>
              </div>
              {href && (
                <a
                  href={href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-800 underline hover:no-underline"
                >
                  DOWNLOAD
                </a>
              )}
            </div>
            <p className={cn({ hidden: true, 'block py-4': isCollapsed[id] })}>{description}</p>
            <p>{license}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Download;
