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