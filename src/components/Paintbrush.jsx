import React from 'react'
import { RADIUS_MINIMUM } from '../models/vertices'

export const Paintbrush = ({
  shape,
  x,
  y
}) => {
  if (!shape || !x || !y) return null

  if (shape === 'circle') {
    return (
      <circle fill="blue" cx={x} cy={y} r={RADIUS_MINIMUM} />
    )
  }

  if (shape === 'rectangle') {
    const { height, width } = DEFAULT_RECTANGLE

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
