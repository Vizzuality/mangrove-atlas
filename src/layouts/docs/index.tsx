// import Footer from 'containers/footer';
// import Header from 'containers/header/app';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const { children } = props;

  return (
    <main className={`flex flex-col font-sans antialiased lg:min-h-screen`}>
      <div className="prose relative grow">
        {/* Content */}
        {children}
      </div>

      {/* <Footer /> */}
    </main>
  );
};

export default Layout;
