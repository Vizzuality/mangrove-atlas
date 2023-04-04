import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

import cx from 'classnames';
import moreIcon from 'widget-components/icons/icon-more.svg';
import lessIcon from 'widget-components/icons/icon-less.svg';
import styles from "./style.module.scss";

const Legend = ({ data }) => {
  const [collapse, toggleCollapse] = useState({});
  
  const handleCollapse = useCallback((id) => 
    toggleCollapse({ [id]: !collapse?.[id]}), [collapse]);

    return (
    <div className={styles.widget_legend}>
      {data?.map((d) => (
        <div key={d.label} className={styles.widget_legend_group}>
          <ul className={styles.widget_legend_list}>
              <li
                key={`item-${d.color}`}
                className={styles.widget_legend_list_item}
              >
                <div
                  style={{ maxHeight: collapse[d.label] ? 320 : 20}}
                  className={cx(styles.itemWrapper, {[styles._collapse]: !collapse[d.label] })}
                >
                  <button className={styles.toggleList}  onClick={() => handleCollapse(d.label)}>
                    <span className={styles.itemColor} style={{ backgroundColor: d.color }} />
                    <span>{d.label}</span>
                    <img alt={collapse ? 'Hide species' : 'Show species'} src={collapse[d.label] ? lessIcon : moreIcon} />
                  </button>

                  {
                    <ul className={cx(styles.list, {
                      [styles._large]: d?.value > 3
                    })}>
                      {d?.species.map((s) => (
                        <a key={s?.scientific_name} className={styles.speciesLink} href={s.iucn_url} target="_blank" rel="noopener noreferrer">
                          <li>{s?.scientific_name}</li>
                        </a>
                      ))}
                    </ul>
                  }
                </div>
              </li>
          </ul>
  
        </div>
      ))}
    </div>
  );
};

Legend.propTypes = {
  groups: PropTypes.shape({}).isRequired,
};

export default Legend;
