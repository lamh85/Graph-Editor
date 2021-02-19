import { useState } from "react"
import { canvasCoordinatesConversion } from '../helpers/dom'

const doesExceedBoundaries = ({ x, y, canvasWidth, canvasHeight }) => {
  return x > canvasWidth || y > canvasHeight
}

const useCanvasCoordinates = () => {
  const [state, setState] = useState()

  const setCoordinates = event => {
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
  const [selectedVertex, setSelectedVertex] = useState({})

  const {
    coordinates: canvasClickOrigin,
    setCoordinates: setCanvasClickOrigin
  } = useCanvasCoordinates()

  const {
    coordinates: canvasCoordinates,
    setCoordinates: setCanvasCoordinates
  } = useCanvasCoordinates()

  const [moveDelta, setMoveDelta] = usetState({
    x: null,
    y: null
  })

  return {
    selectedVertex,
    setSelectedVertex,
    canvasClickOrigin,
    setCanvasClickOrigin,
    canvasCoordinates,
    setCanvasCoordinates,
    moveDelta,
    setMoveDelta
  }
}

export const useVertexMouseMove = ({
  canvasWidth,
  canvasHeight,
  isMouseMoveValid = true
}) => {
  const {
    selectedVertex,
    setSelectedVertex,
    canvasClickOrigin,
    setCanvasClickOrigin,
    canvasCoordinates,
    setCanvasCoordinates,
    moveDelta,
    setMoveDelta
  } = states()

  const mouseDownListener = ({ event, vertex }) => {
    setSelectedVertex(vertex)
    setCanvasClickOrigin(event)
  }

  const mouseMoveListener = event => {
    if (!isMouseMoveValid || !selectedVertex) return

    setCanvasCoordinates(event)

    const exceedBoundariesResult = doesExceedBoundaries({
      x: canvasCoordinates.x,
      y: canvasCoordinates.y,
      canvasWidth,
      canvasHeight
    })

    if (exceedBoundariesResult) {
      setSelectedVertex(null)
      return
    }

    const newMoveDelta = {
      x: canvasCoordinates.x - canvasClickOrigin.x,
      y: canvasCoordinates.y - canvasClickOrigin.y
    }

    setMoveDelta(newMoveDelta)
  }

  const mouseUpListener = () => setSelectedVertex(null)

  return {
    mouseDownListener,
    mouseMoveListener,
    mouseUpListener,
    selectedVertex,
    canvasClickOrigin,
    canvasCoordinates,
    moveDelta
  }
}
