import { TYPES as VERTEX_SHAPES } from './vertex_shapes'

export const DEFAULT_VERTICES = [
  { 
    id: 1,
    x: 40,
    y: 40,
    height: 100,
    width: 100,
    shape: VERTEX_SHAPES.rectangle
  },
  { 
    id: 2,
    x: 200,
    y: 40,
    height: 50,
    width: 100,
    shape: VERTEX_SHAPES.rectangle
  },
  { 
    id: 3,
    x: 200,
    y: 200,
    radius: 20,
    shape: VERTEX_SHAPES.circle
  }
]
