import { useState } from "react"
import {
  canvasCoordinatesConversion,
  doShareAncestry
} from '../helpers/dom'
import { getHypotenuseLength } from '../geometry_helpers/trigonometry'

const DEFAULT_STATE_VALUES = {
  selectedVertex: null,
  canvasClickOrigin: { x: null, y: null },
  canvasCoordinates: { x: null, y: null },
}

const useCanvasCoordinates = (initialState, canvasRef) => {
  const [state, setState] = useState(initialState)

  const setCoordinates = event => {
    if (!event) return
    const canvasCoordinates = canvasCoordinatesConversion({
      cursorX: event.clientX,
      cursorY: event.clientY,
      canvasRef
    })

    setState(canvasCoordinates)
  }

  return {
    coordinates: state,
    setCoordinates
  }
}

const states = canvasRef => {
  const [
    selectedVertex,
    setSelectedVertex
  ] = useState(DEFAULT_STATE_VALUES.selectedVertex)

  const {
    coordinates: canvasClickOrigin,
    setCoordinates: setCanvasClickOrigin
  } = useCanvasCoordinates(
    DEFAULT_STATE_VALUES.canvasClickOrigin,
    canvasRef
  )

  const {
    coordinates: canvasCoordinates,
    setCoordinates: setCanvasCoordinates
  } = useCanvasCoordinates(
    DEFAULT_STATE_VALUES.canvasCoordinates,
    canvasRef
  )

  return {
    selectedVertex,
    setSelectedVertex,
    canvasClickOrigin,
    setCanvasClickOrigin,
    canvasCoordinates,
    setCanvasCoordinates
  }
}

export const useVertexMouseMove = (canvasRef) => {
  const {
    selectedVertex,
    setSelectedVertex,
    canvasClickOrigin,
    setCanvasClickOrigin,
    canvasCoordinates,
    setCanvasCoordinates
  } = states(canvasRef)

  const resetStates = () => {
    const defaults = DEFAULT_STATE_VALUES
    setSelectedVertex(defaults.selectedVertex)
    setCanvasClickOrigin(defaults.canvasClickOrigin)
    setCanvasCoordinates(defaults.canvasCoordinates)
  }

  const mouseDownListener = ({ event, vertex }) => {
    setSelectedVertex(vertex)
    setCanvasClickOrigin(event)
  }

  const mouseMoveListener = event => {
    if (!selectedVertex) return

    if (!doShareAncestry(event.target, canvasRef.current)) {
      resetStates()
      return
    }

    setCanvasCoordinates(event)
  }

  const mouseUpListener = () => resetStates()

  const hasCoordinates = 
    canvasClickOrigin?.x &&
    canvasClickOrigin?.y &&
    canvasCoordinates?.x &&
    canvasCoordinates?.y

  const rectangleProps = () => {
    if (!hasCoordinates) return

    const left = Math.min(canvasClickOrigin.x, canvasCoordinates.x)
    const top = Math.min(canvasClickOrigin.y, canvasCoordinates.y)
    const height = Math.abs(canvasCoordinates.y - canvasClickOrigin.y)
    const width = Math.abs(canvasCoordinates.x - canvasClickOrigin.x)

    return { left, top, height, width }
  }

  const circleProps = () => {
    if (!hasCoordinates) return

    const {
      x: x1,
      y: y1
    } = canvasClickOrigin || {}

    const {
      x: x2,
      y: y2
    } = canvasCoordinates || {}

    if (!x1 || !y1 || !x2 || !y2) return null

    const centreX = (x1 + x2) / 2
    const centreY = (y1 + y2) / 2

    const radius = getHypotenuseLength({
      adjacent: centreX - x1,
      opposite: centreY - y1
    })

    if (!radius) return null

    return {
      centreX,
      centreY,
      radius,
      cx: centreX,
      cy: centreY,
      r: radius
    }
  }

  return {
    mouseDownListener,
    mouseMoveListener,
    mouseUpListener,
    selectedVertex,
    canvasClickOrigin,
    canvasCoordinates,
    rectangleProps: rectangleProps(),
    circleProps: circleProps()
  }
}
