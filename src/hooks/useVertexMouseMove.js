import { useState } from "react"
import { getHypotenuseLength } from '../geometry_helpers/trigonometry'
import { getDistance } from "../geometry_helpers/get_distance"

const canvasCoordinatesConversion = ({
  cursorX,
  cursorY,
  canvasX,
  canvasY
}) => {
  const { scrollTop, scrollLeft } = document.querySelector('html')

  if (cursorX && cursorY) {
    return {
      x: cursorX + scrollLeft,
      y: cursorY + scrollTop
    }
  } else if (canvasX && canvasY) {
    return {
      x: canvasX - scrollLeft,
      y: canvasY - scrollTop
    }
  }
}

const doesExceedBoundaries = ({ x, y, canvasWidth, canvasHeight }) => {
  return x > canvasWidth || y > canvasHeight
}

const handleMoveVertex = ({
  event,
  canvasClickOrigin,
  mouseMovedVertex,
  updateVertex
}) => {
  const clickHandleFromCentre = {
    x: canvasClickOrigin.x - mouseMovedVertex.centreX,
    y: canvasClickOrigin.y - mouseMovedVertex.centreY
  }

  const canvasDestination = canvasCoordinatesConversion({
    cursorX: event.clientX,
    cursorY: event.clientY
  })

  updateVertex({
    id: mouseMovedVertex.id,
    propertySet: {
      centreX: canvasDestination.x - clickHandleFromCentre.x,
      centreY: canvasDestination.y - clickHandleFromCentre.y
    }
  })
}

const handleResizeVertex = ({
  mouseMovedVertex,
  event,
  updateVertex,
  radiusMinimum
}) => {
  const canvasDestination = canvasCoordinatesConversion({
    cursorX: event.clientX,
    cursorY: event.clientY
  })

  const {
    height: cursorFromVertexY,
    width: cursorFromVertexX
  } = getDistance({
    origin: {
      x: mouseMovedVertex.centreX,
      y: mouseMovedVertex.centreY
    },
    destination: {
      x: canvasDestination.x,
      y: canvasDestination.y
    }
  })

  const cursorFromVertexHyp = getHypotenuseLength({
    adjacent: cursorFromVertexY,
    opposite: cursorFromVertexX
  })

  const radiusValidated =
    cursorFromVertexHyp > radiusMinimum
      ? cursorFromVertexHyp
      : radiusMinimum

  updateVertex({
    id: mouseMovedVertex.id,
    property: 'radius',
    value: radiusValidated
  })
}

export const useVertexMouseMove = ({
  canvasWidth,
  canvasHeight,
  updateVertex,
  radiusMinimum
}) => {
  const [mouseMovedVertex, setMouseMovedVertex] = useState({})
  const [objective, setObjective] = useState('')
  const [canvasClickOrigin, setCanvasClickOrigin] = useState({
    x: null,
    y: null
  })

  const handleVertexMouseDown = ({
    vertex,
    event,
    requestedObjective
  }) => {
    setMouseMovedVertex(vertex)
    setObjective(requestedObjective)

    const canvasCoordinates = canvasCoordinatesConversion({
      cursorX: event.clientX,
      cursorY: event.clientY
    })

    setCanvasClickOrigin({
      x: canvasCoordinates.x,
      y: canvasCoordinates.y
    })
  }

  const handleVertexMouseMove = event => {{
    if (!mouseMovedVertex) return
    const { clientX, clientY } = event
    const canvasCoordinates = canvasCoordinatesConversion({
      cursorX: clientX,
      cursorY: clientY
    })

    const exceedBoundariesResult = doesExceedBoundaries({
      x: canvasCoordinates.x,
      y: canvasCoordinates.y,
      canvasWidth,
      canvasHeight
    })

    if (exceedBoundariesResult) {
      setMouseMovedVertex(null)
      return
    }

    if (objective === 'move') {
      handleMoveVertex({
        event,
        canvasClickOrigin,
        mouseMovedVertex,
        updateVertex
      })
    }

    if (objective === 'resize') {
      handleResizeVertex({
        mouseMovedVertex,
        event,
        updateVertex,
        radiusMinimum
      })
    }
  }}

  const handleVertexMouseUp = () => setMouseMovedVertex(null)

  return {
    handleVertexMouseDown,
    handleVertexMouseMove,
    handleVertexMouseUp,
    mouseMovedVertex,
    objective
  }
}