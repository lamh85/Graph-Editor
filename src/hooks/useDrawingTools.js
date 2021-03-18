import { useEffect, useState } from "react"

import { getDistance } from '../geometry_helpers/get_distance'
import { getHypotenuseLength } from '../geometry_helpers/trigonometry'
import { RADIUS_MINIMUM } from '../models/vertices'
import { getVertexBuilds } from '../hook_helpers/useDrawingTools'

const MOVE = 'MOVE'
const RESIZE = 'RESIZE'
const DROP = 'DROP'
const DRAW = 'DRAW'

export const createRectangleWithDrag = ({
  rectangleVariableSized,
  createVertex
}) => {
  if (!rectangleVariableSized) return null

  const { top, left, width, height } = rectangleVariableSized

  const centreX = left + width / 2
  const centreY = top + height / 2

  createVertex({
    centreX,
    centreY,
    height,
    width,
    shape: 'rectangle'
  })
}

export const createCircleWithDrag = ({
  circleVariableSized,
  createVertex
}) => {
  if (!circleVariableSized) return null

  if (circleVariableSized.radius < RADIUS_MINIMUM) return

  createVertex({
    ...circleVariableSized,
    shape: 'circle'
  })
}

const buildResizedRadius = ({ crudPayload, currentCoordinates }) => {
  const raidusTriangle = getDistance({
    origin: {
      x: crudPayload.vertex.centreX,
      y: crudPayload.vertex.centreY
    },
    destination: currentCoordinates
  })

  const newRadius = getHypotenuseLength({
    adjacent: raidusTriangle.height,
    opposite: raidusTriangle.width
  })

  if (!newRadius || newRadius < RADIUS_MINIMUM) return null

  return newRadius
}

// TODO: maybe use "includes" to make this function smaller
export const useDrawingTools = ({ updateVertex, createVertex }) => {
  const [toolSelected, setToolSelected] = useState(null)
  const [clickCoordinates, setClickCoordinates] = useState({
    x: null,
    y: null
  })
  const [currentCoordinates, setCurrentCoordinates] = useState({
    x: null,
    y: null
  })
  const [crudPayload, setCrudPayload] = useState({})

  const {
    rectangleVariableSized,
    circleVariableSized,
    circlePaintbrush,
    rectanglePaintbrush
  } = getVertexBuilds({
    clickCoordinates,
    currentCoordinates
  })

  // shared between tool services ------------

  const stopTool = () => {
    setToolSelected(null)
    setClickCoordinates({ x: null, y: null })
    setCrudPayload({})
  }

  const setVertexPayload = vertex => {
    setCrudPayload({ ...crudPayload, vertex })
  }

  const copyToClickCoordinates = () => {
    setClickCoordinates(currentCoordinates)
  }

  const updateVertexWithMouseMove = updatedProperties => {
    if (!updatedProperties) return

    updateVertex({
      id: crudPayload.vertex.id,
      propertySet: updatedProperties
    })
  }

  // tool services -----------------

  const moveService = {
    toolName: MOVE,
    toolBlockers: [DROP],
    handleMouseDownCanvas: vertex => {
      setToolSelected(MOVE)
      setVertexPayload(vertex)
    },
    handleMouseMove: () => {
      const updatedProperties = {
        centreX: currentCoordinates.x,
        centreY: currentCoordinates.y
      }
      updateVertexWithMouseMove(updatedProperties)
    },
    handleMouseUp: () => stopTool()
  }

  const resizeService = {
    toolName: RESIZE,
    toolBlockers: [DROP],
    handleMouseDownCanvas: vertex => {
      setToolSelected(RESIZE)
      copyToClickCoordinates()
      setVertexPayload(vertex)
    },
    handleMouseMove: () => {
      const updatedProperties = buildResizedRadius({
        crudPayload,
        currentCoordinates
      })
      updateVertexWithMouseMove(updatedProperties)
    },
    handleMouseUp: () => stopTool()
  }

  const dropService = {
    toolName: DROP,
    handleMouseDownCanvas: () => {
      const vertexBuild = {
        circle: circlePaintbrush,
        rectangle: rectanglePaintbrush
      }[crudPayload.shapeSelected]

      createVertex(vertexBuild)
    }
  }

  const drawService = {
    toolName: DRAW,
    handleMouseDownCanvas: () => copyToClickCoordinates(),
    handleMouseUp: () => {
      shapeSelected === 'rectangle'
        && createRectangleWithDrag({
          rectangleVariableSized,
          createVertex
        })

      shapeSelected === 'circle'
        && createCircleWithDrag({
          circleVariableSized,
          createVertex
        })
    }
  }

  // mouse event broadcasters ---------------

  const broadcastMouseEvent = ({ handlerName, payload }) => {
    const toolServices = [
      moveService,
      resizeService,
      dropService,
      drawService
    ]

    toolServices.forEach(service => {
      if (service?.toolBlockers?.includes(toolSelected)) {
        return
      }

      service?.[handlerName](payload)
    })
  }

  const handleMouseDownCanvas = vertex => {
    broadcastMouseEvent({
      handlerName: 'handleMouseDownCanvas',
      payload: vertex
    })
  }

  const handleMenuClick = ({ toolType, shapeSelected }) => {
    stopTool()
    setToolSelected(toolType)
    setCrudPayload({ shapeSelected })
  }

  useEffect(() => {
    broadcastMouseEvent({ handlerName: 'handleMouseMove' })
  }, [currentCoordinates])

  const handleMouseUp = () => {
    broadcastMouseEvent({ handlerName: 'handleMouseUp' })
  }

  return {
    currentCoordinates,
    setCurrentCoordinates,
    handleMouseDownCanvas,
    handleMouseUp,
    handleMenuClick,
    rectangleVariableSized,
    circleVariableSized
  }
}
