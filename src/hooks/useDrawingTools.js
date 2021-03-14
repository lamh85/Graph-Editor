import { useEffect, useState } from "react"

import { getDistance } from '../geometry_helpers/get_distance'
import { getHypotenuseLength } from '../geometry_helpers/trigonometry'
import {
  RADIUS_MINIMUM,
  DEFAULT_RECTANGLE,
  DEFAULT_CIRCLE
} from '../models/vertices'

const TOOL_NAMES = {
  MOVE: 'MOVE',
  RESIZE: 'RESIZE',
  DROP: 'DROP',
  DRAW: 'DRAW'
}

const TOOL_BLOCKERS = {
  [TOOL_NAMES.MOVE]: [TOOL_NAMES.DROP],
  [TOOL_NAMES.RESIZE]: [TOOL_NAMES.DROP]
}

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

export const useDrawingTools = ({ updateVertex, createVertex }) => {
  const [selectedTool, setSelectedTool] = useState(null)
  const [clickCoordinates, setClickCoordinates] = useState({
    x: null,
    y: null
  })
  const [currentCoordinates, setCurrentCoordinates] = useState({
    x: null,
    y: null
  })
  const [crudPayload, setCrudPayload] = useState({})

  const stopTool = () => {
    setSelectedTool(null)
    setClickCoordinates({ x: null, y: null })
    setCrudPayload({})
  }

  const handleSelectTool = ({ toolType, paintbrushShape }) => {
    stopTool()
    setSelectedTool(toolType)

    if (TOOL_NAMES.DROP === selectedTool) {
      setCrudPayload({ paintbrushShape })
    }
  }

  const handleMouseDown = vertex => {
    setCrudPayload({ ...crudPayload, vertex })

    if ([TOOL_NAMES.RESIZE, TOOL_NAMES.DRAW].includes(selectedTool)) {
      setClickCoordinates(currentCoordinates)
    }
  }

  const updateVertexWithMouseMove = () => {
    if (![TOOL_NAMES.MOVE, TOOL_NAMES.RESIZE].includes(selectedTool)) {
      return
    }

    let propertySet = {}

    if (selectedTool === TOOL_NAMES.RESIZE) {
      propertySet = buildResizedRadius({ crudPayload, currentCoordinates })
    } else if (selectedTool === TOOL_NAMES.MOVE) {
      propertySet = {
        centreX: currentCoordinates.x,
        centreY: currentCoordinates.y
      }
    }

    if (!propertySet) return

    updateVertex({
      id: crudPayload.vertex.id,
      propertySet
    })
  }

  useEffect(updateVertexWithMouseMove, [currentCoordinates])

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

  const handleMouseUp = () => {
    if (selectedTool === TOOL_NAMES.DRAW) {
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

    if ([TOOL_NAMES.DRAW, TOOL_NAMES.MOVE, TOOL_NAMES.RESIZE].includes(selectedTool)) {
      stopTool()
    }
  }

  return {
    currentCoordinates,
    setCurrentCoordinates,
    handleSelectTool,
    handleMouseDown,
    handleMouseUp
  }
}