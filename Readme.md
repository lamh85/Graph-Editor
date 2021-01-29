# Levels of data (from high to low)

Transformations. EG:
* rotate
* skew

SVG coordinates

Interfaces with geometry principles. EG:
* A function that outputs special triangles

Geometry principles. EG:
* Special triangles
* Trigonometry formulas

# Old ideas

Get the rectangle's closest point, from the perspective of an external point

```javascript
export const getRectangleTangent = ({ width, height, centre, externalPoint }) => {
  const boundaries = getRectangleBoundaries({
    centre, height, width
  })

  const SLOPE = {
    rectangle: {
      topLeft: getSlope(centre, boundaries.topLeft),
      topRight: getSlope(centre, boundaries.topRight),
      bottomLeft: getSlope(centre, boundaries.bottomLeft),
      bottomRight: getSlope(centre, boundaries.bottomRight)
    },
    externalPoint: getSlope(centre, externalPoint)
  }

  const { x: externalX, y: externalY } = externalPoint
  const { x: centreX, y: centreY } = centre

  const closestVertical = externalX > centreX ? 'right' : 'left'
  const closestHorizontal = externalY > centreY ? 'bottom' : 'top'

  const diagonalSlopeDirection = closestHorizontal + capitalizeWord(closestVertical)

  const closestSide = getRectangleClosestSide({
    benchMarkSlope: SLOPE.rectangle[diagonalSlopeDirection],
    querySlope: SLOPE.externalPoint,
    horizontalSide: closestHorizontal,
    verticalSide: closestVertical
  })

  if (['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(closestSide)) {
    return boundaries[closestSide]
  }

  if (['top', 'bottom'].includes(closestSide)) {
    const xDifference = getSlopeDimension({
      slope: Math.abs(SLOPE.externalPoint),
      height: height / 2
    })

    const x = SLOPE.externalPoint > 1
      ? centreX - xDifference
      : centreX + xDifference

    return {
      y: boundaries[closestSide],
      x
    }
  } else if (['left', 'right'].includes(closestSide)) {
    yDifference = getSlopeDimension({
      slope: Math.abs(SLOPE.externalPoint),
      width: width / 2
    })

    const y = SLOPE.externalPoint > 1
      ? centreY + yDifference
      : centreY - yDifference

    return {
      x: boundaries[closestSide],
      y
    }
  }
}

```