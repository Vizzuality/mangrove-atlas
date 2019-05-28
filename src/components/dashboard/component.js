import React from 'react';
import PropTypes from 'prop-types';

import Header from 'components/header';
import Footer from 'components/footer';

import './style.scss';

const Dashboard = ({ title }) => (
  <div className="dashboard">
    <Header title={title} />
    <div>Widgets area</div>
    <Footer />
  </div>
);

Dashboard.propTypes = {
  title: PropTypes.string.isRequired
};

export default Dashboard;
