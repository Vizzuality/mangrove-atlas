import WidgetControls from 'components/widget-controls';
type WidgetLayoutProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

const WidgetLayout: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children, title, id } = props;

  return (
    <div className="min-h-min w-[540px] rounded-2.5xl bg-white py-6 px-10 shadow-lg">
      {/* Content */}
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase">{title}</h2>
        <WidgetControls id={id} />
      </header>
      {children}
    </div>
  );
};

export default WidgetLayout;
