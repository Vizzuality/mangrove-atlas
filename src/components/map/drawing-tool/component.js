import React, {
    useEffect, useMemo, useRef,
  } from 'react';
  
  import {
    Editor,
    EditingMode,
    DrawPolygonMode,
  } from 'react-map-gl-draw';
      
  import { featureStyle, editHandleStyle } from './styles';
  
  export const DrawingTool  = ({ setCurrent, current, setDrawingValue, drawingValue }) => {
    const editorRef = useRef(null);
  
    const mode = useMemo(() => {
      if (current === 'editing') return new EditingMode();
      if (current === 'drawPolygon') return new DrawPolygonMode();
  
      return null;
    }, [current]);
  
    useEffect(() => {
      const EDITOR = editorRef?.current;
  
      if ((!current) && !!EDITOR) {
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
        if (EDITOR) {
          EDITOR.deleteFeatures(drawingValue);
          setDrawingValue(null);
        //   dispatch(setUploadingValue(null));
        }
      };
    }, [editorRef?.current, setDrawingValue]); // eslint-disable-line

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
          const EDITION_TYPES = ['addFeature'];
          const UPDATE_TYPES = ['addFeature', 'addPosition', 'movePosition'];
  
          if (EDITION_TYPES.includes(editType)) {
            setCurrent('editing');
            setDrawingValue(data);
          }
  
          if (UPDATE_TYPES.includes(editType)) {
            setDrawingValue(data);
          }
        }}
      />
    );
  };
  
  export default DrawingTool;