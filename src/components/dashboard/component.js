import React from 'react';
import PropTypes from 'prop-types';

import Header from 'components/header';
import Widgets from 'components/widgets';
import Footer from 'components/footer';

import './style.scss';

const Dashboard = ({ title, widgets }) => (
  <div className="dashboard">
    <Header title={title} />
    <Widgets list={widgets} />
    <Footer />
  </div>
);

Dashboard.propTypes = {
  title: PropTypes.string.isRequired,
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Dashboard;
