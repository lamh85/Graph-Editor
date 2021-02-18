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

export const useVertexMouseMove = ({
  canvasWidth,
  canvasHeight,
  isMouseMoveValid = true
}) => {
  const [impactedVertex, setImpactedVertex] = useState({})

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

  const mouseDownListener = ({ event, vertex }) => {
    setImpactedVertex(vertex)
    setCanvasClickOrigin(event)
  }

  const mouseMoveListener = event => {
    if (!isMouseMoveValid || !impactedVertex) return

    setCanvasCoordinates(event)

    const exceedBoundariesResult = doesExceedBoundaries({
      x: canvasCoordinates.x,
      y: canvasCoordinates.y,
      canvasWidth,
      canvasHeight
    })

    if (exceedBoundariesResult) {
      setImpactedVertex(null)
      return
    }

    const newMoveDelta = {
      x: canvasCoordinates.x - canvasClickOrigin.x,
      y: canvasCoordinates.y - canvasClickOrigin.y
    }

    setMoveDelta(newMoveDelta)
  }

  const mouseUpListener = () => setImpactedVertex(null)

  return {
    mouseDownListener,
    mouseMoveListener,
    mouseUpListener,
    mouseMovedVertex: impactedVertex,
    canvasClickOrigin,
    canvasCoordinates,
    moveDelta
  }
}
