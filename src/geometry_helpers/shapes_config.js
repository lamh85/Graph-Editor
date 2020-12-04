import { getDistance } from './general'

export const CIRCLE = {
  radius: 20
}

export const getArrowProps = ({ destination, origin }) => {
  const { x: destinationX, y: destinationY } = destination
  const { x: originX, y: originY } = origin

  const hasMissingCoordinate = [destinationX, destinationY, originX, originY].some(item => {
    return item === undefined || item === null
  })

  if (hasMissingCoordinate) return null

  const {
    arcAngle,
    arcDirection
  } = getDistance({ origin, destination })

  console.log('arc ===============')
  console.log(arcAngle)
  console.log(arcDirection)
}

const getPivotDirection = ({ xPixelDirection, yPixelDirection }) => {
  const isRightUp = xPixelDirection >= 0 && yPixelDirection <= 0
  const isLeftDown = xPixelDirection < 0 && yPixelDirection > 0

  // If right-up or left-down, then counter-clockwise
  if (isRightUp || isLeftDown) return -1

  return 1
}
