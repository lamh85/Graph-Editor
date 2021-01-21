import { CIRCLE as CIRCLE_CONFIG } from './shapes_config'
import { getDistance } from './general'

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
