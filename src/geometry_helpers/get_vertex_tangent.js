import { CIRCLE as CIRCLE_CONFIG } from './shapes_config'
import { getDistance } from './general'

export const getVertexTangent = ({
  vertexOrigin,
  vertexDestination
}) => {
  const {
    height: verticesHeight,
    width: verticesWidth,
    xPixelDirection,
    yPixelDirection
  } = getDistance({ origin: vertexOrigin, destination: vertexDestination })

  let radiusWidth, radiusHeight
  if (verticesWidth === 0) {
    radiusWidth = 0
    radiusHeight = vertexDestination.radius
  } else {
    const slope = verticesHeight / verticesWidth
    const radiusSquared = vertexDestination.radius ** 2
    radiusWidth = Math.sqrt(radiusSquared / (1 + slope ** 2))
    radiusHeight = radiusWidth * slope
  }

  const tangentOrigin = {
    x: vertexOrigin.x + (xPixelDirection * radiusWidth),
    y: vertexOrigin.y + (yPixelDirection * radiusHeight),
    yPixelDirection
  }

  const tangentDestination = {
    x: vertexDestination.x + (-1 * xPixelDirection * radiusWidth),
    y: vertexDestination.y + (-1 * yPixelDirection * radiusHeight),
    yPixelDirection: (-1 * yPixelDirection)
  }

  return { tangentOrigin, tangentDestination }
}
