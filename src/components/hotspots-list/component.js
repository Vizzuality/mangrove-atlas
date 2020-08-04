import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';

import Rufiji from 'widget-components/highlighted-places/images/rufiji.jpg';
import Saloum from 'widget-components/highlighted-places/images/saloum.jpg';

import styles from './style.module.scss';

const HotspotsList = ({ data }) => (
  <div className={styles.hotspotsList}>
    {data && data.map(d => (

      <Link key={d.id} to={{ type: 'PAGE/AOI', payload: { id: d.location_id } }}>
        <div
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 64.18%, rgba(0,0,0,0) 100%), url(${d.name === 'Rufiji Delta' ? Rufiji : Saloum})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
          className={styles.card}
        >
          <span className={styles.cardInfo}>
            <h3 className="notranslate">{d.name}</h3>
          </span>
        </div>
      </Link>
    ))
    }
  </div>
);

HotspotsList.propTypes = { data: PropTypes.arrayOf(PropTypes.shape({})).isRequired };

export default HotspotsList;
