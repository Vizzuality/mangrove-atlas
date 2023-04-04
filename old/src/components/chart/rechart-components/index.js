import React from 'react';
import { isObject, isArray } from 'lodash';
import {
  CartesianGrid,
  CartesianAxis,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';

const rechartsComponentsMap = new Map([
  ['referenceAreas', ReferenceArea],
  ['referenceLines', ReferenceLine],
  ['cartesianGrid', CartesianGrid],
  ['cartesianAxis', CartesianAxis]
]);

// eslint-disable-next-line import/no-mutable-exports
export let stack = [];

export function clearStack() {
  stack = [];
}

export function addComponent(type, options) {
  if (!rechartsComponentsMap.has(type)) {
    return null;
  }

  const Component = rechartsComponentsMap.get(type);

  if (isArray(options)) {
    // eslint-disable-next-line react/no-array-index-key
    options.forEach((itemOptions, index) => stack.push(<Component key={`${type}-${index}`} {...itemOptions} />));
  } else if (isObject(options)) {
    stack.push(<Component key={`${type}`} {...options} />);
  }

  return null;
}
