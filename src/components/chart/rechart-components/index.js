import React from 'react';
import { isObject, isArray } from 'lodash';
import {
  CartesianGrid,
  CartesianAxis,
  ReferenceLine,
  ReferenceArea,
  Line
} from 'recharts';

const componentMap = new Map([
  ['referenceAreas', ReferenceArea],
  ['referenceLines', ReferenceLine],
  ['cartesianGrid', CartesianGrid],
  ['cartesianAxis', CartesianAxis]
]);

export default function getComponent(type, options, indexIt) {
  if (!componentMap.has(type)) {
    return null;
  }

  const Component = componentMap.get(type);

  if (isArray(options)) {
    return (
      <>
        { options.map((itemOptions, index) => (
          <Component key={`${type}-${index}`} {...itemOptions} />
        )) }
      </>
    );
  }

  if (isObject(options)) {
    console.log(options)
    return (<Component key={`${type}-${indexIt}`} {...options}></Component>);
  }
  
  return null;
};

/*
{cartesianGrid && (
  <CartesianGrid
    strokeDasharray="4 4"
    stroke="#d6d6d9"
    {...cartesianGrid}
  />
)}

{cartesianAxis && (
  <CartesianAxis
    {...cartesianAxis}
  />
)}

{referenceLines && referenceLines.map(ref => (
  <ReferenceLine
    key={new Date()}
    {...ref}
  />
))}

*/