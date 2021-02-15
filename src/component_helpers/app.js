import { getDistance, getCoordinateDifference } from '../geometry_helpers/get_distance'

const getRadiusDimensions = ({ circle, directionHeight, directionWidth }) => {
  let radiusWidth, radiusHeight

  if (directionWidth === 0) {
    radiusWidth = 0
    radiusHeight = circle.radius
  } else {
    const slope = directionHeight / directionWidth
    const radiusSquared = circle.radius ** 2
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
  origin,
  destination
}) => {
  if (origin.shape === 'circle') {
    return getCircleTangent({
      vertexOrigin: origin,
      vertexDestination: destination
    })
  } else if (origin.shape === 'rectangle') {
    return getRectangleTangent({
      ...origin,
      centre: origin,
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
  } = getDistance({
    origin: {
      x: vertexOrigin.centreX,
      y: vertexOrigin.centreY
    },
    destination: {
      x: vertexDestination.centreX,
      y: vertexDestination.centreY
    }
  })

  const {
    radiusWidth: originRadiusWidth,
    radiusHeight: originRadiusHeight
  } = getRadiusDimensions({
    circle: vertexOrigin,
    directionHeight: verticesHeight,
    directionWidth: verticesWidth
  })

  return {
    x: vertexOrigin.centreX + (xPixelDirection * originRadiusWidth),
    y: vertexOrigin.centreY + (yPixelDirection * originRadiusHeight)
  }
}

const getRectangleBoundaries = ({ centreX, centreY, height, width }) => {
  const halfHeight = height / 2
  const halfWidth = width / 2

  const top = centreY - halfHeight
  const left = centreX - halfWidth
  const right = centreX + halfWidth
  const bottom = centreY + halfHeight

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

export const getRectangleTangent = ({ width, height, centreX, centreY, externalPoint }) => {
  const externalDifference = getCoordinateDifference({
    origin: { centreX, centreY },
    destination: externalPoint
  })

  const boundaries = getRectangleBoundaries({
    centreX, centreY, height, width
  })

  if (externalDifference.x === 0) {
    return {
      x: centreX,
      y: externalDifference.y > 0
        ? boundaries.bottom
        : boundaries.top
    }
  } else if (externalDifference.y === 0) {
    return {
      x: externalDifference.x > 0
        ? boundaries.right
        : boundaries.left,
      y: centreY
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
    x: quadrant4Tangent.x + centreX,
    y: quadrant4Tangent.y + centreY
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

export const getRectangleCentre = ({ height, width, x, y }) => {
  return {
    x: x + width / 2,
    y: y + height / 2
  }
}

export const cursorToCanvasCoordinates = ({
  cursorX,
  cursorY
}) => {
  const { scrollTop, scrollLeft } = document.querySelector('html')

  return {
    x: cursorX + scrollLeft,
    y: cursorY + scrollTop
  }
}
