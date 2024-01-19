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

type ProtectedArea = {
  ISO3: string;
  NAME: string;
  ORIG_NAME: string;
  PARENT_ISO: string;
  PA_DEF: number;
  STATUS: string;
  STATUS_YR: number;
  VERIF: string;
  WDPAID: number;
  fid: number;
  id: string;
};

export type LocationPopUp = {
  location: {
    iso: string;
    name: string;
    type: 'country' | 'wdpa';
  };
  protectedArea?: ProtectedArea[];
};

export type PopUpKey = 'restoration' | 'ecoregion' | 'location';
