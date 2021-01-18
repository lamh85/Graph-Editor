import React from "react"
import styled from 'styled-components'
import { CIRCLE as CIRCLE_CONFIG } from '../geometry_helpers/shapes_config'
import {
  getUnconnectedVertices,
  getConnectedVertices
} from '../data_analyses/elements'

const CircleGroup = styled.g`
  cursor: pointer;
`

const CircleOuter = styled.circle`
  &:hover {
    cursor: col-resize;
  }
`

const handleConnectVertexClick = ({ vertex1Id, vertex2Id, createEdge }) => {
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

const handleDisconnectVertexClick = ({
  vertex1Id,
  vertex2Id,
  edges,
  deleteEdge
}) => {
  const connectionEdge = edges.find(edge => {
    const {
      end0: { vertexId: connectedVertex1 },
      end1: { vertexId: connectedVertex2 },
    } = edge

    const connectedVertices = [connectedVertex1, connectedVertex2].sort().join(',')
    const queryVertices = [vertex1Id, vertex2Id].sort().join(',')

    return connectedVertices === queryVertices
  })

  deleteEdge('id', connectionEdge.id)
}

const handleVertexContextClick = ({
  vertexId,
  vertices,
  edges,
  createEdge,
  renderContextMenu,
  event,
  deleteEdge
}) => {
  event.preventDefault()
  event.stopPropagation()
  const unconnectedVertices = getUnconnectedVertices({ vertexId, vertices, edges })

  const connectedVertices = getConnectedVertices(vertexId, edges)

  const menuItems = [
    ...unconnectedVertices.map(unconnectedId => {
      return {
        display: `Connect to Vertex ${unconnectedId}`,
        onClick: () => handleConnectVertexClick({
          vertex1Id: vertexId,
          vertex2Id: unconnectedId,
          createEdge
        })
      }
    }),
    ...connectedVertices.map(connectedId => {
      return {
        display: `DISCONNECT from Vertex ${connectedId}`,
        onClick: () => handleDisconnectVertexClick({
          vertex1Id: vertexId,
          vertex2Id: connectedId,
          edges,
          deleteEdge
        })
      }
    })
  ]

  renderContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: menuItems
  })
}

const handleMouseDown = ({
  event,
  id,
  setResizedVertexId,
  setDragCursorOrigin
}) => {
  setResizedVertexId(id)
  const { clientX: x, clientY: y } = event
  setDragCursorOrigin({ x, y })
}

const Circle = ({
  x,
  y,
  radius,
  index,
  id,
  setDraggedVertxId,
  setResizedVertexId,
  renderContextMenu,
  vertices,
  edges,
  createEdge,
  deleteEdge,
  setDragCursorOrigin
}) => {
  return (
    <CircleGroup
      onContextMenu={event => {
        return handleVertexContextClick({
          vertexId: id,
          vertices,
          edges,
          createEdge,
          renderContextMenu,
          event,
          deleteEdge
        })
      }}
    >
      <CircleOuter
        key={`outer-${index}`}
        cx={x}
        cy={y}
        fill="black"
        r={radius}
        onMouseDown={event => handleMouseDown({
          event,
          id,
          setResizedVertexId,
          setDragCursorOrigin
        })}
      />
      <circle
        key={`inner-${index}`}
        cx={x}
        cy={y}
        fill="red"
        r={radius - 5}
        onMouseDown={() => setDraggedVertxId(id)}
      />
      <text x={x} y={y} fontSize="15" fill="yellow">{id}</text>
    </CircleGroup>
  )
}

export const Vertices = ({
  vertices,
  edges,
  createEdge,
  deleteEdge,
  setDraggedVertxId,
  setResizedVertexId,
  renderContextMenu,
  setDragCursorOrigin
}) => {
  return vertices.map((vertex, index) => {
    return (
      <Circle
        id={vertex.id}
        x={vertex.x}
        y={vertex.y}
        radius={vertex.radius}
        index={index}
        setDraggedVertxId={setDraggedVertxId}
        setResizedVertexId={setResizedVertexId}
        setDragCursorOrigin={setDragCursorOrigin}
        renderContextMenu={renderContextMenu}
        vertices={vertices}
        edges={edges}
        createEdge={createEdge}
        deleteEdge={deleteEdge}
      />
    )
  })
}
