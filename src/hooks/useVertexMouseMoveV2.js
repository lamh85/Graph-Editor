import { useState } from "react"
import { canvasCoordinatesConversion } from '../helpers/dom'

// TODO: use doShareLineage
const doesExceedBoundaries = ({ x, y, canvasWidth, canvasHeight }) => {
  return x > canvasWidth || y > canvasHeight
}

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

    // console.log('setting canvas coordinates --------')
    // console.log(canvasCoordinates)
    // if (shouldDebug) {
    //   debugger
    // }
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
    setCanvasCoordinates
  } = states()

  const mouseDownListener = ({ event, vertex }) => {
    setSelectedVertex(vertex)
    setCanvasClickOrigin(event)
  }

  const mouseMoveListener = event => {
    if (!isMouseMoveValid || !selectedVertex) return

    setCanvasCoordinates(event, true)
    // console.log(canvasCoordinates)

    const exceedBoundariesResult = doesExceedBoundaries({
      x: canvasCoordinates.x,
      y: canvasCoordinates.y,
      canvasWidth,
      canvasHeight
    })

    if (exceedBoundariesResult) {
      // TODO: abstract out a function that sets all states to initial
      setSelectedVertex(null)
      return
    }
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
