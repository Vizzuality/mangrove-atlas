'use client';

import Link from 'next/link';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import SvgExternalLink from '@/svgs/ui/external_link';

type Props = {
  id: number;
  name: string;
};

const SitesItem = ({ name, id }: Props) => {
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`${process.env.NEXT_PUBLIC_MRTT_SITE}/sites/${id}/overview`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} (opens in new tab)`}
            className="flex cursor-pointer items-center justify-between space-y-4"
          >
            <span>{name}</span>
            <span
              aria-hidden="true"
              className="border-brand-800/20 text-brand-800 rounded-full border-2 p-[5px]"
            >
              <SvgExternalLink className="h-4 w-4 shrink-0" />
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          className="bg-gray-700 px-2 text-white"
          align="start"
          sideOffset={-180}
          side="right"
        >
          Open in MRTT tool
        </TooltipContent>
      </Tooltip>
    </li>
  );
};

export default SitesItem;
