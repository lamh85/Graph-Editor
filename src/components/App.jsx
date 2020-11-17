import React, { useState } from "react"
import { hot } from "react-hot-loader"

const SVG_HEIGHT = 500
const SVG_WIDTH = 1000

const vertices = [
  { id: 1, x: 40, y: 40 },
  { id: 2, x: 200, y: 40 },
  { id: 3, x: 200, y: 200 }
]

const edges = [
  [1, 2],
  [2, 3],
  [3, 1]
]

const renderLine = ({vertices, index, vertexLocations}) => {
  const attributes = {
    x1: vertexLocations[vertices[0]].x,
    y1: vertexLocations[vertices[0]].y,
    x2: vertexLocations[vertices[1]].x,
    y2: vertexLocations[vertices[1]].y,
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

const doesExceedBoundaries = ({ x, y }) => x > SVG_WIDTH || y > SVG_HEIGHT

const handleMouseMove = ({ event, setCursorX, setCursorY, setDraggedVertxId, draggedVertexId, vertexLocations, setVertexLocations }) => {
  setCursorX(event.clientX)
  setCursorY(event.clientY)

  if (doesExceedBoundaries({ x: event.clientX, y: event.clientY })) {
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

const Circle = ({
  x,
  y,
  index,
  id,
  setDraggedVertxId
}) => {
  return (
    <g>
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
      >
      </circle>
      <text x={x} y={y} fontSize="15" fill="yellow">{id}</text>
    </g>
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
          edges.map((vertices, index) => renderLine({vertices, index, vertexLocations}))
        }

        {
          vertices.map((vertex, index) => {
            return (
              <Circle
                id={vertex.id}
                x={vertexLocations[vertex.id].x}
                y={vertexLocations[vertex.id].y}
                index={index}
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
