import React, { useEffect, useMemo, useRef, useState } from "react";

import { Editor, EditingMode, DrawPolygonMode } from "react-map-gl-draw";

import { featureStyle, editHandleStyle } from "./styles";

export const DrawingEditor = ({
  setCurrent,
  current,
  setDrawingValue,
  drawingValue,
  setDrawingStatus,
  setCustomGeojsonFeatures,
  setMobileView
}) => {
  const editorRef = useRef(null);

  const [abilityEventListener, setAbilityEventListener] = useState(false);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setAbilityEventListener(true);
      }
    };

    !abilityEventListener &&
      document.addEventListener("keydown", keyDownHandler);

    return () => {
      // clean up event listener
      abilityEventListener &&
        document.removeEventListener("keydown", keyDownHandler);
      setAbilityEventListener(false);
    };
  }, [setAbilityEventListener, abilityEventListener]);

  const mode = useMemo(() => {
    if (current === "editing") return new EditingMode();
    if (current === "drawPolygon") {
      return new DrawPolygonMode();
    }
    if (abilityEventListener) return null;

    return new EditingMode();
  }, [current, abilityEventListener]);

  useEffect(() => {
    const EDITOR = editorRef?.current;

    if (!current && !!EDITOR) {
      EDITOR.deleteFeatures(drawingValue);
      setDrawingValue(null);
      setCustomGeojsonFeatures(null);
    }
  }, [current, drawingValue, setDrawingValue, setCustomGeojsonFeatures]);

  useEffect(() => {
    const EDITOR = editorRef?.current;

    return () => {
      if (EDITOR) {
        EDITOR.deleteFeatures(drawingValue);
        setDrawingValue(null);
        setCustomGeojsonFeatures(null);
      }
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    const EDITOR = editorRef?.current;
    return () => {
      if (EDITOR && drawingValue === null) {
        EDITOR.deleteFeatures(drawingValue);
      }
    };
  }, [setDrawingValue, drawingValue]);

  return (
    <Editor
      ref={editorRef}
      clickRadius={12}
      mode={mode}
      features={drawingValue}
      featureStyle={featureStyle}
      editHandleStyle={editHandleStyle}
      editHandleShape="circle"
      onUpdate={(s) => {
        const { data, editType } = s;
        const EDITION_TYPES = ["addFeature"];
        const UPDATE_TYPES = ["addFeature", "addPosition", "movePosition"];
        const dataToStorage = abilityEventListener ? [] : data;

        if (editType === "addTentativePosition" && !drawingValue) {
          // set the state to process when user starts drawing
          setAbilityEventListener(false);
          setDrawingStatus("progress");
        }

        if (EDITION_TYPES.includes(editType)) {
          setCurrent("editing");
          setDrawingValue(dataToStorage);
          setMobileView(false)
        }

        if (UPDATE_TYPES.includes(editType)) {
          setDrawingValue(dataToStorage);
          setMobileView(false)
        }
      }}
    />
  );
};

export default DrawingEditor;
