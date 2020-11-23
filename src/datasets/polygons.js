const DEFAULT_EDGES = [
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

const DEFAULT_VERTICES = {
  1: { x: 40, y: 40 },
  2: { x: 200, y: 40 },
  3: { x: 200, y: 200 }
}

export {
  DEFAULT_EDGES,
  DEFAULT_VERTICES
}