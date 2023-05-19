type WidgetLayoutProps = {
  children: React.ReactNode;
};
import LocationTitle from 'components/location-title';

const WidgetsLayout: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children } = props;

  return (
    <div className="absolute top-0 left-18 z-[20] h-full overflow-y-auto py-20 scrollbar-hide">
      {/* Content */}
      <LocationTitle />

      {children}
    </div>
  );
};

export default WidgetsLayout;
