import { useState } from "react"

const TOOL_NAMES = {
  MOVE: 'MOVE',
  RESIZE: 'RESIZE',
  DROP: 'DROP',
  DRAW: 'DRAW'
}

export const useDrawingTools = ({
  currentCoordinates,
  updateVertex,
  createVertex
}) => {
  const [drawingTool, setDrawingTool] = useState(null)
  const [selectedVertex, setSelectedVertex] = useState(null)
  const [clickCoordinates, setClickCoordinates] = useState({
    x: null,
    y: null
  })
  const [vertexBuildShape, setVertexBuildShape] = useState(null)

  const startMouseDragTool = ({ toolType, vertex }) => {
    setDrawingTool(toolType)
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
    if (drawingTool === TOOL_NAMES.MOVE) {
      // update with new centre
    } else if (drawingTool === TOOL_NAMES.RESIZE) {
      // update with new radius
    } else if (drawingTool === TOOL_NAMES.DRAW) {
      // create vertex
    }
  }

  // TODO: can this leverage startMouseDragTool?
  const startDrawTool = shape => {
    setClickCoordinates(currentCoordinates)
    setVertexBuildShape(shape)
  }

  return {
    TOOL_NAMES,
    drawingTool,
    vertexBuildShape,
    startMoveTool,
    startResizeTool,
    startDrawTool,
    mouseUpListener
  }
}