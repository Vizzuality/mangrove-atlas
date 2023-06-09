import { useCallback, useEffect, useMemo, useState } from 'react';

import cn from 'lib/classnames';

import { widgetsCollapsedAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';
import { useLocalStorage } from 'usehooks-ts';

import WidgetsLayout from 'layouts/widgets';

import Blog from 'containers/blog';
import { WIDGETS } from 'containers/datasets';
import WidgetWrapper from 'containers/widget';
import NoData from 'containers/widgets/no-data';

import { Media } from 'components/media-query';

import { useWidgets } from './hooks';

const LOCAL_STORAGE_KEY = 'mangroves_blog';

const WidgetsContainer: React.FC = () => {
  const widgets = useWidgets();

  const [blogStorage, setBlogStorage] = useLocalStorage(LOCAL_STORAGE_KEY, undefined);
  const [isBlogActive, setBlogActive] = useState(false);

  const closeBlogBanner = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      setBlogStorage(String(false));
      setBlogActive(false);
    },
    [setBlogStorage]
  );

  useEffect(() => {
    if (!blogStorage) {
      setBlogActive(true);
    }
  }, [blogStorage, setBlogActive]);

  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const lastWidgetSlug = useMemo(() => widgets.at(-1).slug, [widgets]);

  const widgetsCollapsedChecker = Object.values(widgetsCollapsed).includes(true);

  const handleWidgetsCollapsed = useCallback(() => {
    const updateWidgetsCollapsed = Object.keys(widgetsCollapsed).reduce((acc, key) => {
      acc[key] = widgetsCollapsedChecker ? false : true;
      return acc;
    }, {});

    updateWidgetsCollapsed[lastWidgetSlug] = false;

    setWidgetsCollapsed(updateWidgetsCollapsed);
  }, [widgetsCollapsed, widgetsCollapsedChecker, setWidgetsCollapsed, lastWidgetSlug]);

  return (
    <WidgetsLayout>
      {widgets.length > 1 && (
        <button
          className={cn({
            'mb-10 ml-[3%] w-48 rounded-4xl border-2 border-black border-opacity-20 py-2 px-4 font-sans text-sm font-semibold text-black/85 transition-colors md:ml-0 md:translate-x-44':
              true,
            'border-white bg-white text-brand-800': widgetsCollapsedChecker,
          })}
          onClick={() => handleWidgetsCollapsed()}
        >
          {widgetsCollapsedChecker ? 'Expand all widgets' : 'Collapse all widgets'}
        </button>
      )}

      <Media greaterThanOrEqual="md">
        {isBlogActive && <Blog closeBlogBanner={closeBlogBanner} />}
      </Media>

      {widgets.map(({ slug, name }, ind) => {
        const Widget = WIDGETS[slug];
        return (
          <WidgetWrapper
            key={slug}
            title={name}
            id={slug}
            className={cn({
              [`z-[${40 + ind * 10}]`]: true,
            })}
          >
            {WIDGETS[slug] && <Widget />}
          </WidgetWrapper>
        );
      })}

      {widgets.length === 0 && <NoData />}
    </WidgetsLayout>
  );
};

export default WidgetsContainer;
