type LayoutMdxProps = {
  children: React.ReactNode;
};

const LayoutMdx: React.FC<LayoutMdxProps> = (props: LayoutMdxProps) => {
  const { children } = props;

  return (
    <article className="prose:font-sans prose-a:text-decoration-none prose prose-h1:text-3xl prose-h1:font-light prose-h1:leading-[50px] prose-h1:text-[rgba(0,0,0,.85)] prose-h2:text-sm prose-h2:font-semibold prose-a:font-semibold prose-a:text-[#00857f] prose-a:decoration-transparent">
      {/* Content */}
      {children}
    </article>
  );
};

export default LayoutMdx;
