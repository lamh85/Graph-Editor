import React from 'react'
import { RADIUS_MINIMUM, DEFAULT_RECTANGLE } from '../../models/vertices'

export const Paintbrush = ({
  shapeSelected,
  x,
  y,
  isToolSelected,
  circlePaintbrush,
  rectanglePaintbrush,
}) => {
  if (!shapeSelected || !x || !y || !isToolSelected) return null

  if (shapeSelected === 'circle') {
    return <circle fill="blue" cx={x} cy={y} r={circlePaintbrush.radius} />
  }

  if (shapeSelected === 'rectangle') {
    const { height, width } = rectanglePaintbrush

    const left = x - width / 2
    const top = y - height / 2

    return <rect fill="blue" x={left} y={top} height={height} width={width} />
  }
}
