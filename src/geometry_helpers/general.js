export const coordinatesToSvgPoints = (coordinates = []) => {
  if (coordinates.length === 0) return null

  let svgPoints = ''

  coordinates.forEach(pair => {
    const { x, y } = pair
    svgPoints = `${svgPoints} ${x},${y}`
  })

  return svgPoints.trim()
}