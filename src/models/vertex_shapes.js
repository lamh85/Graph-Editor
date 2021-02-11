// import * as shapeTypes from '../types/shapes'

// Maybe future plans: a strategy for each shape for finding the tangent point
export const TYPES = {
  circle: 'circle',
  rectangle: 'rectangle'
}

export const RECTANGLE_DEFAULT = {
  type: TYPES.rectangle,
  height: 100,
  width: 200
}

export const CIRCLE_DEFAULT = {
  type: TYPES.circle,
  radius: 20
}
