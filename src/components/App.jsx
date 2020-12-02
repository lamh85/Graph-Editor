import React, { useState } from "react"
import styled from 'styled-components'
import { hot } from "react-hot-loader"

import { DEFAULT_EDGES, DEFAULT_VERTICES } from '../datasets/polygons'
import { handleAddVertex, handleDeleteVertex } from '../state_interfaces/polygons'
import { getVertexTangent } from '../geometry_helpers/get_vertex_tangent'
import { CIRCLE as CIRCLE_CONFIG } from '../geometry_helpers/shapes_config'

const SVG_HEIGHT = 500
const SVG_WIDTH = 750

const Row = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`

const getVertexById = ({ vertices, id }) => vertices[id]

const renderEdge = ({ edge, index, vertices }) => {
  const vertexId1 = edge.end0.vertexId
  const vertexId2 = edge.end1.vertexId

  const vertex1 = getVertexById({ vertices, id: vertexId1 })
  const vertex2 = getVertexById({ vertices, id: vertexId2 })

  if (!vertex1 || !vertex2) return null

  if (vertexId1 === 1 && vertexId2 === 2) {
    console.log('=====================')
    console.log(getVertexTangent({ vertex1, vertex2 }))
  }

  const { x: x1, y: y1 } = vertex1
  const { x: x2, y: y2 } = vertex2

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
        r={CIRCLE_CONFIG.radius}
      >
      </circle>
      <text x={x} y={y} fontSize="15" fill="yellow">{id}</text>
    </g>
  )
}

const handleEdgeChange = ({ event, edges, endProperty, setEdges, edgeId, vertices }) => {
  const newEdges = [...edges]
  const edgeIndex = edges.findIndex(edge => edge.id === edgeId)
  const editedEdge = newEdges[edgeIndex]
  editedEdge[endProperty].vertexId = event.target.value
  newEdges[edgeIndex] = editedEdge

  setEdges(newEdges)
}

const handleAddEdge = ({ edges, setEdges }) => {
  const edgeIds = edges.map(edge => edge.id)
  const highestId = edgeIds.reverse()[0]
  const newId = highestId + 1

  const newEdges = [...edges]
  const newEdge = {
    ...edges.reverse()[0],
    id: newId,
    end0: {
      ...edges.reverse()[0].end0,
      vertexId: null
    },
    end1: {
      ...edges.reverse()[0].end1,
      vertexId: null
    }
  }
  newEdges.push(newEdge)

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
          edges.map((edge, index) => {
            return renderEdge({ edge, index, vertices })
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
          <h1>Vertices</h1>
          {
            Object.keys(vertices).map(id => {
              return (
                <Row>
                  <div>{id}:: X: {vertices[id].x}, Y: {vertices[id].y}</div>
                  <button onClick={() => handleDeleteVertex({ id, vertices, setVertices })}>Delete</button>
                </Row>
              )
            })
          }
          <button onClick={() => handleAddVertex({ vertices, setVertices })}>
            Add Vertex
          </button>
        </div>
        <div>
          <h1>Edges</h1>
          {
            edges.map((edge, index) => {
              return (
                <div>
                  L{index}
                  <input
                    key={`${index}-0`}
                    type="number"
                    value={edge.end0.vertexId}
                    onChange={event => handleEdgeChange({
                      event,
                      endProperty: 'end0',
                      edges,
                      edgeId: edge.id,
                      setEdges,
                      vertices
                    })}
                  />
                  <input
                    key={`${index}-1`}
                    type="number"
                    value={edge.end1.vertexId}
                    onChange={event => handleEdgeChange({
                      event,
                      endProperty: 'end1',
                      edges,
                      edgeId: edge.id,
                      setEdges,
                      vertices
                    })}
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
