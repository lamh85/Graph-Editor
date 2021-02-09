export const VERTEX_TEMPLATE = { x: 20, y: 20, radius: 20 }

export const ARROW_TYPES = {
  TRIANGLE: 'triangle'
}

export const DEFAULT_ARROWS = [
  {
    id: 1,
    edgeId: 1,
    endId: 0,
    shape: ARROW_TYPES.TRIANGLE
  },
  {
    id: 2,
    edgeId: 2,
    endId: 1,
    shape: ARROW_TYPES.TRIANGLE
  },
  {
    id: 3,
    edgeId: 3,
    endId: 0,
    shape: ARROW_TYPES.TRIANGLE
  }
]

export const ARROW_TEMPLATE = {
  edgeId: 1,
  endId: 0,
  shape: ARROW_TYPES.TRIANGLE
}
