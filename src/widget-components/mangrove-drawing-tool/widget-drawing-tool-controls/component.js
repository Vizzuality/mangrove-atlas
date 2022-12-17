import React, { useCallback } from "react";
import PropTypes from "prop-types";

import Button from "components/button";

import analysisService from "services/analysis-service";

import styles from "./style.module.scss";

export const WidgetDrawingToolControls = ({
  slug,
  fetch,
  drawingValue,
  isLoading,
  restart,
  setRestart,
  wId,
}) => {
  const abortRequest = useCallback(() => {
    analysisService.widgetControllers[slug].abort();
    setRestart(true);
  }, [setRestart, slug]);

  const restartRequest = useCallback(() => {
    fetch({
      params: {
        drawingValue,
        slug: [slug],
        location_id: "custom-area",
      }, wId });
    setRestart(null);
  }, [fetch, slug, drawingValue, setRestart]);

  return (
    <div className={styles.widgetControlsWrapper}>
      {restart && !isLoading && (<p className={styles.description}>An error occurred while fetching the data. You can try again</p>)}
      <div className={styles.btnWrapper}>
        {isLoading && (
          <Button hasBackground onClick={abortRequest}>
            Cancel analysis
          </Button>
        )}
        {restart && !isLoading && (
          <Button hasBackground onClick={restartRequest}>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
};

WidgetDrawingToolControls.propTypes = {
  current: PropTypes.string,
  setDrawingValue: PropTypes.func,
};

WidgetDrawingToolControls.defaultProps = {
  current: null,
  setDrawingValue: () => null,
};

export default WidgetDrawingToolControls;
