import React from 'react'
import {
  RADIUS_MINIMUM,
  DEFAULT_RECTANGLE
} from '../models/vertices'

export const Paintbrush = ({
  shapeSelected,
  x,
  y,
  isToolSelected,
  circlePaintbrush,
  rectanglePaintbrush
}) => {
  if (!shapeSelected || !x || !y || !isToolSelected) return null

  if (shapeSelected === 'circle') {
    return (
      <circle fill="blue" cx={x} cy={y} r={circlePaintbrush.radius} />
    )
  }

  if (shapeSelected === 'rectangle') {
    const { height, width } = rectanglePaintbrush

    return (
      <rect
        fill="blue"
        x={x}
        y={y}
        height={height}
        width={width}
      />
    )
  }
}
