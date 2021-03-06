import React from "react"

import { getHypotenuseLength } from '../geometry_helpers/trigonometry'
import { vertexCircleProps } from '../helpers/dom'

export const CircleBuild = ({
  manualCircleCreator
}) => {
  const {
    selectedVertex,
    canvasClickOrigin,
    canvasCoordinates
  } = manualCircleCreator

  if (selectedVertex !== 'TEMPORARY_CIRCLE') return null

  const {
    x: x1,
    y: y1
  } = canvasClickOrigin || {}

  const {
    x: x2,
    y: y2
  } = canvasCoordinates || {}

  if (!x1 || !y1 || !x2 || !y2) return null

  const centreX = (x1 + x2) / 2
  const centreY = (y1 + y2) / 2

  const radius = getHypotenuseLength({
    adjacent: centreX - x1,
    opposite: centreY - y1
  })

  if (!radius) return null

  return (
    <circle
      {...vertexCircleProps({ centreX, centreY, radius })}
      fill="blue"
    />
  )
}
