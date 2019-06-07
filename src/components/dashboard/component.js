import React from 'react';
import PropTypes from 'prop-types';

import Header from 'components/header';
import WidgetList from 'components/widget-list';
import Footer from 'components/footer';

import './style.scss';

const Dashboard = ({ title, widgets }) => (
  <div className="dashboard">
    <Header title={title} />
    <WidgetList list={widgets} />
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
