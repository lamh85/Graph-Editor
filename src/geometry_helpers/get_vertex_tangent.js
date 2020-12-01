import { CIRCLE as CIRCLE_CONFIG } from './shapes_config'
import { getDistance } from './general'

// export const getVertexTangent = ({ vertex1, vertex2 }) => {
//   const {
//     height: sideAdjacent,
//     width: sideOpposite,
//     xPixelDirection,
//     yPixelDirection
//   } = getDistance({ vertex1, vertex2 })

//   const angle = Math.atan(sideOpposite / sideAdjacent)
//   const radiusYDelta = CIRCLE_CONFIG.radius * Math.cos(angle)
//   const radiusXDelta = CIRCLE_CONFIG.radius * Math.sin(angle)

//   const vertex1Tangent = {
//     x: vertex1.x + (xPixelDirection * radiusXDelta),
//     y: vertex1.y + (yPixelDirection * radiusYDelta)
//   }

//   const vertex2Tangent = {
//     x: vertex2.x + (-1 * xPixelDirection * radiusXDelta),
//     y: vertex2.y + (-1 * yPixelDirection * radiusYDelta)
//   }

//   return { vertex1Tangent, vertex2Tangent }
// }

export const getVertexTangent = ({ vertex1, vertex2 }) => {
  const {
    height: verticesHeight,
    width: verticesWidth,
    xPixelDirection,
    yPixelDirection
  } = getDistance({ origin: vertex1, destination: vertex2 })

  const slope = verticesHeight / verticesWidth
 
  const radiusSquared = CIRCLE_CONFIG.radius ** 2
  const radiusWidth = Math.sqrt( radiusSquared / (1 + slope ** 2) )
  const radiusHeight = radiusWidth * slope

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