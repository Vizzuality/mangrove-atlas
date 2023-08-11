import React from 'react';

import Head from 'next/head';

export interface MetaTagsProps {
  title: string;
  description: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description }: MetaTagsProps) => (
  <Head>
    <title>{title}</title>

    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />

    <meta name="og:title" content="Global Mangrove Watch" />
    <meta
      name="og:description"
      content="Global Mangrove Watch (GMW) is an online platform that provides the remote sensing data and tools for monitoring mangroves necessary for this. It gives universal access to near real-time information on where and what changes there are to mangroves across the world, and highlights why they are valuable."
    />
    <meta name="og:type" content="website" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </Head>
);

export default MetaTags;
