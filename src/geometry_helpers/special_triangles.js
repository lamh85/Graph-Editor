// import { translateCoordinates } from './general'

// One side will be completely vertical, and on the right side
export const buildEqualateral = ({ origin, sideLength }) => {
  if (!origin.x || !origin.y || !sideLength) return null

  const rightX = origin.x + sideLength * Math.sqrt(3) / 2
  const topY = origin.y - sideLength / 2
  const bottomY = origin.y + sideLength /2

  return {
    top: { x: rightX, y: topY },
    left: origin,
    bottom: { x: rightX, y: bottomY }
  }
}
