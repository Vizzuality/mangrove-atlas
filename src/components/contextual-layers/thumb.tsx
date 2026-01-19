import Image from 'next/image';

const Thumb = ({ source, name }: { source: string; name: string }) => (
  <div className="relative h-[96px] w-[96px] shrink-0 rounded-xl">
    <Image
      fill={true}
      quality={100}
      style={{ objectFit: 'cover' }}
      className="rounded-xl"
      src={source}
      alt={name}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);

export default Thumb;
