import { VALIDATORS } from './validators'
import { ARROW_TYPES } from './polygons'

export const VALIDATION_RULES = {
  id: VALIDATORS.integer,
}

type EndT = {
  vertexId: number
  arrowType: 'triangle' // Will add more arrow types later
}

const TEMPLATE_END: EndT = {
  vertexId: 1,
  arrowType: ARROW_TYPES.TRIANGLE || Object.values(ARROW_TYPES)[0],
}

export const TEMPLATE = {
  end0: TEMPLATE_END,
  end1: TEMPLATE_END,
}

export type EdgeT = {
  id: number
  weight?: number
  end0: EndT
  end1: EndT
}

export const SEED: EdgeT[] = [
  {
    id: 1,
    end0: {
      vertexId: 1,
      arrowType: 'triangle',
    },
    end1: {
      vertexId: 2,
      arrowType: null,
    },
  },
  {
    id: 2,
    end0: {
      vertexId: 2,
      arrowType: 'triangle',
    },
    end1: {
      vertexId: 3,
      arrowType: null,
    },
  },
  {
    id: 3,
    end0: {
      vertexId: 3,
      arrowType: 'triangle',
    },
    end1: {
      vertexId: 1,
      arrowType: null,
    },
  },
]
