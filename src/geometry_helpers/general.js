import { canvasCoordinatesConversion } from '../helpers/dom'
import { getDistance } from '../geometry_helpers/get_distance'

export const radiansToDegrees = radians => {
  return radians / Math.PI * 180
}

export const quadrantAngleToFullAngle = ({ degrees, quadrant }) => {
  if (quadrant === 1) {
    return degrees
  } else if (quadrant === 2) {
    return 180 - degrees
  } else if (quadrant === 3) {
    return 180 + degrees
  } else if (quadrant === 4) {
    return 360 - degrees
  }
}

export const getResizeCircleCursor = ({
  vertexCentreX,
  vertexCentreY,
  cursorX,
  cursorY
}) => {
  const canvasCoordinates = canvasCoordinatesConversion({
    cursorX, cursorY
  })

  const coordinateDistance = getDistance({
    origin: { x: vertexCentreX, y: vertexCentreY },
    destination: canvasCoordinates
  })

  const degrees = radiansToDegrees(coordinateDistance.arcAngle)

  const fullDegrees = quadrantAngleToFullAngle({
    degrees,
    quadrant: coordinateDistance.quadrant
  })

  const directionLookup = [
    [22.5, 'right'],
    [67.5, 'upRight'],
    [112.5, 'up'],
    [157.5, 'upLeft'],
    [202.5, 'left'],
    [247.5, 'downLeft'],
    [292.5, 'down'],
    [337.5, 'downRight'],
    [360, 'right']
  ]

  let direction = null
  directionLookup.forEach((entry, index) => {
    if (direction) return

    let minimumDegrees = 0
    if (index > 0) {
      minimumDegrees = directionLookup[index - 1][0]
    }

    const maximumDegrees = entry[0]

    if (fullDegrees >= minimumDegrees && fullDegrees <= maximumDegrees) {
      direction = entry[1]
    }
  })

  if (['left', 'right'].includes(direction)) {
    return 'ew-resize'
  } else if (['upRight', 'downLeft'].includes(direction)) {
    return 'nesw-resize'
  } else if (['up', 'down'].includes(direction)) {
    return 'ns-resize'
  } else if (['upLeft', 'downRight'].includes(direction)) {
    return 'nwse-resize'
  }
}
