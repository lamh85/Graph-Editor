import { getDistance, buildCssRotation } from './general'
import { buildEqualateral } from './special_triangles'

export const CIRCLE = {
  radius: 20
}

const ARROW_SIDE_LENGTH = 20

export const getArrowProps = ({ destination, origin }) => {
  const { x: destinationX, y: destinationY } = destination
  const { x: originX, y: originY } = origin

  const hasMissingCoordinate = [destinationX, destinationY, originX, originY].some(item => {
    return item === undefined || item === null
  })

  if (hasMissingCoordinate) return null

  const {
    xPixelDirection,
    yPixelDirection,
    arcAngle
  } = getDistance({ origin, destination })

  const triangleCoordinates = buildEqualateral({
    origin: destination,
    sideLength: ARROW_SIDE_LENGTH
  })

  const svgPoints = coordinatesToSvgPoints(
    Object.values(triangleCoordinates)
  )

  const cssRotation = buildCssRotation({
    radians: arcAngle,
    xPixelDirection,
    yPixelDirection
  })

  return { svgPoints, cssRotation }
}

const getPivotDirection = ({ xPixelDirection, yPixelDirection }) => {
  const isRightUp = xPixelDirection >= 0 && yPixelDirection <= 0
  const isLeftDown = xPixelDirection < 0 && yPixelDirection > 0

  // If right-up or left-down, then counter-clockwise
  if (isRightUp || isLeftDown) return -1

  return 1
}
