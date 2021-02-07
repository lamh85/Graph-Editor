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

export const getHypotenuseLength = ({
  angle,
  adjacent,
  opposite
}) => {
  if (!adjacent && !opposite) return null

  if (adjacent && opposite) {
    return (adjacent ** 2 + opposite ** 2) ** 0.5
  }

  if (adjacent) return adjacent / Math.cos(angle)
  if (opposite) return opposite / Math.sin(angle)
}

export const getAngle = ({
  adjacent,
  opposite,
  hypotenuse
}) => {
  if (adjacent && opposite) return Math.atan(opposite/adjacent)
  if (adjacent && hypotenuse) return Math.acos(adjacent/hypotenuse)
  if (opposite && hypotenuse) return Math.asin(opposite/hypotenuse)

  return null
}

export const getSubTriangle = ({
  fullHeight,
  fullWidth,
  subHeight,
  subWidth,
  subRadius
}) => {
  const slope = fullHeight / fullWidth

  if (subHeight) {
    return subHeight / slope
  } else if (subWidth) {
    return subWidth * slope
  } else if (subRadius) {
    const subRadiusSquared = subRadius ** 2
    const width = Math.sqrt(subRadiusSquared / (1 + slope ** 2))
    const height = width * slope

    return { width, height }
  }
}
