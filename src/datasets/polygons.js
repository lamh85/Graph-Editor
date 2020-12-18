export const DEFAULT_EDGES = [
  {
    id: 1,
    end0: {
      vertexId: 1,
      arrowType: 'triangle'
    },
    end1: {
      vertexId: 2,
      arrowType: null
    }
  },
  {
    id: 2,
    end0: {
      vertexId: 2,
      arrowType: 'triangle'
    },
    end1: {
      vertexId: 3,
      arrowType: null
    }
  },
  {
    id: 3,
    end0: {
      vertexId: 3,
      arrowType: 'triangle'
    },
    end1: {
      vertexId: 1,
      arrowType: null
    }
  }
]

export const DEFAULT_VERTICES = {
  1: { x: 40, y: 40 },
  2: { x: 200, y: 40 },
  3: { x: 200, y: 200 }
}

export const DEFAULT_ARROWS = [
  {
    id: 1,
    edgeId: 1,
    endId: 0,
    shape: 'triangle'
  },
  {
    id: 2,
    edgeId: 2,
    endId: 1,
    shape: 'triangle'
  },
  {
    id: 3,
    edgeId: 3,
    endId: 0,
    shape: 'triangle'
  }
]
