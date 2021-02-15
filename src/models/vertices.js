const DEFAULT_RADIUS = 40

export const DEFAULT_VERTICES = [
  { id: 1, centreX: 40, centreY: 40, radius: DEFAULT_RADIUS, shape: 'circle' },
  { id: 2, centreX: 200, centreY: 200, height: 50, width: 100, shape: 'rectangle' },
  { id: 3, centreX: 200, centreY: 400, radius: DEFAULT_RADIUS, shape: 'circle' }
]

// Maybe future plans: a strategy for each shape for finding the tangent point
export const VERTEX_SHAPES = [
  'triangle',
  'rectangle'
]

export const DEFAULT_CIRCLE = {
  id: 1, centreX: 40, centreY: 40, radius: DEFAULT_RADIUS, shape: 'circle'
}

export const DEFAULT_RECTANGLE = {
  id: 1, centreX: 40, centreY: 40, shape: 'rectangle', height: 50, width: 100
}
