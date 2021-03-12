import { useState } from "react"

const TOOL_NAMES = {
  MOVE: 'MOVE',
  RESIZE: 'RESIZE',
  DROP: 'DROP',
  DRAW: 'DRAW'
}

export const useDrawingTools = () => {
  const [tool, setTool] = useState(null)
  const [selectedVertex, setSelectedVertex] = useState(null)
  const [clickCoordinates, setClickCoordinates] = useState({
    x: null,
    y: null
  })
  const [vertexBuildShape, setVertexBuildShape] = useState(null)
  const [currentCoordinates, setCurrentCoordinates] = useState({
    x: null,
    y: null
  })

  const startMouseDragTool = ({ toolType, vertex }) => {
    setTool(toolType)
    setSelectedVertex(vertex)

    setClickCoordinates(currentCoordinates)
  }

  const startMoveTool = vertex => {
    startMouseDragTool({ vertex, toolType: TOOL_NAMES.MOVE })
  }

  const startResizeTool = vertex => {
    startMouseDragTool({ vertex, toolType: TOOL_NAMES.RESIZE })
  }

  const mouseUpListener = () => {
    if (tool === TOOL_NAMES.MOVE) {
      // update with new centre
    } else if (tool === TOOL_NAMES.RESIZE) {
      // update with new radius
    } else if (tool === TOOL_NAMES.DRAW) {
      // create vertex
    }
  }

  // TODO: can this leverage startMouseDragTool?
  const startDrawTool = shape => {
    setClickCoordinates(currentCoordinates)
    setVertexBuildShape(shape)
  }

  return {
    currentCoordinates,
    setCurrentCoordinates
  }
}