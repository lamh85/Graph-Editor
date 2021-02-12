import { Circle } from '../types/shapes'
import { Circle, Rectangle } from '../types/shapes.ts'

// Maybe future plans: a strategy for each shape for finding the tangent point
export const NAMES = {
  circle: 'circle',
  rectangle: 'rectangle'
}

export const RECTANGLE_DEFAULT = {
  type: NAMES.rectangle,
  height: 100,
  width: 200
}

export const CIRCLE_DEFAULT: Circle = {
  type: NAMES.circle,
  radius: 20
}
