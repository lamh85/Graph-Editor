import { useEffect, useState } from "react"

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

const createVertexByDrawing = crudPayload => {}

const buildResizedRadius = crudPayload => {

}

export const useDrawingTools = () => {
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

  const startTool = ({ toolType, vertex, paintbrushShape }) => {
    if (TOOL_BLOCKERS?.[toolType]?.includes(selectedTool)) {
      return
    }

    stopTool()

    setSelectedTool(toolType)
    setCrudPayload({ vertex, paintbrushShape })
    setClickCoordinates(currentCoordinates)
  }

  const updateVertexWithMouseMove = () => {
    if (![TOOL_NAMES.MOVE, TOOL_NAMES.RESIZE].includes(selectedTool)) {
      return
    }
  }

  useEffect(updateVertexWithMouseMove, [currentCoordinates])

  const mouseUpListener = () => {
    createVertexByDrawing(crudPayload)
  }

  return {
    currentCoordinates,
    setCurrentCoordinates,
    startTool,
    mouseUpListener
  }
}