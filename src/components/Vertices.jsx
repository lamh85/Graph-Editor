import React from "react"
import styled from 'styled-components'
import {
  getUnconnectedVertices,
  getConnectedVertices
} from '../component_helpers/vertices'

const CircleInner = styled.circle`
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

const CircleGroup = ({
  index,
  x,
  y,
  radius,
  vertexId,
  setResizedVertexId,
  setDragCursorOrigin,
  setDraggedVertxId
}) => {
  return (
    <>
      <CircleOuter
        key={`outer-${index}`}
        cx={x}
        cy={y}
        fill="black"
        r={radius}
        onMouseDown={event => handleMouseDown({
          event,
          id: vertexId,
          setResizedVertexId,
          setDragCursorOrigin
        })}
      />
      <CircleInner
        key={`inner-${index}`}
        cx={x}
        cy={y}
        fill="red"
        r={radius - 5}
        onMouseDown={() => setDraggedVertxId(vertexId)}
      />
    </>
  )
}

const Rectangle = ({
  x,
  y,
  vertexId,
  setResizedVertexId,
  setDragCursorOrigin,
  setDraggedVertxId,
  height,
  width
}) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="red"
      onMouseDown={() => setDraggedVertxId(vertexId)}
    />
  )
}

const Vertex = ({
  vertex: { id, x, y, radius, height, width, shape },
  index,
  setDraggedVertxId,
  setResizedVertexId,
  renderContextMenu,
  vertices,
  edges,
  createEdge,
  deleteEdge,
  setDragCursorOrigin
}) => {
  const commonProps = {
    x,
    y,
    radius,
    vertexId: id,
    setResizedVertexId,
    setDragCursorOrigin,
    setDraggedVertxId
  }

  return (
    <g
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
      {shape === 'circle' && (
        <CircleGroup {...commonProps} index={index} radius={radius} />
      )}
      {shape === 'rectangle' && (
        <Rectangle {...commonProps} width={width} height={height} fill="red" />
      )}
      <text x={x} y={y} fontSize="15" fill="yellow">{id}</text>
    </g>
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
      <Vertex
        vertex={vertex}
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
