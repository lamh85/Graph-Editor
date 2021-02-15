import React from "react"
import styled from 'styled-components'
import {
  getUnconnectedVertices,
  getConnectedVertices,
  vertexCircleProps,
  vertexRectangleProps
} from '../component_helpers/vertices'

const CircleInner = styled.circle`
  cursor: pointer;
`

const CircleOuter = styled.circle`
  &:hover {
    cursor: col-resize;
  }
`

const Rectangle = styled.rect`
  cursor: pointer;
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

const CircleGroup = ({
  vertex,
  setResizedVertexId,
  setMouseDownOrigin,
  setDraggedVertxId
}) => {
  return (
    <>
      <CircleOuter
        {...vertexCircleProps(vertex)}
        key={`outer-circle-${vertex.id}`}
        fill="black"
        onMouseDown={event => handleMouseDown({
          event,
          purpose: 'resize',
          vertexId: vertex.id,
          setDraggedVertxId,
          setResizedVertexId,
          setMouseDownOrigin
        })}
      />
      <CircleInner
        {...vertexCircleProps(vertex)}
        key={`inner-circle-${vertex.id}`}
        r={vertex.radius - 3}
        fill="red"
        onMouseDown={event => handleMouseDown({
          event,
          purpose: 'move',
          vertexId: vertex.id,
          setDraggedVertxId,
          setResizedVertexId,
          setMouseDownOrigin
        })}
      />
    </>
  )
}

const handleMouseDown = ({
  event,
  purpose,
  vertexId,
  setDraggedVertxId,
  setResizedVertexId,
  setMouseDownOrigin
}) => {
  const setIdState = {
    move: setDraggedVertxId,
    resize: setResizedVertexId
  }[purpose]

  setIdState(vertexId)


  setMouseDownOrigin({
    x: event.clientX,
    y: event.clientY
  })
}

const Vertex = ({
  vertex,
  setDraggedVertxId,
  setResizedVertexId,
  renderContextMenu,
  vertices,
  edges,
  createEdge,
  deleteEdge,
  setMouseDownOrigin
}) => {
  const { centreX, centreY } = vertex

  return (
    <g
      onContextMenu={event => {
        return handleVertexContextClick({
          vertexId: vertex.id,
          vertices,
          edges,
          createEdge,
          renderContextMenu,
          event,
          deleteEdge
        })
      }}
    >
      {vertex.shape === 'circle' && (
        <CircleGroup
          vertex={vertex}
          setResizedVertexId={setResizedVertexId}
          setMouseDownOrigin={setMouseDownOrigin}
          setDraggedVertxId={setDraggedVertxId}
        />
      )}
      {vertex.shape === 'rectangle' && (
        <Rectangle
          {...vertexRectangleProps(vertex)}
          key={`rectangle-${vertex.id}`}
          fill="red"
          onMouseDown={() => setDraggedVertxId(vertex.id)}
        />
      )}
      <text x={centreX} y={centreY} fontSize="15" fill="yellow">{vertex.id}</text>
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
  setMouseDownOrigin
}) => {
  return vertices.map(vertex => {
    return (
      <Vertex
        vertex={vertex}
        key={`vertex-g-${vertex.id}`}
        setDraggedVertxId={setDraggedVertxId}
        setResizedVertexId={setResizedVertexId}
        setMouseDownOrigin={setMouseDownOrigin}
        renderContextMenu={renderContextMenu}
        vertices={vertices}
        edges={edges}
        createEdge={createEdge}
        deleteEdge={deleteEdge}
      />
    )
  })
}
