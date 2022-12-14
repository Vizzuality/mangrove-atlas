import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Spinner from "components/spinner";

import WidgetControls from "components/widget-info-icons/component";
import styles from "./style.module.scss";

function Widget({
  children,
  name,
  slug,
  layerId,
  layersIds,
  isActive,
  isLocationsModal,
  isCollapsed = true,
  isLoading,
  isLast,
  toggleCollapse,
  drawingMode,
}) {
  const collapseToggleHandler = () => {
    toggleCollapse({ id: slug });
  };

  const widgetConditionalStyles = {
    [styles._modal]: isLocationsModal,
    [styles._collapsed]: isCollapsed,
    [styles._layerActive]: isActive,
  };

  // These components are declared here not to clutter component's element
  // and make separation of concerns more easy to grasp, they use scope variables
  // to move them away to their own file you should pass scope vars as properties.
  const CollapseButton = () => (
    <button
      type="button"
      className={styles.title}
      disabled={isLast}
      onClick={collapseToggleHandler}
    >
      {name}
    </button>
  );

  return (
    <div
      className={classnames(
        styles.widget,
        widgetConditionalStyles,
        styles[`${slug}`]
      )}
    >
      <div
        className={classnames(styles.wrapper, {
          [styles._modal]: isLocationsModal,
        })}
      >
        {!isLocationsModal && (
          <div className={styles.header}>
            <CollapseButton />
            <WidgetControls
              name={name}
              slug={slug}
              layerId={layerId}
              layersIds={layersIds}
              isActive={isActive}
            />
          </div>
        )}
        {isLoading ? (
          <Spinner />
        ) : (
          <div
            className={classnames(styles.content, {
              [styles._large]: slug === "mangrove_activity",
            })}
          >
            {!drawingMode && children}
          </div>
        )}
        {drawingMode && children}
      </div>
    </div>
  );
}

Widget.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  slug: PropTypes.string,
  layerId: PropTypes.string,
  layersIds: PropTypes.arrayOf(PropTypes.string),
  isActive: PropTypes.bool,
  isLocationsModal: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  isLoading: PropTypes.bool,
  isLast: PropTypes.bool,
  toggleCollapse: PropTypes.func,
};

Widget.defaultProps = {
  children: null,
  name: null,
  slug: null,
  layerId: null,
  layersIds: null,
  isActive: false,
  isLocationsModal: false,
  isCollapsed: false,
  isLoading: false,
  isLast: false,
  toggleCollapse: () => {},
};

export default Widget;
