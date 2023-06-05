import { string, number, array } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export type RestorationPopUp = {
  AGB: number;
  Ant_SLR: string;
  Ant_SLR1: number;
  Area_loss_ha: number;
  Area_loss_pct: number;
  Bivalve: number;
  Class: string;
  Contig_Group: string;
  Contig_Group1: number;
  Country: string;
  Crab: number;
  Fish_Score: number;
  Fish_Score_Inv: number;
  Flow_Group: string;
  Flow_Group1: number;
  Future_SLR: string;
  Future_SLR1: number;
  ID: number;
  Loss_Driver: string;
  Max_Area_20_ha: number;
  Max_Score: number;
  Med_Patch: string;
  Med_Patch_1: number;
  Min_Score: number;
  OBJECTID: number;
  Rest_Area_Loss: number;
  Rest_Area_Loss_pct: number;
  Rest_Score: number;
  SOC: number;
  Shape_Area: number;
  Shape_Length: number;
  Shrimp: number;
  Tidal_range: string;
  Tidal_range1: number;
  Time_Loss: string;
  Time_Loss1: number;
  Type: string;
};

export const basemapAtom = atom({
  key: 'basemap',
  default: 'light',
  effects: [
    urlSyncEffect({
      refine: string(),
    }),
  ],
});

// ? this atom syncs the bounds of the URL with the initial view of the map, allowing
// ? the initialization of the map with bounds from the URL
export const URLboundsAtom = atom({
  key: 'bounds',
  default: null,
  effects: [
    urlSyncEffect({
      refine: array(array(number())),
    }),
  ],
});

// ? this atom sets internally the bounds of the map, not messing with the ones from the URL
export const locationBoundsAtom = atom<[number, number, number, number]>({
  key: 'locationBounds',
  default: null,
});

export const restorationPopUpAtom = atom<{
  popup: number[];
  popupInfo: RestorationPopUp;
  popUpPosition: { x: number; y: number };
}>({
  key: 'restoration-popup',
  default: {
    popup: [],
    popupInfo: null,
    popUpPosition: {
      x: null,
      y: null,
    },
  },
});
