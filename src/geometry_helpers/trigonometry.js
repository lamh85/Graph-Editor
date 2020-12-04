export const getSideLength = ({
  adjacent,
  opposite,
  hypotenuse,
  sideQuery,
  angle
}) => {
  if (!angle || !sideQuery) return null

  const sideLengthLookup = {
    adjacent: () => getAdjacentLength({ angle, opposite, hypotenuse }),
    opposite: () => getOppositeLength({ angle, adjacent, hypotenuse }),
    hypotenuse: () => getHypotenuseLength({ angle, adjacent, opposite })
  }

  return sideLengthLookup[sideQuery]()
}

const getAdjacentLength = ({
  angle,
  opposite,
  hypotenuse
}) => {
  if (!opposite && !hypotenuse) return null
  if (opposite) return opposite / Math.tan(angle)
  if (hypotenuse) return hypotenuse * Math.cos(angle)
}

const getOppositeLength = ({
  angle,
  adjacent,
  hypotenuse
}) => {
  if (!adjacent && !hypotenuse) return null
  if (hypotenuse) return hypotenuse * Math.sin(angle)
  if (adjacent) return adjacent * Math.tan(angle)
}

const getHypotenuseLength = ({
  angle,
  adjacent,
  opposite
}) => {
  if (!adjacent && !opposite) return null
  if (adjacent) return adjacent / Math.cos(angle)
  if (opposite) return opposite / Math.sin(angle)
}
