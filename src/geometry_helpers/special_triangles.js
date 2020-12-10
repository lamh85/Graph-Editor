// import { translateCoordinates } from './general'

// One side will be completely vertical, and on the right side
export const buildEqualateral = ({ pivotPoint, sideLength }) => {
  if (!pivotPoint.x || !pivotPoint.y || !sideLength) return null

  const rightX = pivotPoint.x + sideLength * Math.sqrt(3) / 2
  const topY = pivotPoint.y - sideLength / 2
  const bottomY = pivotPoint.y + sideLength /2

  return {
    top: { x: rightX, y: topY },
    left: pivotPoint,
    bottom: { x: rightX, y: bottomY }
  }
}
