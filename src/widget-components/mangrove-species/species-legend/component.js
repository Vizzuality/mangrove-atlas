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
      
                <div className={cx(styles.itemWrapper, { [styles._collapse]: !collapse[item.value] })}>
                  <button className={styles.toggleList}  onClick={() => handleCollapse(item.value)}>
                    <span className={styles.itemColor} style={{ backgroundColor: item.color }} />
                    <span>{item.value}</span>
                    <img alt={collapse ? 'Show species' : 'Hide species'} src={collapse[item.value] ? lessIcon : moreIcon} />
                  </button>

                  {
                    <ul className={styles.list}>
                      {item?.payload?.species.map((s) => (
                        <a className={styles.speciesLink} href={s.iucn_url}>
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
