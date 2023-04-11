type LayoutMdxProps = {
  children: React.ReactNode;
};

const LayoutMdx: React.FC<LayoutMdxProps> = (props: LayoutMdxProps) => {
  const { children } = props;

  return (
    <article className="prose">
      {/* Content */}
      {children}
    </article>
  );
};

export default LayoutMdx;
