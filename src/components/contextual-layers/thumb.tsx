import Image from 'next/image';

const Thumb = ({ source, name }: { source: string; name: string }) => (
  <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-xl">
    <Image fill quality={75} className="object-cover" src={source} alt={name} sizes="96px" />
  </div>
);

export default Thumb;
