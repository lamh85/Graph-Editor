import React, { useState } from "react"
import styled from 'styled-components'
import { hot } from "react-hot-loader"

import { DEFAULT_EDGES, DEFAULT_VERTICES } from '../datasets/polygons'

const SVG_HEIGHT = 500
const SVG_WIDTH = 750

const Row = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`

const renderLine = ({ lineVertices, index, vertices }) => {
  const vertex0 = vertices[lineVertices[0]]
  const vertex1 = vertices[lineVertices[1]]

  if (!vertex0 || !vertex1) return null

  const { x: x1, y: y1 } = vertex0
  const { x: x2, y: y2 } = vertex1

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

const handleMouseMove = ({ event, setDraggedVertxId, draggedVertexId, vertices, setVertices }) => {
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
    <g
      onMouseDown={event => handleMouseDown({ id, setDraggedVertxId })}
      onMouseUp={event => handleMouseUp({ setDraggedVertxId })}
    >
      <circle
        key={index}
        cx={x}
        cy={y}
        fill="blue"
        strokeWidth="3"
        stroke="black"
        r="20"
      >
      </circle>
      <text x={x} y={y} fontSize="15" fill="yellow">{id}</text>
    </g>
  )
}

const getHighestObjectId = object => {
  const ids = Object.keys(object)
  return ids.reverse()[0]
}

const handleAddVertex = ({ vertices, setVertices }) => {
  const highestId = getHighestObjectId(vertices)
  const nextId = Number(highestId) + 1

  const newVertices = {
    ...vertices,
    [nextId]: { x: 20, y: 20 }
  }

  setVertices(newVertices)
}

const handleEdgeChange = ({ event, edges, edgeCorner, setEdges, edgeId, vertices }) => {
  const vertexIds = Object.keys(vertices).sort()

  const enteredValue = event.target.value

  let validatedValue
  if (vertexIds.includes(enteredValue)) {
    validatedValue = enteredValue
  } else {
    validatedValue = vertexIds[0]
  }

  const newEdgeValue = [...edges[edgeId]]
  newEdgeValue[edgeCorner] = validatedValue

  const newEdges = {
    ...edges,
    [edgeId]: newEdgeValue
  }

  setEdges(newEdges)
}

const handleAddEdge = ({ edges, setEdges }) => {
  const highestId = getHighestObjectId(edges)
  const newId = highestId + 1

  const newEdges = {
    ...edges,
    [newId]: [1, 1]
  }

  setEdges(newEdges)
}

const App = props => {
  const [draggedVertexId, setDraggedVertxId] = useState(null)

  const [vertices, setVertices] = useState(DEFAULT_VERTICES)

  const [edges, setEdges] = useState(DEFAULT_EDGES)

  return (
    <>
      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        onMouseMove={event => handleMouseMove({ event, setDraggedVertxId, draggedVertexId, setVertices, vertices })}
        onMouseUp={event => handleMouseUp({ setDraggedVertxId })}
      >
        {
          Object.keys(edges).map((edgeId, index) => {
            const edge = edges[edgeId]
            return renderLine({ lineVertices: edge, index, vertices })
          })
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
      <Row>
        <div>
          <div>Vertices:</div>
          {
            Object.keys(vertices).map(id => {
              return (
                <Row>
                  <div>{id}: {vertices[id].x}, {vertices[id].y}</div>
                  <button>Delete</button>
                </Row>
              )
            })
          }
          <button onClick={() => handleAddVertex({ vertices, setVertices })}>
            Add Vertex
          </button>
        </div>
        <div>
          <div>Edges:</div>
          {
            Object.keys(edges).map((edgeId, index) => {
              const edge = edges[edgeId]

              return (
                <div>
                  L{index}
                  <input
                    key={`${index}-0`}
                    type="number"
                    value={edge[0]}
                    onChange={event => handleEdgeChange({ event, edgeCorner: 0, edges, setEdges, edgeId, vertices })}
                  />
                  <input
                    key={`${index}-1`}
                    type="number"
                    value={edge[1]}
                    onChange={event => handleEdgeChange({ event, edgeCorner: 1, edges, setEdges, edgeId, vertices })}
                  />
                </div>
              )
            })
          }
          <button onClick={() => handleAddEdge({ edges, setEdges })}>
            Add Edge
          </button>
        </div>
      </Row>
    </>
  )
}

export { App }
