import Image from 'next/image';
import Link from 'next/link';

import { Media } from 'components/media-query';
import Icon from 'components/ui/icon';

import ABERYSTWYTH_SVG from 'svgs/partners/aberystwyth.svg?sprite';
import NATURE_CONSERVANCY_SVG from 'svgs/partners/nature.svg?sprite';
import SOLO_SVG from 'svgs/partners/solo.svg?sprite';
import WETLANDS_SVG from 'svgs/partners/wetlands.svg?sprite';

const PartnersLinks = () => {
  return (
    <div className="flex w-full space-x-12">
      <div className="space-y-4 pb-6">
        <p className="text-xs font-bold uppercase">Powered by</p>
        <Link
          href="https://www.mangrovealliance.org/"
          className="pb-3 text-left text-2lg font-light leading-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Media lessThan="md">
            <Image alt="GMA" src="/images/menu/gma.webp" width={88} height={50} />
          </Media>
          <Media greaterThanOrEqual="md">
            <Image alt="GMA" src="/images/menu/gma.webp" width={133} height={58} />
          </Media>
        </Link>
      </div>

      <div className="space-y-4 pb-6">
        <p className="text-xs font-bold uppercase">Partners</p>
        <div className="flex w-full flex-wrap items-center gap-6">
          <Link href="https://www.aber.ac.uk/en/">
            <Icon icon={ABERYSTWYTH_SVG} className="h-full w-32" description="ABERYSTWYTH" />
          </Link>
          <Link href="https://soloeo.com/">
            <Icon icon={SOLO_SVG} className="h-full w-32" description="SOLO" />
          </Link>
          <Link href="https://www.wetlands.org/">
            <Icon icon={WETLANDS_SVG} className="h-full w-32" description="Wetlands" />
          </Link>
          <Link href="https://www.nature.org/">
            <Icon
              icon={NATURE_CONSERVANCY_SVG}
              className="h-full w-32"
              description="NATURE_CONSERVANCY"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartnersLinks;
