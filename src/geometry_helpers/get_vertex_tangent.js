import { CIRCLE as CIRCLE_CONFIG } from './shapes_config'
import { getDistance } from './general'

export const getVertexTangent = ({ vertex1, vertex2 }) => {
  const {
    height: verticesHeight,
    width: verticesWidth,
    xPixelDirection,
    yPixelDirection
  } = getDistance({ origin: vertex1, destination: vertex2 })

  let radiusWidth, radiusHeight
  if (verticesWidth === 0) {
    radiusWidth = 0
    radiusHeight = CIRCLE_CONFIG.radius
  } else {
    const slope = verticesHeight / verticesWidth
    const radiusSquared = CIRCLE_CONFIG.radius ** 2
    radiusWidth = Math.sqrt(radiusSquared / (1 + slope ** 2))
    radiusHeight = radiusWidth * slope
  }

  const vertex1Tangent = {
    x: vertex1.x + (xPixelDirection * radiusWidth),
    y: vertex1.y + (yPixelDirection * radiusHeight),
    yPixelDirection
  }

  const vertex2Tangent = {
    x: vertex2.x + (-1 * xPixelDirection * radiusWidth),
    y: vertex2.y + (-1 * yPixelDirection * radiusHeight),
    yPixelDirection: (-1 * yPixelDirection)
  }

  return { vertex1Tangent, vertex2Tangent }
}
