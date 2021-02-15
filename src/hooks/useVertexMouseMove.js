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
  x > canvasWidth || y > canvasHeight
}

const handleMoveVertex = ({
  event,
  cursorOrigin,
  actionedVertex,
  updateVertex
}) => {
  const distanceFromCentre = {
    x: cursorOrigin.x - actionedVertex.centreX,
    y: cursorOrigin.y - actionedVertex.centreY
  }

  const canvasDestination = canvasCoordinatesConversion({
    cursorX: event.clientX,
    cursorY: event.clientY
  })

  updateVertex({
    id: actionedVertex.id,
    propertySet: {
      centreX: canvasDestination.x - distanceFromCentre.x,
      centreY: canvasDestination.y - distanceFromCentre.y
    }
  })
}

const handleResizeVertex = ({
  actionedVertex,
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
      x: actionedVertex.centreX,
      y: actionedVertex.centreY
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
    id: actionedVertex.id,
    property: 'radius',
    value: cursorFromVertexHyp
  })
}

export const useVertexMouseMove = ({
  canvasWidth,
  canvasHeight,
  updateVertex
}) => {
  const [movedVertex, setMovedVertex] = useState({})
  const [actionedVertex, setActionedVertex] = useState({})
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
    setActionedVertex(vertex)
    setObjective(requestedObjective)

    setCursorOrigin({
      x: event.clientX,
      y: event.clientY
    })
  }

  const handleVertexMouseMove = event => {{
    if (!actionedVertex) return

    const { clientX, clientY } = event
    const canvasCoordinates = ({ cursorX: clientX, cursorY: clientY })
    const exceedBoundariesResult = doesExceedBoundaries({
      x: canvasCoordinates.x,
      y: canvasCoordinates.y,
      canvasWidth,
      canvasHeight
    })

    if (exceedBoundariesResult) {
      setMovedVertex(null)
      setResizedVertex(null)
    }

    if (objective === 'move') {
      handleMoveVertex({
        event,
        movedVertex,
        cursorOrigin,
        actionedVertex,
        updateVertex
      })
    }

    if (objective === 'resize') {
      handleResizeVertex({
        actionedVertex,
        event,
        updateVertex
      })
    }
  }}

  const handleVertexMouseUp = () => setActionedVertex(null)

  return {
    handleVertexMouseDown,
    handleVertexMouseMove,
    handleVertexMouseUp
  }
}