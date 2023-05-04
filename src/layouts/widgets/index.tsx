type WidgetLayoutProps = {
  children: React.ReactNode;
};

const WidgetsLayout: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children } = props;

  return (
    <div className="absolute left-[50px] z-[20]">
      {/* Content */}
      {children}
    </div>
  );
};

export default WidgetsLayout;
