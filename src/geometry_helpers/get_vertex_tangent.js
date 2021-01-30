import { getDistance, getCoordinateDifference } from './get_distance'
import {
  getSlope,
  getSlopeDimension,
  compareSlope
} from './graphing'
import { capitalizeWord } from '../helpers/string'
import { getAngle, getAdjacentLength } from './trigonometry'

const getRadiusDimensions = ({ vertex, directionHeight, directionWidth }) => {
  let radiusWidth, radiusHeight

  if (directionWidth === 0) {
    radiusWidth = 0
    radiusHeight = vertex.radius
  } else {
    const slope = directionHeight / directionWidth
    const radiusSquared = vertex.radius ** 2
    radiusWidth = Math.sqrt(radiusSquared / (1 + slope ** 2))
    radiusHeight = radiusWidth * slope
  }

  return { radiusWidth, radiusHeight }
}

export const getVertexTangent = ({
  vertexOrigin,
  vertexDestination
}) => {
  if (!vertexOrigin || !vertexDestination) return null

  const {
    height: verticesHeight,
    width: verticesWidth,
    xPixelDirection,
    yPixelDirection
  } = getDistance({ origin: vertexOrigin, destination: vertexDestination })

  const {
    radiusWidth: originRadiusWidth,
    radiusHeight: originRadiusHeight
  } = getRadiusDimensions({
    vertex: vertexOrigin,
    directionHeight: verticesHeight,
    directionWidth: verticesWidth
  })

  const {
    radiusWidth: destinationRadiusWidth,
    radiusHeight: destinationRadiusHeight
  } = getRadiusDimensions({
    vertex: vertexDestination,
    directionHeight: verticesHeight,
    directionWidth: verticesWidth
  })

  const tangentOrigin = {
    x: vertexOrigin.x + (xPixelDirection * originRadiusWidth),
    y: vertexOrigin.y + (yPixelDirection * originRadiusHeight),
    yPixelDirection
  }

  const tangentDestination = {
    x: vertexDestination.x + (-1 * xPixelDirection * destinationRadiusWidth),
    y: vertexDestination.y + (-1 * yPixelDirection * destinationRadiusHeight),
    yPixelDirection: (-1 * yPixelDirection)
  }

  return { tangentOrigin, tangentDestination }
}

const getRectangleBoundaries = ({ centre, height, width }) => {
  const halfHeight = height / 2
  const halfWidth = width / 2

  const top = centre.y - halfHeight
  const left = centre.x - halfWidth
  const right = centre.x + halfWidth
  const bottom = centre.y + halfHeight

  const topLeft = { x: left, y: top }
  const topRight = { x: right, y: top }
  const bottomLeft = { x: left, y: bottom }
  const bottomRight = { x: right, y: bottom }

  return { top, left, right, bottom, topLeft, topRight, bottomLeft, bottomRight }
}

const getRectangleSideTangent = ({
  closestSide,
  width,
  height,
  centre,
  externalPoint
}) => {
  const slopeExternal = getSlope(centre, externalPoint)
  const boundaries = getRectangleBoundaries({
    centre, height, width
  })

  if (['top', 'bottom'].includes(closestSide)) {
    const xDistance = getSlopeDimension({
      slope: slopeExternal,
      height: height / 2
    })
    const x = centre.x + xDistance
    return { x, y: boundaries[closestSide] }
  } else if (closestSide === 'left') {
    const yDistance = getSlopeDimension({
      slope: slopeExternal,
      width: width / 2
    })
    const y = centre.y + yDistance
    return { x: boundaries[closestSide], y }
  }
}

const getRectangleClosestSide = ({
  querySlope,
  benchMarkSlope,
  horizontalSide,
  verticalSide
}) => {
  const comparisonResult = compareSlope({
    querySlope,
    benchMarkSlope
  })

  if (comparisonResult === 0) return horizontalSide + capitalizeWord(verticalSide)
  return comparisonResult === 1 ? horizontalSide : verticalSide
}

const getQuadrant4Tangent = ({ externalPoint, height, width }) => {
  const diagonalSlope = height / width
  const externalSlope = externalPoint.y / externalPoint.x

  if (externalSlope === diagonalSlope) {
    return { height, width }
  } else if (externalSlope > diagonalSlope) {
    return {
      x: height / externalSlope,
      y: height
    }
  } else {
    return {
      x: width,
      y: width * externalSlope
    }
  }
}

export const getRectangleTangent = ({ width, height, centre, externalPoint }) => {
  const externalDifference = getCoordinateDifference({
    origin: centre,
    destination: externalPoint
  })

  const boundaries = getRectangleBoundaries({
    centre, height, width
  })

  if (externalDifference.x === 0) {
    return {
      x: centre.x,
      y: externalDifference.y > 0
        ? boundaries.bottom
        : boundaries.top
    }
  } else if (externalDifference.y === 0) {
    return {
      x: externalDifference.x > 0
        ? boundaries.right
        : boundaries.left
    }
  }

  const halfWidth = width / 2
  const halfHeight = height / 2

  const quadrantTangent = getQuadrant4Tangent({
    height: halfHeight,
    width: halfWidth,
    externalPoint: {
      x: Math.abs(externalDifference.x),
      y: Math.abs(externalDifference.y)
    }
  })

  const translatedTangent = {
    x: quadrantTangent.x + centre.x,
    y: quadrantTangent.y + centre.y
  }

  return {
    x: externalDifference.x < 0
      ? translatedTangent.x - 2 * quadrantTangent.x
      : translatedTangent.x,
    y: externalDifference.y < 0
      ? translatedTangent.y - 2 * quadrantTangent.y
      : translatedTangent.y
  }
}
