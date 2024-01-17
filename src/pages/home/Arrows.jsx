import React from 'react'

import {
  getArrowProps,
  coordinatesToSvgPoints,
} from '../../component_helpers/arrows'

const Arrow = ({ towards, away }) => {
  const arrowProps = getArrowProps({ towards, away })

  if (arrowProps === null) {
    return null
  } else {
    const { svgPoints, cssRotation } = arrowProps
    const rotationOrigin = coordinatesToSvgPoints([towards])
    const transform = `rotate(${cssRotation}, ${rotationOrigin})`
    return (
      <polygon
        points={svgPoints}
        stroke="red"
        fill="yellow"
        transform={transform}
      />
    )
  }
}

const Arrows = ({ arrows, tangents }) => {
  if (!tangents?.length) return null

  return arrows.map((arrow) => {
    const { edgeId, endId } = arrow

    const towards = tangents.find((tangent) => {
      return tangent.endId === endId && tangent.edgeId === edgeId
    })?.coordinates

    if (!towards) return null

    const awayEndId = endId === 0 ? 1 : 0

    const away = tangents.find((tangent) => {
      return tangent.endId === awayEndId && tangent.edgeId === edgeId
    })?.coordinates

    if (!away) return null

    return <Arrow key={arrow.id} towards={towards} away={away} />
  })
}

export default Arrows
