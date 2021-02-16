import { canvasCoordinatesConversion } from '../helpers/dom'
import { getDistance } from '../geometry_helpers/get_distance'
import {
  radiansToDegrees,
  quadrantAngleToFullAngle
} from '../geometry_helpers/general'

export const getConnectedVertices = (vertexId, edges) => {
  const vertexEdges = edges.filter(edge => {
    return edge.end0.vertexId === vertexId || edge.end1.vertexId === vertexId
  })

  const connectedVertices = []
  vertexEdges.forEach(edge => {
    const { end0, end1 } = edge

    if (end0.vertexId === vertexId) {
      connectedVertices.push(end1.vertexId)
    }
    
    if (end1.vertexId === vertexId) {
      connectedVertices.push(end0.vertexId)
    }
  })

  return connectedVertices
}

export const getUnconnectedVertices = ({ vertexId, vertices, edges }) => {
  const connectedVertices = getConnectedVertices(vertexId, edges)

  const allVertexIds = vertices.map(vertex => vertex.id)
  return allVertexIds.filter(id => {
    return !connectedVertices.includes(id) && id !== vertexId
  })
}

export const vertexCircleProps = vertex => {
  const { centreX, centreY, radius } = vertex

  return { cx: centreX, cy: centreY, r: radius }
}

export const vertexRectangleProps = vertex => {
  const { centreX, centreY, height, width } = vertex

  const left = centreX - width / 2
  const top = centreY - height / 2

  return { x: left, y: top, height, width }
}

export const getResizeCircleCursor = ({
  vertexCentreX,
  vertexCentreY,
  cursorX,
  cursorY
}) => {
  const canvasCoordinates = canvasCoordinatesConversion({
    cursorX, cursorY
  })

  const coordinateDistance = getDistance({
    origin: { x: vertexCentreX, y: vertexCentreY },
    destination: canvasCoordinates
  })

  const degrees = radiansToDegrees(coordinateDistance.arcAngle)

  const fullDegrees = quadrantAngleToFullAngle({
    degrees,
    quadrant: coordinateDistance.quadrant
  })

  const directionLookup = [
    [22.5, 'right'],
    [67.5, 'upRight'],
    [112.5, 'up'],
    [157.5, 'upLeft'],
    [202.5, 'left'],
    [247.5, 'downLeft'],
    [292.5, 'down'],
    [337.5, 'downRight'],
    [360, 'right']
  ]

  let direction = null
  directionLookup.forEach((entry, index) => {
    if (direction) return

    let minimumDegrees = 0
    if (index > 0) {
      minimumDegrees = directionLookup[index - 1][0]
    }

    const maximumDegrees = entry[0]

    if (fullDegrees >= minimumDegrees && fullDegrees <= maximumDegrees) {
      direction = entry[1]
    }
  })

  if (['left', 'right'].includes(direction)) {
    return 'ew-resize'
  } else if (['upRight', 'downLeft'].includes(direction)) {
    return 'nesw-resize'
  } else if (['up', 'down'].includes(direction)) {
    return 'ns-resize'
  } else if (['upLeft', 'downRight'].includes(direction)) {
    return 'nwse-resize'
  }
}
