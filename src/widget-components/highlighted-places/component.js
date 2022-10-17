import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Link from "redux-first-router-link";

import Widget from "components/widget";

import config from "./config";
import styles from "./style.module.scss";
import RufijiImage from "./images/rufiji.jpg";
import SaloumImage from "./images/saloum.jpg";
import Worldwide from "./images/worldwide.jpg";

const HighlightedPlaces = ({
  data: rawData,
  currentLocation,
  isCollapsed,
  slug,
  name,
}) => {
  if (!rawData) {
    return null;
  }

  const bgImages = {
    "0edd0ebb-892b-5774-8ce5-08e0ba7136b1": RufijiImage,
    "4a79230b-7ecb-58ae-ba0d-0f57faa2a104": SaloumImage,
  };
  const data = config.parse(rawData);

  return (
    <div className={styles.widget}>
      <Widget
        name={name}
        data={data}
        slug={slug}
        filename={slug}
        isCollapsed={isCollapsed}
      >
        <div
          className={classnames(styles.hotspotsList, {
            [styles.collapsed]: isCollapsed,
          })}
        >
          {data.map(
            (d) =>
              (
                <Link
                  key={d.id}
                  to={{ type: "PAGE/WDPA", payload: { id: d.location_id } }}
                >
                  {d.id !== currentLocation.id && (
                    <div
                      style={{
                        backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 64.18%, rgba(0,0,0,0) 100%), url(${
                          bgImages[d.location_id]
                        })`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                      className={classnames(styles.card, {
                        [styles.active]: d.location_id === currentLocation.id,
                      })}
                    >
                      <span className={styles.cardInfo}>
                        <h3 className="notranslate">{d.name}</h3>
                      </span>
                    </div>
                  )}
                </Link>
              )
          )}
          {currentLocation.location_type === "wdpa" && (
            <Link to={{ type: "PAGE/APP" }}>
              <div
                key={currentLocation.id}
                style={{
                  backgroundImage: `url(${Worldwide})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                className={classnames(styles.card, {
                  [styles.hidden]:
                    currentLocation.location_type === "worldwide",
                })}
              >
                <span className={styles.cardInfo}>
                  <h3 className={classnames("notranslate", styles.title)}>
                    Worlwide
                  </h3>
                </span>
              </div>
            </Link>
          )}
        </div>
      </Widget>
    </div>
  );
};

HighlightedPlaces.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  currentLocation: PropTypes.shape({}),
  slug: PropTypes.string,
  name: PropTypes.string,
  isCollapsed: PropTypes.bool,
};

HighlightedPlaces.defaultProps = {
  data: null,
  currentLocation: null,
  slug: null,
  name: null,
  isCollapsed: false,
};

export default HighlightedPlaces;
