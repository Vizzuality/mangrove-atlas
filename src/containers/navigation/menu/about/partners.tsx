import cn from 'lib/classnames';
import Image from 'next/image';
import Link from 'next/link';

import { PartnerProps } from './types';

const AboutPartners = ({ title, list, classname }: PartnerProps) => {
  return (
    <div>
      <p>{title}</p>
      <div
        className={cn('flex w-full flex-1 flex-wrap items-center justify-between gap-2.5 py-4', {
          [classname]: !!classname,
        })}
      >
        {list.map((item, index) => (
          <Link key={index} href={item.url} target="_blank" rel="noopener noreferrer">
            <Image
              src={item.image}
              alt={item.name}
              width={item.size[0]}
              height={item.size[1]}
              className="cursor-pointer"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AboutPartners;
