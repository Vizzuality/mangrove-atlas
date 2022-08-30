// import { RENDER_STATE, SHAPE } from './constants';

import { RENDER_STATE, SHAPE } from 'react-map-gl-draw';

// #00857F
const RECT_STYLE = {
  stroke: 'blue',
  strokeWidth: 1,
  x: -6,
  y: -6,
  height: 12,
  width: 12,
};

const CIRCLE_STYLE = {
  r: 6,
  strokeWidth: 2,
  fillOpacity: 1,
  fill: 'white',
  stroke: '#00857F',
};

const SELECTED_STYLE = {
  stroke: '#00857F',
  strokeWidth: 3,
  fill: '#00857F',
  fillOpacity: 0.3,
};

const HOVERED_STYLE = {
  stroke: '#00857F',
  strokeWidth: 3,
  fill: '#00857F',
  fillOpacity: 0.3,
};

const UNCOMMITTED_STYLE = {
  stroke: '#00857F',
  strokeWidth: 3,
  fill: '#00857F',
  fillOpacity: 0.01,
}; // closed polygon

const INACTIVE_STYLE = UNCOMMITTED_STYLE;

const DEFAULT_STYLE = {
  stroke: '#000000',
  strokeWidth: 3,
  fill: '#a9a9a9',
  fillOpacity: 0.1,
};

export function featureStyle({ feature, state }) {
  const type = feature.properties.shape || feature.geometry.type;
  let style = null;

  switch (state) {
    case RENDER_STATE.SELECTED:
      style = { ...SELECTED_STYLE };
      break;

    case RENDER_STATE.HOVERED:
      style = { ...HOVERED_STYLE };
      break;

    case RENDER_STATE.UNCOMMITTED:
    case RENDER_STATE.CLOSING:
      style = { ...UNCOMMITTED_STYLE };
      break;

    case RENDER_STATE.INACTIVE:
      style = { ...INACTIVE_STYLE };
      break;

    default:
      style = { ...DEFAULT_STYLE };
  }

  switch (type) {
    case SHAPE.POINT:
      style = { ...style, ...CIRCLE_STYLE };
      break;
    case SHAPE.LINE_STRING:
      style.fill = 'none';
      break;
    case SHAPE.POLYGON:
      if (state === RENDER_STATE.CLOSING) {
        style.strokeDasharray = '4,2';
      }

      break;
    case SHAPE.RECTANGLE:
      if (state === RENDER_STATE.UNCOMMITTED) {
        style.strokeDasharray = '4,2';
      }

      break;
    default:
  }

  return style;
}

export function editHandleStyle({ shape, state }) {
  let style = {};
  switch (state) {
    case RENDER_STATE.SELECTED:
      style = { ...SELECTED_STYLE };
      break;

    case RENDER_STATE.HOVERED:
      style = { ...HOVERED_STYLE };
      break;

    case RENDER_STATE.UNCOMMITTED:
    case RENDER_STATE.CLOSING:
      style = { ...UNCOMMITTED_STYLE };
      break;

    case RENDER_STATE.INACTIVE:
      style = { ...INACTIVE_STYLE };
      break;

    default:
      style = { ...DEFAULT_STYLE };
  }
  switch (shape) {
    case 'circle':
      style = { ...style, ...CIRCLE_STYLE };
      break;
    case 'rect':
      style = { ...style, ...RECT_STYLE };
      break;
    default:
  }

  return style;
}