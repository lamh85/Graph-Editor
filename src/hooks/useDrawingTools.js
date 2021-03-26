import { useEffect, useState } from "react"

import { getDistance } from '../geometry_helpers/get_distance'
import { getHypotenuseLength } from '../geometry_helpers/trigonometry'
import { RADIUS_MINIMUM, RECTANGLE_SIDE_MINIMUM } from '../models/vertices'
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

  if (width <= RECTANGLE_SIDE_MINIMUM || height <= RECTANGLE_SIDE_MINIMUM) {
    return
  }

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

  return { radius: newRadius }
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
    toolBlockers: [DROP],
    handleMouseDownCanvas: vertex => {
      const distanceFromClickToCentre = {
        x: currentCoordinates.x - vertex.centreX,
        y: currentCoordinates.y - vertex.centreY
      }

      setCrudPayload({
        vertex,
        distanceFromClickToCentre
      })
    },
    handleMouseMove: () => {
      const { distanceFromClickToCentre } = crudPayload
      const updatedProperties = {
        centreX: currentCoordinates.x - distanceFromClickToCentre.x,
        centreY: currentCoordinates.y - distanceFromClickToCentre.y
      }
      updateVertexWithMouseMove(updatedProperties)
    },
    handleMouseUp: () => stopTool()
  }

  const resizeService = {
    toolBlockers: [DROP],
    handleMouseDownCanvas: vertex => {
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
    handleMouseDownCanvas: () => {
      const vertexBuild = {
        circle: circlePaintbrush,
        rectangle: rectanglePaintbrush
      }[crudPayload.shapeSelected]

      createVertex(vertexBuild)
    }
  }

  const drawService = {
    handleMouseDownCanvas: () => {
      console.log('mouse down')
      copyToClickCoordinates()
    },
    handleMouseMove: () => {
      if (!clickCoordinates.x || !clickCoordinates.y) return
    },
    handleMouseUp: () => {
      if (!clickCoordinates.x || !clickCoordinates.y) return
      
      shapeSelected === 'rectangle'
        && createRectangleWithDrag({
          rectangleVariableSized,
          createVertex
        })

      shapeSelected === 'circle'
        && circleVariableSized.radius >= RADIUS_MINIMUM
        && createCircleWithDrag({
          circleVariableSized,
          createVertex
        })
      
      setClickCoordinates({ x: null, y: null })
    }
  }

  // mouse event broadcasters ---------------

  const broadcastMouseEvent = ({
    handlerName,
    payload,
    tool
  }) => {
    const toolKey = toolSelected || tool

    const toolService = {
      MOVE: moveService,
      RESIZE: resizeService,
      DROP: dropService,
      DRAW: drawService
    }[toolKey]

    if (!toolService) return

    toolService?.[handlerName](payload)
  }

  const handleMouseDownCanvas = ({ vertex, tool } = {}) => {
    if (
      tool
      && !toolsPermitted().includes(tool)
    ) return

    if (tool) {
      stopTool()
      setToolSelected(tool)
    }

    broadcastMouseEvent({
      handlerName: 'handleMouseDownCanvas',
      payload: vertex,
      tool
    })
  }

  const handleMenuSelection = ({ toolType, shapeSelected }) => {
    stopTool()
    setToolSelected(toolType)
    setCrudPayload({ shapeSelected })
  }

  useEffect(() => {
    if (!toolSelected) return
    broadcastMouseEvent({ handlerName: 'handleMouseMove' })
  }, [currentCoordinates])

  const handleMouseUp = () => {
    broadcastMouseEvent({ handlerName: 'handleMouseUp' })
  }

  // queries -----------------

  const isToolSelected = toolQueried => toolSelected === toolQueried

  const vertexSelected = crudPayload?.vertex

  const toolsPermitted = () => {
    const tools = ['DROP', 'DRAW']

    if ([DRAW, DROP].includes(toolSelected)) {
      return tools
    } else {
      return [...tools, 'MOVE', 'RESIZE']
    }
  }

  const shapeSelected = crudPayload?.shapeSelected

  return {
    currentCoordinates,
    setCurrentCoordinates,
    handleMouseDownCanvas,
    handleMouseUp,
    handleMenuSelection,
    stopTool,
    rectangleVariableSized,
    circleVariableSized,
    isToolSelected,
    vertexSelected,
    shapeSelected,
    toolsPermitted: toolsPermitted()
  }
}
