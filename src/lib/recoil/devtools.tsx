import { useEffect } from 'react';

import { useRecoilSnapshot } from 'recoil';

function RecoilDevTools() {
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('The following atoms were modified:');
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      // eslint-disable-next-line no-console
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}

export default RecoilDevTools;
