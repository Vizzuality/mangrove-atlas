import Image from 'next/image';
import Link from 'next/link';

import AboutPartners from '../about/partners';
import { ConvenedBy } from '../about/constants';

const PartnersLinks = () => {
  return (
    <div className="flex w-full space-x-12">
      <div className="relative flex w-60 flex-col space-y-6">
        <p className="text-xs font-bold uppercase">Powered by</p>
        <Link
          href="https://www.mangrovealliance.org/"
          className="text-left text-2lg font-light leading-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image alt="GMA" src="/images/menu/gma.webp" width={150} height={65} />
        </Link>
      </div>

      <AboutPartners title="Partners" list={ConvenedBy} classname="grid grid-cols-2" />
    </div>
  );
};

export default PartnersLinks;
