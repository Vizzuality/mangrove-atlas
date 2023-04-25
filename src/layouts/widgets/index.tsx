type WidgetLayoutProps = {
  children: React.ReactNode;
};

const WidgetsLayout: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children } = props;

  return (
    <div className="absolute left-[70px] z-[150]">
      {/* Content */}
      {children}
    </div>
  );
};

export default WidgetsLayout;
