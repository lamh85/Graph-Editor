import React, { useState } from "react"
import { hot } from "react-hot-loader"

const SVG_HEIGHT = 500
const SVG_WIDTH = 750

const renderLine = ({ lineVertices, index, vertices }) => {
  if (index === 3) {
    console.log(lineVertices)
    console.log(vertices)
  }

  const { x: x1, y: y1 } = vertices[lineVertices[0]]
  const { x: x2, y: y2 } = vertices[lineVertices[1]]

  const lineProps = {
    x1,
    y1,
    x2,
    y2,
    stroke: 'red',
    strokeWidth: 2,
    key: index
  }

  const averageX = (x1 + x2) / 2
  const averageY = (y1 + y2) / 2

  return (
    <g>
      <line {...lineProps} />
      <text x={averageX} y={averageY} fontSize="15" fill="black">L{index}</text>
    </g>
  )
}

const handleMouseDown = ({ id, setDraggedVertxId }) => {
  setDraggedVertxId(id)
}

const handleMouseUp = ({ setDraggedVertxId }) => {
  setDraggedVertxId(null)
}

const doesExceedBoundaries = ({ x, y }) => x > SVG_WIDTH || y > SVG_HEIGHT

const handleMouseMove = ({ event, setCursorX, setCursorY, setDraggedVertxId, draggedVertexId, vertices, setVertices }) => {
  setCursorX(event.clientX)
  setCursorY(event.clientY)

  if (doesExceedBoundaries({ x: event.clientX, y: event.clientY })) {
    setDraggedVertxId(null)
  }

  if (draggedVertexId) {
    const location = {
      ...vertices,
      [draggedVertexId]: {
        x: event.clientX,
        y: event.clientY
      }
    }

    setVertices(location)
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

const getDefaultVertices = () => {
  const vertices = [
    { id: 1, x: 40, y: 40 },
    { id: 2, x: 200, y: 40 },
    { id: 3, x: 200, y: 200 }
  ]

  const locations = {}

  vertices.forEach(vertex => {
    locations[vertex.id] = { x: vertex.x, y: vertex.y }
  })

  return locations
}

const DEFAULT_EDGES = [
  [1, 2],
  [2, 3],
  [3, 1]
]

const getHighestVertexId = vertices => {
  const ids = Object.keys(vertices)
  return ids.reverse()[0]
}

const handleAddVertex = ({ vertices, setVertices }) => {
  const highestId = getHighestVertexId(vertices)
  const nextId = Number(highestId) + 1

  const newVertices = {
    ...vertices,
    [nextId]: { x: 20, y: 20 }
  }

  setVertices(newVertices)
}

const handleEdgeChange = ({ event, edges, edgeCorner, setEdges, edgeIndex, vertices }) => {
  const highestVertexId = getHighestVertexId(vertices)
  if (event.target.value > highestVertexId) return

  const newEdges = [...edges]
  newEdges[edgeIndex][edgeCorner] = event.target.value
  setEdges(newEdges)
}

const handleAddEdge = ({ edges, setEdges }) => {
  const newEdges = [
    ...edges,
    [1, 1]
  ]

  setEdges(newEdges)
}

const App = props => {
  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)
  const [draggedVertexId, setDraggedVertxId] = useState(null)

  const defaultVertexLocations = getDefaultVertices()
  const [vertices, setVertices] = useState(defaultVertexLocations)

  const [edges, setEdges] = useState(DEFAULT_EDGES)

  return (
    <>
      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        onMouseMove={event => handleMouseMove({ event, setCursorX, setCursorY, setDraggedVertxId, draggedVertexId, setVertices, vertices })}
        onMouseUp={event => handleMouseUp({ setDraggedVertxId })}
      >
        {
          edges.map((lineVertices, index) => renderLine({ lineVertices, index, vertices }))
        }

        {
          Object.keys(vertices).map((vertexId, index) => {
            return (
              <Circle
                id={vertexId}
                x={vertices[vertexId].x}
                y={vertices[vertexId].y}
                index={index}
                setDraggedVertxId={setDraggedVertxId}
              />
            )
          })
        }
      </svg>
      <div>
        <div>Vertices:</div>
        {
          Object.keys(vertices).map(id => {
            return <div>{id}: {vertices[id].x}, {vertices[id].y}</div>
          })
        }
        <button onClick={() => handleAddVertex({ vertices, setVertices })}>
          Add Vertex
        </button>
        <div>Edges:</div>
        {
          edges.map((edge, index) => {
            return (
              <div>
                L{index}
                <input
                  type="number"
                  value={edge[0]}
                  onChange={event => handleEdgeChange({ event, edgeCorner: 0, edges, setEdges, edgeIndex: index, vertices })}
                />
                <input
                  type="number"
                  value={edge[1]}
                  onChange={event => handleEdgeChange({ event, edgeCorner: 1, edges, setEdges, edgeIndex: index, vertices })}
                />
              </div>
            )
          })
        }
        <button onClick={() => handleAddEdge({ edges, setEdges })}>
          Add Edge
        </button>
      </div>
    </>
  )
}

export { App }
