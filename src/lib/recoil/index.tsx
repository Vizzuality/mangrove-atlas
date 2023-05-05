import { RecoilURLSync, RecoilURLSyncOptions } from 'recoil-sync';

import { useSyncURLNext } from './useSyncURLNext';

type Props = Omit<RecoilURLSyncOptions, 'browserInterface'> & {
  decodedQueryParams?: boolean;
};

export type Serialize = (data: unknown) => string;

export type Deserialize = (str: string) => unknown;

export const RecoilURLSyncNext: React.FC<Props> = ({ children, ...options }) => {
  const { decodedQueryParams = true } = options;

  const { browserInterface, ...defaultOptions } = useSyncURLNext({
    decodedQueryParams,
  });

  return (
    <RecoilURLSync
      {...{
        ...defaultOptions,
        ...options,
        browserInterface,
      }}
    >
      {children}
    </RecoilURLSync>
  );
};
