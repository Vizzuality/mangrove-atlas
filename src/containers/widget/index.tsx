import WidgetControls from 'components/widget-controls';
import { WidgetSlugType } from 'types/widget';
type WidgetLayoutProps = {
  id: WidgetSlugType;
  title: string;
  children: React.ReactNode;
};

const WidgetWrapper: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children, title, id } = props;

  return (
    <div className="min-h-min w-[540px] rounded-2xl bg-white px-10 pt-8 pb-11 shadow-lg">
      {/* Content */}
      <header className="flex items-center justify-between">
        <h2 className="font-black/85 text-xs font-bold uppercase -tracking-tighter">{title}</h2>
        <WidgetControls id={id} />
      </header>
      {children}
    </div>
  );
};

export default WidgetWrapper;
