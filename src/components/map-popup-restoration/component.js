import React from "react";
import PropTypes from "prop-types";
import style from "./style.module.scss";

const MapPopUpRestoration = ({ restorationData }) => {
  const {
    Max_Area_20_ha,
    Area_loss_ha,
    Area_loss_pct,
    Rest_Area_Loss,
    Rest_Area_Loss_pct,
    Rest_Score,
    Area_dgrd_ha,
    Area_dgrd_pct,
    Tidal_range,
    Tidal_range1,
    Ant_SLR,
    Ant_SLR1,
    Future_SLR,
    Future_SLR1,
    AGB,
    Class,
    Country,
    Fish_Score,
    Fish_Score_Inv,
    Med_Patch,
    Med_Patch1,
    People,
    Region,
    SOC,
    Sediment,
    Sediment1,
    Time_Loss,
    Time_Loss1,
    Prop_loss,
    Prop_loss1,
  } = restorationData;

  return (
    <div className={style.popupWrapper}>
      <div className={style.infoContent}>
        <div className={style.title}>Mangrove Type</div>
        <div className={style.content}>{Class}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Max Magrove Area</div>
        <div className={style.content}>{Max_Area_20_ha}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Area of Loss</div>
        <div className={style.content}>{`${Area_loss_ha} (${Area_loss_pct})`}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Restorable Area</div>
        <div className={style.content}>{Rest_Area_Loss}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Percent Restorable</div>
        <div className={style.content}>{Rest_Area_Loss_pct}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Area Degraded</div>
        <div className={style.content}>{`${Area_dgrd_ha} (${Area_dgrd_pct})`}</div>
      </div>
      {/* Widget bars */}
      <div className={style.infoContent}>
        <div className={style.title}>Tidal range</div>
        <div className={style.content}>{Tidal_range}</div>
        <div className={style.content}>{Tidal_range1}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Antecedent SLR</div>
        <div className={style.content}>{Ant_SLR}</div>
        <div className={style.content}>{Ant_SLR1}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Future SLR</div>
        <div className={style.content}>{Future_SLR}</div>
        <div className={style.content}>{Future_SLR1}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Time since loss</div>
        <div className={style.content}>{Time_Loss}</div>
        <div className={style.content}>{Time_Loss1}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Sus. sediment trend</div>
        <div className={style.content}>{Sediment}</div>
        <div className={style.content}>{Sediment1}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Median patch size</div>
        <div className={style.content}>{Med_Patch}</div>
        <div className={style.content}>{Med_Patch1}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Percent contiguous</div>
        <div className={style.content}>{Prop_loss}</div>
        <div className={style.content}>{Prop_loss1}</div>
      </div>

      {/* Ring chart */}
      <div className={style.infoContent}>
        <div className={style.title}>Restoration Potential Score</div>
        <div className={style.content}>{Rest_Score}</div>
      </div>
      {/* Ecosystem services */}
      <div className={style.infoContent}>
        <div className={style.title}>Soil Organic Carbon</div>
        <div className={style.content}>{SOC}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Aboveground Carbon</div>
        <div className={style.content}>{AGB}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>People Protected</div>
        <div className={style.content}>{People}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Commercial Fish Catch Enhancement Value</div>
        <div className={style.content}>{Fish_Score}</div>
      </div>
      <div className={style.infoContent}>
        <div className={style.title}>Commercial Fish Catch Invert Value</div>
        <div className={style.content}>{Fish_Score_Inv}</div>
      </div>
    </div>
  );
};

MapPopUpRestoration.propTypes = {};

MapPopUpRestoration.defaultProps = {};

export default MapPopUpRestoration;
