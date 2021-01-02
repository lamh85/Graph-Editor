import React from "react"

import { getArrowProps } from '../geometry_helpers/shapes_config'
import { coordinatesToSvgPoints } from '../geometry_helpers/general'
import { getVertexTangent } from '../geometry_helpers/get_vertex_tangent'

const Arrow = ({ towardsVertex, awayVertex }) => {
  const { tangentOrigin, tangentDestination } = getVertexTangent({
    vertexOrigin: towardsVertex,
    vertexDestination: awayVertex
  })

  const arrowProps = getArrowProps({
    towards: tangentOrigin,
    away: tangentDestination
  })

  if (arrowProps === null) {
    return null
  } else {
    const { svgPoints, cssRotation } = arrowProps
    const rotationOrigin = coordinatesToSvgPoints([tangentOrigin])
    const transform = `rotate(${cssRotation}, ${rotationOrigin})`
    return <polygon points={svgPoints} stroke="red" fill="yellow" transform={transform} />
  }
}

const Arrows = ({ arrows, edges, vertices }) => {
  return arrows.map((arrow, index) => {
    const edge = edges.find(edge => edge.id === arrow.edgeId)
    if (!edge) return null

    const endKey = `end${arrow.endId}`
    const towardsVertexId = edge[endKey].vertexId
    const towardsVertex = vertices.find(vertex => vertex.id === towardsVertexId)

    const awayEndId = arrow.endId === 0 ? 1 : 0
    const awayEndKey = `end${awayEndId}`
    const awayVertexId = edge[awayEndKey].vertexId
    const awayVertex = vertices.find(vertex => vertex.id === awayVertexId)

    return (
      <Arrow
        key={index}
        towardsVertex={towardsVertex}
        awayVertex={awayVertex}
      />
    )
  })
}

export default Arrows
