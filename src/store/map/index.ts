import { array, bool, dict, number, object, string } from '@recoiljs/refine';
import { atom, useRecoilCallback, useRecoilValue } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const activeLayersAtom = atom({
  key: 'active-layers',
  default: ['biomass', 'extent'],
  effects: [
    urlSyncEffect({
      refine: array(string()),
    }),
  ],
});

export const basemapAtom = atom({
  key: 'basemap',
  default: 'light',
});

// export const layersSettings = atom({
//   key: 'layers-settings',
//   default: {},
//   effects: [
//     urlSyncEffect({
//       refine: dict(
//         object({
//           opacity: number(),
//           visibility: bool(),
//           expand: bool(),
//         })
//       ),
//     }),
//   ],
// });

// export function useSyncExploreMap() {
//   const layers = useRecoilValue(activeLayers);

//   const syncAtoms = useRecoilCallback(
//     ({ snapshot, set, reset }) =>
//       async () => {
//         const lys = await snapshot.getPromise(activeLayers);
//         const lysSettings = await snapshot.getPromise(layersSettings);

//         // Remove layersettings that are not in layers
//         Object.keys(lysSettings).forEach((ly) => {
//           if (!lys.includes(ly)) {
//             set(layersSettings, (prev) => {
//               const { [ly]: l, ...rest } = prev;
//               return rest;
//             });
//           }
//         });

//         if (lys.length === 0) {
//           reset(layersSettings);
//         }
//       },
//     []
//   );

//   // Sync layersettings when layers change
//   useEffect(() => {
//     syncAtoms();
//   }, [layers]); // eslint-disable-line react-hooks/exhaustive-deps

//   return null;
// }
