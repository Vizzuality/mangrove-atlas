import cn from 'lib/classnames';

import { widgetsCollapsedAtom } from 'store/widgets';

import { motion } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';

import WidgetControls from 'components/widget-controls';
import { WidgetSlugType } from 'types/widget';

import { getWidgetActive } from './selector';

type WidgetLayoutProps = {
  id: WidgetSlugType;
  title: string;
  children: React.ReactNode;
  className?: string;
};

const WidgetWrapper: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children, title, id, className } = props;

  const isWidgetActive = useRecoilValue(getWidgetActive(id));

  console.log({ isWidgetActive });

  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const widgetToUpdated = widgetsCollapsed.find((w) => `${Object.keys(w)}` === id);

  const handleWidgetCollapsed = () => {
    const updatedWidgetsCollapsed = widgetsCollapsed.map((w) => {
      if (`${Object.keys(w)}` === id) {
        return {
          ...w,
          [`${Object.keys(w)}`]: !Object.values(widgetToUpdated)[0],
        };
      }
      return w;
    });

    setWidgetsCollapsed(updatedWidgetsCollapsed);
  };

  return (
    <motion.div
      animate={{
        // marginBottom: isCollapsed[id] ? 0 : '-70px',
        // marginTop: isCollapsed[id] ? 0 : '-3px',
        boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)',
      }}
      className={cn({
        'md:h-fit-conten ml-[3%] mb-3 w-[94%] rounded-2xl border border-[#DADED0] bg-white px-1 py-1 shadow-3xl md:ml-0 md:w-[540px]':
          true,
        '-mb-6': !!Object.values(widgetToUpdated)[0],
        [className]: !!className,
      })}
    >
      <div
        className={cn({
          'rounded-2xl border-2 border-transparent px-9 pt-3 pb-5': true,
          'border-brand-800': isWidgetActive,
        })}
      >
        <header className="flex items-center justify-between">
          <h2
            onClick={handleWidgetCollapsed}
            className="flex-1 cursor-pointer py-5 text-xs font-bold uppercase -tracking-tighter text-black/85"
          >
            {title}
          </h2>
          <WidgetControls id={id} />
        </header>

        {!Object.values(widgetToUpdated)[0] && children}
      </div>
    </motion.div>
  );
};

export default WidgetWrapper;
