import React, { useEffect, useMemo, useRef } from "react";

import { Editor, EditingMode, DrawPolygonMode } from "react-map-gl-draw";

import { featureStyle, editHandleStyle } from "./styles";

export const DrawingTool = ({
  setCurrent,
  current,
  setDrawingValue,
  drawingValue,
  setDrawingStatus,
}) => {
  const editorRef = useRef(null);

  const mode = useMemo(() => {
    if (current === "editing") return new EditingMode();
    if (current === "drawPolygon") {
      return new DrawPolygonMode();
    }
    
    return null;
  }, [current]);

  useEffect(() => {
    const EDITOR = editorRef?.current;

    if (!current && !!EDITOR) {
      // EDITOR.deleteFeatures(drawingValue);
      setDrawingValue(null);
    }
  }, [current, drawingValue]); // eslint-disable-line

  // useEffect(() => {
  //   const EDITOR = editorRef?.current;

  //   if (!uploading && !!EDITOR) {
  //     EDITOR.deleteFeatures(uploadingValue);
  //     dispatch(setUploadingValue(null));
  //   }
  // }, [uploading, uploadingValue]); // eslint-disable-line

  // Delete feature as soon as you unmount this component
  useEffect(() => {
    const EDITOR = editorRef?.current;
    return () => {
      if (EDITOR && drawingValue === null) {
        EDITOR.deleteFeatures(drawingValue);
      }
    };
  }, [editorRef?.current, setDrawingValue, drawingValue]); // eslint-disable-line

  return (
    <Editor
      ref={editorRef}
      clickRadius={12}
      mode={mode}
      features={drawingValue}
      featureStyle={featureStyle}
      editHandleStyle={editHandleStyle}
      editHandleShape="circle"
      keybindings={true}
      onUpdate={(s) => {
        const { data, editType } = s;
        const EDITION_TYPES = ["addFeature"];
        const UPDATE_TYPES = ["addFeature", "addPosition", "movePosition"];
        const dataToStorage = data;

        if (editType === "addTentativePosition" && !drawingValue) {
          // set the state to process when user starts drawing

          setDrawingStatus("progress");
        }

        if (EDITION_TYPES.includes(editType)) {
          setCurrent("editing");
          setDrawingValue(dataToStorage);
        }

        if (UPDATE_TYPES.includes(editType)) {
          setDrawingValue(dataToStorage);
        }

      }}
    />
  );
};

export default DrawingTool;
