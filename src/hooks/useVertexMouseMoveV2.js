import { useState } from "react"
import { canvasCoordinatesConversion } from '../helpers/dom'

// const DEFAULT_STATE_VALUES = {

// }

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
  const [selectedVertex, setSelectedVertex] = useState(null)

  const {
    coordinates: canvasClickOrigin,
    setCoordinates: setCanvasClickOrigin
  } = useCanvasCoordinates()

  const {
    coordinates: canvasCoordinates,
    setCoordinates: setCanvasCoordinates
  } = useCanvasCoordinates()

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
    setSelectedVertex(null)
    setCanvasClickOrigin(null)
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
