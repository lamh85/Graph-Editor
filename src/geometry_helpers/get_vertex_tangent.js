import { CIRCLE as CIRCLE_CONFIG } from './shapes_config'

export const getDistance = ({ vertex1, vertex2 }) => {
  const { x: x1, y: y1 } = vertex1
  const { x: x2, y: y2 } = vertex2

  const hasMissingCoordinate = [x1, y1, x2, y2].some(item => {
    return item === undefined || item === null
  })

  if (hasMissingCoordinate) return null

  const height = Math.abs(y2 - y1)
  const width = Math.abs(x2 - x1)
  const xDirection = x2 >= x1 ? 1 : -1
  // The Y values on a cartesian plane is the inverse of a computer screen
  const yPixelDirection = y2 >= y1 ? 1 : -1

  return { height, width, xDirection, yPixelDirection }
}

const getPivotDirection = ({ xDirection, yPixelDirection }) => {
  const isRightUp = xDirection >= 0 && yPixelDirection <= 0
  const isLeftDown = xDirection < 0 && yPixelDirection > 0

  // If right-up or left-down, then counter-clockwise
  if ( isRightUp || isLeftDown ) return -1

  return 1
}

// export const getVertexTangent = ({ vertex1, vertex2 }) => {
//   const {
//     height: sideAdjacent,
//     width: sideOpposite,
//     xDirection,
//     yPixelDirection
//   } = getDistance({ vertex1, vertex2 })

//   const angle = Math.atan(sideOpposite / sideAdjacent)
//   const radiusYDelta = CIRCLE_CONFIG.radius * Math.cos(angle)
//   const radiusXDelta = CIRCLE_CONFIG.radius * Math.sin(angle)

//   const vertex1Tangent = {
//     x: vertex1.x + (xDirection * radiusXDelta),
//     y: vertex1.y + (yPixelDirection * radiusYDelta)
//   }

//   const vertex2Tangent = {
//     x: vertex2.x + (-1 * xDirection * radiusXDelta),
//     y: vertex2.y + (-1 * yPixelDirection * radiusYDelta)
//   }

//   return { vertex1Tangent, vertex2Tangent }
// }

export const getVertexTangent = ({ vertex1, vertex2 }) => {
  const {
    height: verticesHeight,
    width: verticesWidth,
    xDirection,
    yPixelDirection
  } = getDistance({ vertex1, vertex2 })

  const slope = verticesHeight / verticesWidth

  const radiusSquared = CIRCLE_CONFIG.radius ** 2
  const radiusWidth = Math.sqrt( radiusSquared / (1 + slope ** 2) )
  const radiusHeight = radiusWidth * slope

  const vertex1Tangent = {
    x: vertex1.x + (xDirection * radiusWidth),
    y: vertex1.y + (yPixelDirection * radiusHeight),
    yPixelDirection
  }

  const vertex2Tangent = {
    x: vertex2.x + (-1 * xDirection * radiusWidth),
    y: vertex2.y + (-1 * yPixelDirection * radiusHeight),
    yPixelDirection
  }

  return { vertex1Tangent, vertex2Tangent }
}