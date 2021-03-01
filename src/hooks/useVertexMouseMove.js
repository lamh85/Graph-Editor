import { useState } from "react"
import {
  canvasCoordinatesConversion,
  doShareAncestry
} from '../helpers/dom'

const DEFAULT_STATE_VALUES = {
  selectedVertex: null,
  canvasClickOrigin: { x: null, y: null },
  canvasCoordinates: { x: null, y: null },
}

// getBoundingClientRect().x <-- add this

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

  return {
    mouseDownListener,
    mouseMoveListener,
    mouseUpListener,
    selectedVertex,
    canvasClickOrigin,
    canvasCoordinates
  }
}
