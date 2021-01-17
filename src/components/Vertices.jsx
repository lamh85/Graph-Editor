import React from "react"
import styled from 'styled-components'
import { CIRCLE as CIRCLE_CONFIG } from '../geometry_helpers/shapes_config'

const CircleG = styled.g`
  cursor: pointer;
`

const getUnconnectedVertices = ({ vertexId, vertices, edges }) => {
  const vertexEdges = edges.filter(edge => {
    return edge.end0.vertexId === vertexId || edge.end1.vertexId === vertexId
  })

  const connectedVertices = []
  vertexEdges.forEach(edge => {
    connectedVertices.push(edge.end0.vertexId)
    connectedVertices.push(edge.end1.vertexId)
  })

  const allVertexIds = vertices.map(vertex => vertex.id)
  return allVertexIds.filter(id => {
    return !connectedVertices.includes(id) && id !== vertexId
  })
}

const handleConnectVerticesClick = ({ vertex1Id, vertex2Id, createEdge }) => {
  const newEdge = {
    end0: {
      vertexId: vertex1Id
    },
    end1: {
      vertexId: vertex2Id
    }
  }

  createEdge(newEdge)
}

const handleVertexContextClick = ({ vertexId, vertices, edges, createEdge, renderContextMenu, event }) => {
  event.preventDefault()
  event.stopPropagation()
  const unconnectedVertices = getUnconnectedVertices({ vertexId, vertices, edges })

  let menuItems
  if (!unconnectedVertices.length) {
    menuItems = [
      {
        display: 'No vertices to connect',
        onClick: () => {}
      }
    ]
  } else {
    menuItems = unconnectedVertices.map(unconnectedId => {
      return {
        display: `Connect to Vertex ${unconnectedId}`,
        onClick: () => handleConnectVerticesClick({
          vertex1Id: vertexId,
          vertex2Id: unconnectedId,
          createEdge
        })
      }
    })
  }

  renderContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: menuItems
  })
}

const handleMouseDown = ({ id, setDraggedVertxId }) => {
  setDraggedVertxId(id)
}

const Circle = ({
  x,
  y,
  index,
  id,
  setDraggedVertxId,
  renderContextMenu,
  vertices,
  edges,
  createEdge
}) => {
  return (
    <CircleG
      onMouseDown={() => handleMouseDown({ id, setDraggedVertxId })}
      onContextMenu={event => {
        return handleVertexContextClick({ vertexId: id, vertices, edges, createEdge, renderContextMenu, event })
      }}
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
    </CircleG>
  )
}

export const Vertices = ({
  vertices,
  edges,
  createEdge,
  setDraggedVertxId,
  renderContextMenu
}) => {
  return vertices.map((vertex, index) => {
    return (
      <Circle
        id={vertex.id}
        x={vertex.x}
        y={vertex.y}
        index={index}
        setDraggedVertxId={setDraggedVertxId}
        renderContextMenu={renderContextMenu}
        vertices={vertices}
        edges={edges}
        createEdge={createEdge}
      />
    )
  })
}
