import * as testedModule from './get_vertex_tangent'

describe('get_vertex_tangent.js', () => {
  describe('getRectangleTangent', () => {
    const CENTRE = { x: 100, y: 100 }
    const HEIGHT = 20
    const WIDTH = 20

    it('returns a corner', () => {
      const result = testedModule.getRectangleTangent({
        centre: CENTRE,
        height: HEIGHT,
        width: WIDTH,
        externalPoint: { x: 120, y: 120 }
      })

      expect(result).toEqual({ x: 110, y: 110 })
    })
  })
})
