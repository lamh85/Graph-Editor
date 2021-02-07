export const DEFAULT_VERTICES = [
  { id: 1, x: 40, y: 40, radius: 20 },
  { id: 2, x: 200, y: 40, radius: 20 },
  { id: 3, x: 200, y: 200, radius: 20 }
]

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
