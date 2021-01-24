export const getSlope = (coordinates1, coordinates2) => {
  if (coordinates1.x === coordinates2.x) return Infinity
  if (coordinates1.y === coordinates2.y) return 0

  let leftCoordinates = coordinates1
  let rightCoordinates = coordinates2

  if (coordinates1.x > coordinates2.x) {
    leftCoordinates = coordinates2
    rightCoordinates = coordinates1
  }

  return (rightCoordinates.y - leftCoordinates.y)
    / (rightCoordinates.x - leftCoordinates.x)
}

export const getSlopeDimension = ({
  slope,
  height,
  width
}) => {
  // slope = height / width

  if (height) return slope * width
  if (width) return height / slope
}
