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
