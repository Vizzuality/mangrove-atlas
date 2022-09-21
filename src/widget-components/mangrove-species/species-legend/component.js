import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

import cx from 'classnames';
import moreIcon from 'widget-components/icons/icon-more.svg';
import lessIcon from 'widget-components/icons/icon-less.svg';
import styles from "./style.module.scss";

const Legend = ({ groups }) => {
  const [collapse, toggleCollapse] = useState({});
  
  const handleCollapse = useCallback((id) => 
    toggleCollapse({ [id]: !collapse?.[id]}), [collapse]);


    return (
    <div className={styles.widget_legend}>
      {Object.keys(groups).map((g) => (
        <div key={g} className={styles.widget_legend_group}>
          <ul className={styles.widget_legend_list}>
            {groups[g].map((item, i) => (
              <li
                key={`item-${i + 1}-${item.color}`}
                className={styles.widget_legend_list_item}
              >
                <div
                  style={{ maxHeight: collapse[item.value] ? 220 - (Object.keys(groups).length * 20) : 20}}
                  className={cx(styles.itemWrapper, {[styles._collapse]: !collapse[item.value] })}
                >
                  <button className={styles.toggleList}  onClick={() => handleCollapse(item.value)}>
                    <span className={styles.itemColor} style={{ backgroundColor: item.color }} />
                    <span>{item.value}</span>
                    <img alt={collapse ? 'Hide species' : 'Show species'} src={collapse[item.value] ? lessIcon : moreIcon} />
                  </button>

                  {
                    <ul className={cx(styles.list, {
                      [styles._large]: item?.payload?.species?.length > 3
                    })}>
                      {item?.payload?.species.map((s) => (
                        <a key={s?.scientific_name} className={styles.speciesLink} href={s.iucn_url} target="_blank" rel="noopener noreferrer">
                          <li>{s?.scientific_name}</li>
                        </a>
                      ))}
                    </ul>
                  }
                </div>
              </li>
            ))}
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
