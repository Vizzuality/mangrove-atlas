type WidgetLayoutProps = {
  children: React.ReactNode;
};
import LocationTitle from 'components/location-title';

const WidgetsLayout: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children } = props;

  return (
    <div className="absolute top-0 left-0 z-20 h-full w-screen overflow-y-auto bg-brand-400 py-20 scrollbar-hide md:left-18 md:w-auto md:bg-transparent">
      {/* Content */}
      <LocationTitle />

      {children}
    </div>
  );
};

export default WidgetsLayout;
