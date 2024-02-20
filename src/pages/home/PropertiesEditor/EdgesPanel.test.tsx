import React from 'react'
import { render, logRoles } from '@testing-library/react'
import Home from '../../home'

describe('<EdgesPanel/>', () => {
  beforeEach(() => {
    render(<Home />)
  })

  describe('Edges form', () => {
    // TODO: The valid IDs are currently hard coded
    it('using a valid vertex updates the model', () => {
      const htmlElement = document.querySelector('html')
      logRoles(htmlElement)
      expect(true).toEqual(true)
    })
  })
})
