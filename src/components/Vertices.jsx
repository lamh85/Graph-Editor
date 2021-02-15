import React from "react"
import styled from 'styled-components'
import {
  getUnconnectedVertices,
  getConnectedVertices,
  vertexCircleProps,
  vertexRectangleProps
} from '../component_helpers/vertices'
import {
  cursorToCanvasCoordinates,
} from '../component_helpers/app'

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
  mouseDownHandler
}) => {
  return (
    <>
      <CircleOuter
        {...vertexCircleProps(vertex)}
        key={`outer-circle-${vertex.id}`}
        fill="black"
        onMouseDown={mouseDownHandler('resize')}
      />
      <CircleInner
        {...vertexCircleProps(vertex)}
        key={`inner-circle-${vertex.id}`}
        r={vertex.radius - 3}
        fill="red"
        onMouseDown={mouseDownHandler('move')}
      />
    </>
  )
}

const handleMouseDown = ({
  event,
  purpose,
  vertex,
  setDraggedVertxId,
  setResizedVertexId,
  setMouseDownOrigin,
  setMouseDownVertexOriginal
}) => {
  const setIdState = {
    move: setDraggedVertxId,
    resize: setResizedVertexId
  }[purpose]

  setIdState(vertex.id)
  setMouseDownVertexOriginal(vertex)

  const canvasCoordinates = cursorToCanvasCoordinates({
    cursorX: event.clientX,
    cursorY: event.clientY
  })

  setMouseDownOrigin({
    x: canvasCoordinates.x,
    y: canvasCoordinates.y
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
  setMouseDownOrigin,
  setMouseDownVertexOriginal
}) => {
  const { centreX, centreY } = vertex

  const mouseDownHandler = purpose => event => handleMouseDown({
    event,
    purpose,
    vertex,
    setDraggedVertxId,
    setResizedVertexId,
    setMouseDownOrigin,
    setMouseDownVertexOriginal
  })

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
          mouseDownHandler={mouseDownHandler}
        />
      )}
      {vertex.shape === 'rectangle' && (
        <Rectangle
          {...vertexRectangleProps(vertex)}
          key={`rectangle-${vertex.id}`}
          fill="red"
          onMouseDown={mouseDownHandler('move')}
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
  setMouseDownOrigin,
  setMouseDownVertexOriginal
}) => {
  return vertices.map(vertex => {
    return (
      <Vertex
        vertex={vertex}
        key={`vertex-g-${vertex.id}`}
        setDraggedVertxId={setDraggedVertxId}
        setResizedVertexId={setResizedVertexId}
        setMouseDownOrigin={setMouseDownOrigin}
        setMouseDownVertexOriginal={setMouseDownVertexOriginal}
        renderContextMenu={renderContextMenu}
        vertices={vertices}
        edges={edges}
        createEdge={createEdge}
        deleteEdge={deleteEdge}
      />
    )
  })
}
