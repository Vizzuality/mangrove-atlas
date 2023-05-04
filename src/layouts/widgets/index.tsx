type WidgetLayoutProps = {
  children: React.ReactNode;
};
import LocationTitle from 'components/location-title';

const WidgetsLayout: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children } = props;

  return (
    <div className="absolute top-20 left-[65px] z-[20]">
      {/* Content */}
      <LocationTitle />

      {children}
    </div>
  );
};

export default WidgetsLayout;
