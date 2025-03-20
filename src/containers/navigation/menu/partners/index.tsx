import Image from 'next/image';
import Link from 'next/link';

import Icon from 'components/ui/icon';

import ABERYSTWYTH_SVG from 'svgs/partners/aberystwyth.svg?sprite';
import NATURE_CONSERVANCY_SVG from 'svgs/partners/nature.svg?sprite';
import SOLO_SVG from 'svgs/partners/solo.svg?sprite';
import WETLANDS_SVG from 'svgs/partners/wetlands.svg?sprite';

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

      <div className="space-y-4 pb-6">
        <p className="text-xs font-bold uppercase">Partners</p>
        <div className="flex w-full flex-wrap items-center gap-4">
          <Link href="https://www.aber.ac.uk/en/">
            <Icon icon={ABERYSTWYTH_SVG} className="h-full w-24" description="ABERYSTWYTH" />
          </Link>
          <Link href="https://soloeo.com/">
            <Icon icon={SOLO_SVG} className="h-full w-24" description="SOLO" />
          </Link>
          <Link href="https://www.wetlands.org/">
            <Icon icon={WETLANDS_SVG} className="h-full w-24" description="Wetlands" />
          </Link>
          <Link href="https://www.nature.org/">
            <Icon
              icon={NATURE_CONSERVANCY_SVG}
              className="h-full w-24"
              description="NATURE_CONSERVANCY"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartnersLinks;
