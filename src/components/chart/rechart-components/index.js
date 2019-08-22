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
    options.forEach((itemOptions, index) => stack.push(<Component key={`${type}-${index}`} {...itemOptions} />))
  } else if (isObject(options)) {
    stack.push(<Component key={`${type}`} {...options}></Component>);
  }
  
  return null;
};