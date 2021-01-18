import { getSideLength } from './trigonometry'

export const getPixelDirection = ({ x1, x2, y1, y2 }) => {
  const xPixelDirection = x2 >= x1 ? 1 : -1
  // The Y values on a cartesian plane is the inverse of a computer screen
  const yPixelDirection = y2 >= y1 ? 1 : -1

  return { xPixelDirection, yPixelDirection }
}

export const getDistance = ({ origin, destination }) => {
  if (!origin && !destination) return null

  const { x: x1, y: y1 } = origin
  const { x: x2, y: y2 } = destination

  const hasMissingCoordinate = [x1, y1, x2, y2].some(item => {
    return item === undefined || item === null
  })

  if (hasMissingCoordinate) return null

  const height = Math.abs(y2 - y1)
  const width = Math.abs(x2 - x1)
  const { xPixelDirection, yPixelDirection } = getPixelDirection({ x1, x2, y1, y2 })

  const arcAngle = Math.atan(height/width)
  let arcDirection = 1
  const xyDirections = `${xPixelDirection}|${yPixelDirection}`
  if (['1|-1', '-1|1'].includes(xyDirections)) {
    arcDirection = -1
  }

  return { height, width, xPixelDirection, yPixelDirection, arcAngle, arcDirection }
}

export const getDestinationCoordinates = ({
  origin,
  distance,
  angle,
  xDirection,
  yDirection
}) => {
  const horizontalDistance = getSideLength({
    sideQuery: 'adjacent',
    hypotenuse: distance,
    angle,
  })

  const verticalDistance = getSideLength({
    sideQuery: 'opposite',
    hypotenuse: distance,
    angle
  })

  const x = origin.x + xDirection * horizontalDistance
  const y = origin.y + yDirection * verticalDistance

  return { x, y }
}

const coordinatesReducer = (accumulated, current) => {
  return {
    x: (accumulated.x + current.x),
    y: (accumulated.y + current.y)
  }
}

export const translateCoordinates = coordinatePairs => {
  if (!coordinatePairs) return null

  return coordinatePairs.reduce(
    coordinatesReducer,
    { x: 0, y: 0 }
  )
}

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

export const radiansToDegrees = radians => {
  return radians / Math.PI * 180
}