import { useState } from "react"
import { canvasCoordinatesConversion } from '../helpers/dom'

const DEFAULT_STATE_VALUES = {
  selectedVertex: null,
  canvasClickOrigin: null,
  canvasCoordinates: null,
}

const useCanvasCoordinates = () => {
  const [state, setState] = useState()

  const setCoordinates = (event, shouldDebug) => {
    if (!event) return
    const canvasCoordinates = canvasCoordinatesConversion({
      cursorX: event.clientX,
      cursorY: event.clientY
    })

    setState(canvasCoordinates)
  }

  return {
    coordinates: state,
    setCoordinates
  }
}

const states = () => {
  const [
    selectedVertex,
    setSelectedVertex
  ] = useState(DEFAULT_STATE_VALUES.selectedVertex)

  const {
    coordinates: canvasClickOrigin,
    setCoordinates: setCanvasClickOrigin
  } = useCanvasCoordinates(DEFAULT_STATE_VALUES.canvasClickOrigin)

  const {
    coordinates: canvasCoordinates,
    setCoordinates: setCanvasCoordinates
  } = useCanvasCoordinates(DEFAULT_STATE_VALUES.canvasCoordinates)

  return {
    selectedVertex,
    setSelectedVertex,
    canvasClickOrigin,
    setCanvasClickOrigin,
    canvasCoordinates,
    setCanvasCoordinates
  }
}

export const useVertexMouseMove = () => {
  const {
    selectedVertex,
    setSelectedVertex,
    canvasClickOrigin,
    setCanvasClickOrigin,
    canvasCoordinates,
    setCanvasCoordinates
  } = states()

  const mouseDownListener = ({ event, vertex }) => {
    setSelectedVertex(vertex)
    setCanvasClickOrigin(event)
  }

  const mouseMoveListener = event => {
    if (!selectedVertex) return

    setCanvasCoordinates(event, true)
  }

  const mouseUpListener = () => {
    const defaults = DEFAULT_STATE_VALUES
    setSelectedVertex(defaults.selectedVertex)
    setCanvasClickOrigin(defaults.canvasClickOrigin)
    setCanvasCoordinates(defaults.canvasCoordinates)
  }

  return {
    mouseDownListener,
    mouseMoveListener,
    mouseUpListener,
    selectedVertex,
    canvasClickOrigin,
    canvasCoordinates
  }
}
