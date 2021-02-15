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
  cursorOrigin,
  mouseMovedVertex,
  updateVertex
}) => {
  const distanceFromCentre = {
    x: cursorOrigin.x - mouseMovedVertex.centreX,
    y: cursorOrigin.y - mouseMovedVertex.centreY
  }

  const canvasDestination = canvasCoordinatesConversion({
    cursorX: event.clientX,
    cursorY: event.clientY
  })

  updateVertex({
    id: mouseMovedVertex.id,
    propertySet: {
      centreX: canvasDestination.x - distanceFromCentre.x,
      centreY: canvasDestination.y - distanceFromCentre.y
    }
  })
}

const handleResizeVertex = ({
  mouseMovedVertex,
  event,
  updateVertex
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

  updateVertex({
    id: mouseMovedVertex.id,
    property: 'radius',
    value: cursorFromVertexHyp
  })
}

export const useVertexMouseMove = ({
  canvasWidth,
  canvasHeight,
  updateVertex
}) => {
  const [mouseMovedVertex, setMouseMovedVertex] = useState({})
  const [objective, setObjective] = useState('')
  const [cursorOrigin, setCursorOrigin] = useState({
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

    setCursorOrigin({
      x: event.clientX,
      y: event.clientY
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
        cursorOrigin,
        mouseMovedVertex,
        updateVertex
      })
    }

    if (objective === 'resize') {
      handleResizeVertex({
        mouseMovedVertex,
        event,
        updateVertex
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