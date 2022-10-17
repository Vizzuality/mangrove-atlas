import React, { useCallback } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// components
import Icon from "components/icon";

import styles from "./style.module.scss";

const SearchLocation = ({ mobile, openSearchPanel, handleDrawing }) => {
  const handleModal = useCallback(() => {
    if (handleDrawing) {
      handleDrawing(false)
    }
    openSearchPanel();
  }, [handleDrawing, openSearchPanel]);
   
  return (
    <button
      className={cx(styles.sidebarItem, { [styles.mobile]: mobile })}
      type="button"
      onClick={handleModal}
    >
      <Icon name="glass" alt="Search" />
    </button>
  );
};

SearchLocation.propTypes = {
  mobile: PropTypes.bool,
  openSearchPanel: PropTypes.func,
  handleDrawing: PropTypes.func,
  isOpenModalAlert:  PropTypes.bool,
};

SearchLocation.defaultProps = {
  mobile: false,
  openSearchPanel: null,
  handleDrawing: null,
  isOpenModalAlert: false,
};

export default SearchLocation;
