import { getDistance } from './get_distance'
import { getSlope, getSlopeDimension } from './graphing'

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

export const getRectangleTangent = ({ width, height, centre, externalPoint }) => {
  const boundaries = getRectangleBoundaries({
    centre, height, width
  })

  const externalYDistance = centre.y - externalPoint.y

  const diagonalSlope = getSlope(centre, boundaries.topRight)

  const diagonalRightX = getSlopeDimension({
    height: externalYDistance,
    slope: diagonalSlope
  })

  const diagonalTopRightXDistance = diagonalRightX - centre.x
  const diagonalLeftX = centre.x - diagonalTopRightXDistance

  let closestSide = 'left'
  if (externalPoint.x === diagonalLeftX) {
    closestSide = 'topLeft'
  } else if (
    externalPoint.x > diagonalLeftX && externalPoint.x < diagonalRightX
  ) {
    closestSide = 'top'
  } else if (externalPoint.x === diagonalRightX) {
    closestSide = 'topRight'
  } else if (externalPoint.x > diagonalRightX) {
    closestSide = 'right'
  }

  if (externalPoint.y > centre.y && closestSide.includes('top')) {
    closestSide = closestSide.replace('top', 'bottom')
  }

  const cornerNames = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']
  if (cornerNames.includes(closestSide)) {
    return boundaries[closestSide]
  } else {
    return getRectangleSideTangent({
      closestSide,
      width,
      height,
      centre,
      externalPoint
    })
  }
}
