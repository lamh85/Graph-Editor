import {
  DEFAULT_RECTANGLE,
  DEFAULT_CIRCLE
} from '../models/vertices'

export const getVertexBuilds = ({
  clickCoordinates,
  currentCoordinates
}) => {
  const hasCoordinates =
    clickCoordinates?.x &&
    clickCoordinates?.y &&
    currentCoordinates?.x &&
    currentCoordinates?.y

  const buildRectangleVariableSized = () => {
    if (!hasCoordinates) return null

    const left = Math.min(clickCoordinates.x, currentCoordinates.x)
    const top = Math.min(clickCoordinates.y, currentCoordinates.y)
    const height = Math.abs(currentCoordinates.y - clickCoordinates.y)
    const width = Math.abs(currentCoordinates.x - clickCoordinates.x)

    return { left, top, height, width }
  }

  const buildCircleVariableSized = () => {
    if (!hasCoordinates) return null

    const { x: x1, y: y1 } = clickCoordinates || {}
    const { x: x2, y: y2 } = currentCoordinates || {}

    if (!x1 || !y1 || !x2 || !y2) return null

    const centreX = (x1 + x2) / 2
    const centreY = (y1 + y2) / 2

    const radius = getHypotenuseLength({
      adjacent: centreX - x1,
      opposite: centreY - y1
    })

    if (!radius) return null

    return {
      centreX,
      centreY,
      radius,
      cx: centreX,
      cy: centreY,
      r: radius
    }
  }

  const circlePaintbrush = {
    ...DEFAULT_CIRCLE,
    centreX: currentCoordinates?.x,
    centreY: currentCoordinates?.y
  }

  const rectanglePaintbrush = {
    ...DEFAULT_RECTANGLE,
    centreX: currentCoordinates?.x,
    centreY: currentCoordinates?.y
  }

  return {
    rectangleVariableSized: buildRectangleVariableSized(),
    circleVariableSized: buildCircleVariableSized(),
    circlePaintbrush,
    rectanglePaintbrush
  }
}
