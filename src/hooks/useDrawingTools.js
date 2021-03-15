import { useEffect, useState } from "react"

import { getDistance } from '../geometry_helpers/get_distance'
import { getHypotenuseLength } from '../geometry_helpers/trigonometry'
import {
  RADIUS_MINIMUM,
  DEFAULT_RECTANGLE,
  DEFAULT_CIRCLE
} from '../models/vertices'

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

  // shared between tool services ------------

  const stopTool = () => {
    setToolSelected(null)
    setClickCoordinates({ x: null, y: null })
    setCrudPayload({})
  }

  // Need this function because some tools are initiated by
  // clicking on the toolbar rather than the canvas
  const handleSelectTool = ({ toolType, paintbrushShape }) => {
    stopTool()
    setToolSelected(toolType)
    setCrudPayload({ paintbrushShape })
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
    handleMouseDown: vertex => {
      handleSelectTool({ toolType: MOVE })
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
    handleMouseDown: vertex => {
      handleSelectTool({ toolType: RESIZE })
      copyToClickCoordinates()
      setVertexPayload(vertex)
    },
    handleMouseMove: () => {
      const updatedProperties = buildResizedRadius({ crudPayload, currentCoordinates })
      updateVertexWithMouseMove(updatedProperties)
    },
    handleMouseUp: () => stopTool()
  }

  const dropService = {
    toolName: DROP,
    handleMouseDown: () => {
      // create a vertex
    }
  }

  const drawService = {
    toolName: DRAW,
    handleMouseDown: () => copyToClickCoordinates(),
    handleMouseUp: () => {
      paintbrushShape === 'rectangle'
        && createRectangleWithDrag({
          rectangleVariableSized: buildRectangleVariableSized(),
          createVertex
        })

      paintbrushShape === 'circle'
        && createCircleWithDrag({
          circleVariableSized: buildCircleVariableSized(),
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

  const handleMouseDown = vertex => {
    broadcastMouseEvent({
      handlerName: 'handleMouseDown',
      payload: vertex
    })
  }

  useEffect(() => {
    broadcastMouseEvent({ handlerName: 'handleMouseMove' })
  }, [currentCoordinates])

  const handleMouseUp = () => {
    broadcastMouseEvent({ handlerName: 'handleMouseUp' })
  }

  // other --------------------

  const hasCoordinates =
    clickCoordinates?.x &&
    clickCoordinates?.y &&
    currentCoordinates?.x &&
    currentCoordinates?.y

  const buildRectangleVariableSized = () => {
    if (!hasCoordinates) return null

    const left = Math.min(clickCoordinates.x, currentCoordinates.x)
    const top = Math.min(clickCoordinates.y, currentCoordinates.y)
    const height = Math.abs(currentCoordinates.y - clickCoordinates.y)
    const width = Math.abs(currentCoordinates.x - clickCoordinates.x)

    return { left, top, height, width }
  }

  const buildCircleVariableSized = () => {
    if (!hasCoordinates) return null

    const { x: x1, y: y1 } = clickCoordinates || {}
    const { x: x2, y: y2 } = currentCoordinates || {}

    if (!x1 || !y1 || !x2 || !y2) return null

    const centreX = (x1 + x2) / 2
    const centreY = (y1 + y2) / 2

    const radius = getHypotenuseLength({
      adjacent: centreX - x1,
      opposite: centreY - y1
    })

    if (!radius) return null

    return {
      centreX,
      centreY,
      radius,
      cx: centreX,
      cy: centreY,
      r: radius
    }
  }

  const circlePaintbrush = {
    ...DEFAULT_CIRCLE,
    centreX: currentCoordinates.x,
    centreY: currentCoordinates.y
  }

  const rectanglePaintbrush = {
    ...DEFAULT_RECTANGLE,
    centreX: currentCoordinates.x,
    centreY: currentCoordinates.y
  }

  return {
    currentCoordinates,
    setCurrentCoordinates,
    handleSelectTool,
    handleMouseDown,
    handleMouseUp
  }
}