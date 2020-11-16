
import React, { useState } from "react"
import { hot } from "react-hot-loader"

const SVG_HEIGHT = 500
const SVG_WIDTH = 500

const LINE_ATTRIBUTES = {
  stroke: 'red',
  strokeWidth: 2
}

const vertices = [
  { id: 1, x: 40, y: 40 },
  { id: 2, x: 200, y: 40 },
  { id: 3, x: 200, y: 200 }
]

const edges = [
  [vertices[0], vertices[1]],
  [vertices[1], vertices[2]],
  [vertices[2], vertices[0]],
]

const renderLine = (endPoints, index) => {
  const attributes = {
    x1: endPoints[0].x,
    y1: endPoints[0].y,
    x2: endPoints[1].x,
    y2: endPoints[1].y,
    stroke: 'red',
    strokeWidth: 2,
    key: index
  }

  return <line {...attributes} />
}

const handleMouseDown = ({ id, setDraggedVertxId }) => {
  setDraggedVertxId(id)
}

const handleMouseUp = ({ setDraggedVertxId }) => {
  setDraggedVertxId(null)
}

const handleMouseMove = ({ event, setCursorX, setCursorY, setDraggedVertxId, draggedVertexId, vertexLocations, setVertexLocations }) => {
  setCursorX(event.clientX)
  setCursorY(event.clientY)

  if (event.clientX >= SVG_WIDTH || clientInformation.clientY >= SVG_HEIGHT) {
    setDraggedVertxId(null)
  }

  if (draggedVertexId) {
    const location = {
      ...vertexLocations,
      [draggedVertexId]: {
        x: event.clientX,
        y: event.clientY
      }
    }

    setVertexLocations(location)
  }
}

const Circle = ({ x, y, index, id, setIsMouseDown, setCursorX, setCursorY, draggedVertexId, setDraggedVertxId }) => {
  return (
    <circle
      key={index}
      cx={x}
      cy={y}
      fill="blue"
      strokeWidth="3"
      stroke="black"
      r="20"
      draggable
      onMouseDown={event => handleMouseDown({ id, setDraggedVertxId })}
      onMouseUp={event => handleMouseUp({ setDraggedVertxId })}
    />
  )
}

const getDefaultVertexLocations = () => {
  const locations = {}

  vertices.forEach(vertex => {
    locations[vertex.id] = { x: vertex.x, y: vertex.y }
  })

  return locations
}

const App = props => {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)
  const [draggedVertexId, setDraggedVertxId] = useState(null)

  const defaultVertexLocations = getDefaultVertexLocations()
  const [vertexLocations, setVertexLocations] = useState(defaultVertexLocations)

  return (
    <>
      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        onMouseMove={event => handleMouseMove({ event, setCursorX, setCursorY, setDraggedVertxId, draggedVertexId, setVertexLocations, vertexLocations })}
        onMouseUp={event => handleMouseUp({ setDraggedVertxId })}
      >
        {
          edges.map((edge, index) => renderLine(edge, index))
        }

        {
          vertices.map((vertex, index) => {
            return (
              <Circle
                id={vertex.id}
                // x={vertex.x}
                x={vertexLocations[vertex.id].x}
                // y={vertex.y}
                y={vertexLocations[vertex.id].y}
                index={index}
                setIsMouseDown={setIsMouseDown}
                setCursorX={setCursorX}
                setCursorY={setCursorY}
                draggedVertexId={draggedVertexId}
                setDraggedVertxId={setDraggedVertxId}
              />
            )
          })
        }
      </svg>
      <div>{cursorX}, {cursorY}</div>
      <div>{draggedVertexId}</div>
    </>
  )
}

export { App }
