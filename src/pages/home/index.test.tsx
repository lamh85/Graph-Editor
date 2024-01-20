import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Home from './index.jsx'

describe('Home.jsx', () => {
  beforeEach(() => {
    render(<Home />)
  })

  describe('Startup', () => {
    it('Renders 2 circles and 1 rectangle', async () => {
      // TODO: Use a query method recommended by the testing library:
      // https://testing-library.com/docs/queries/about/#priority
      const circles = document.querySelectorAll('[class*="CircleOuter"]')
      const rectangles = document.querySelectorAll('rect')

      expect(circles.length).toEqual(2)
      expect(rectangles.length).toEqual(1)
    })
  })

  describe('Core cursor features', () => {
    it('Move a circle', async () => {
      const circle = document.querySelector('[class*="CircleInner"]')

      const xBefore = circle.getAttribute('cx')
      const yBefore = circle.getAttribute('cy')

      fireEvent.mouseDown(circle)
      fireEvent.mouseMove(circle, { clientX: 10, clientY: 15 })
      fireEvent.mouseUp(circle)

      const xAfter = circle.getAttribute('cx')
      const yAfter = circle.getAttribute('cy')

      expect(parseInt(xAfter) - parseInt(xBefore)).toEqual(10)
      expect(parseInt(yAfter) - parseInt(yBefore)).toEqual(15)
    })
  })
})
