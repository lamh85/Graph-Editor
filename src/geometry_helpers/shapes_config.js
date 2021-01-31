import { coordinatesToSvgPoints } from './general'
import { getDistance } from './get_distance'
import { buildEqualateral } from './special_triangles'

export const CIRCLE = {
  radius: 20
}

const ARROW_SIDE_LENGTH = 20

const radiansToDegrees = radians => {
  return radians / Math.PI * 180
}

export const buildCssRotation = ({
  radians,
  xPixelDirection,
  yPixelDirection
}) => {
  const angleDegrees = radiansToDegrees(radians)

  if (xPixelDirection === 1 && yPixelDirection === -1) {
    return (360 - angleDegrees)
  } else if (xPixelDirection === 1 && yPixelDirection === 1) {
    return angleDegrees
  } else if (xPixelDirection === -1 && yPixelDirection === 1) {
    return (180 - angleDegrees)
  } else if (xPixelDirection === -1 && yPixelDirection === -1) {
    return (180 + angleDegrees)
  }
}

export const getArrowProps = ({ towards, away }) => {
  const { x: towardsX, y: towardsY } = towards
  const { x: awayX, y: awayY } = away

  const hasMissingCoordinate = [towardsX, towardsY, awayX, awayY].some(item => {
    return item === undefined || item === null
  })

  if (hasMissingCoordinate) return null

  const distance = getDistance({ origin: towards, destination: away })
  if (!distance) return null

  const {
    xPixelDirection,
    yPixelDirection,
    arcAngle
  } = distance

  const triangleCoordinates = buildEqualateral({
    pivotPoint: towards,
    sideLength: ARROW_SIDE_LENGTH
  })

  if (!triangleCoordinates) return null

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
