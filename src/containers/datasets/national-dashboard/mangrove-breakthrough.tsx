import cn from '@/lib/classnames';
import Image from 'next/image';
import Link from 'next/link';

const MangroveBreakthrough = ({
  location,
  mangroveBreakthrough,
}: {
  location: string;
  mangroveBreakthrough: boolean;
}) => {
  return (
    <section className="space-y-2 py-[25px]">
      <div className="flex items-center justify-between">
        <p
          className={cn({
            'text-sm first-letter:capitalize': true,
            'max-w-[50%]': mangroveBreakthrough,
          })}
        >
          {location} is {mangroveBreakthrough ? '' : 'not currently'} committed to{' '}
          <Link
            href="https://www.mangrovealliance.org/news/the-mangrove-breakthrough"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-800 underline"
          >
            Mangrove Breakthrough
          </Link>
        </p>
        {mangroveBreakthrough && (
          <Image
            src="/images/mangrove-breakthrough.jpg"
            alt="Mangrove breakthrough"
            width={135}
            height={26}
          />
        )}
      </div>
    </section>
  );
};

export default MangroveBreakthrough;
