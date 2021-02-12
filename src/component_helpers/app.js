import { getDistance, getCoordinateDifference } from '../geometry_helpers/get_distance'

const getRadiusDimensions = ({ vertex, directionHeight, directionWidth }) => {
  let radiusWidth, radiusHeight

  if (directionWidth === 0) {
    radiusWidth = 0
    radiusHeight = vertex.radius
  } else {
    const slope = directionHeight / directionWidth
    const radiusSquared = vertex.radius ** 2
    // Original Pythagorean theorem:
      // r squared = x squared + y squared
    // Use slope to reduce the number of variables:
      // r squared = x squared + (slope * x) squared
    radiusWidth = Math.sqrt(radiusSquared / (1 + slope ** 2))
    radiusHeight = radiusWidth * slope
  }

  return { radiusWidth, radiusHeight }
}

export const getShapeTangent = ({
  originVertex,
  destination
}) => {
  if (originVertex.shape === 'circle') {
    return getCircleTangent({
      vertexOrigin: originVertex,
      vertexDestination: destination
    })
  } else {
    return getRectangleTangent({
      ...originVertex,
      centre: originVertex,
      externalPoint: destination
    })
  }
}

export const getCircleTangent = ({
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

  return {
    x: vertexOrigin.x + (xPixelDirection * originRadiusWidth),
    y: vertexOrigin.y + (yPixelDirection * originRadiusHeight)
  }
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

const getQuadrant4Tangent = ({ externalPoint, height, width }) => {
  const diagonalSlope = height / width
  const externalSlope = externalPoint.y / externalPoint.x

  if (externalSlope === diagonalSlope) {
    return { x: width, y: height }
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

  const quadrant4Tangent = getQuadrant4Tangent({
    height: halfHeight,
    width: halfWidth,
    externalPoint: {
      x: Math.abs(externalDifference.x),
      y: Math.abs(externalDifference.y)
    }
  })

  const translatedTangent = {
    x: quadrant4Tangent.x + centre.x,
    y: quadrant4Tangent.y + centre.y
  }

  return {
    x: externalDifference.x < 0
      ? translatedTangent.x - 2 * quadrant4Tangent.x
      : translatedTangent.x,
    y: externalDifference.y < 0
      ? translatedTangent.y - 2 * quadrant4Tangent.y
      : translatedTangent.y
  }
}

const getLineage = element => {
  const lineage = []
  let cursor = element

  while (lineage.slice(-1)[0] !== null) {
    const newCursor = cursor.parentElement
    lineage.push(newCursor)
    cursor = newCursor
  }

  return lineage
}

export const doShareLineage = (youngest, ancestorTested) => {
  const lineage = getLineage(youngest)
  return lineage.includes(ancestorTested)
}
