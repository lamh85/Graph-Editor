import { getDistance } from '../geometry_helpers/get_distance'
import { radiansToDegrees } from '../geometry_helpers/general'

const ARROW_SIDE_LENGTH = 20

export const coordinatesToSvgPoints = (coordinates = []) => {
  if (coordinates.length === 0) return null

  let svgPoints = ''

  coordinates.forEach(pair => {
    const { x, y } = pair
    svgPoints = `${svgPoints} ${x},${y}`
  })

  return svgPoints.trim()
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

export const buildEqualateral = ({ pivotPoint, sideLength }) => {
  if (!pivotPoint.x || !pivotPoint.y || !sideLength) return null

  const rightX = pivotPoint.x + sideLength * Math.sqrt(3) / 2
  const topY = pivotPoint.y - sideLength / 2
  const bottomY = pivotPoint.y + sideLength / 2

  return {
    top: { x: rightX, y: topY },
    left: pivotPoint,
    bottom: { x: rightX, y: bottomY }
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
