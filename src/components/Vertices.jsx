import React from "react"
import styled from 'styled-components'
import {
  getUnconnectedVertices,
  getConnectedVertices,
  vertexCircleProps,
  vertexRectangleProps
} from '../component_helpers/vertices'

const moveCursorStyle = isMovingVertex => {
  const value = isMovingVertex ? 'move' : 'pointer'
  return `cursor: ${value};`
}

const CircleInner = styled.circle`
  ${props => moveCursorStyle(props.isMovingVertex)}
`

const CircleOuter = styled.circle`
  &:hover {
    cursor: col-resize;
  }
`

const Rectangle = styled.rect`
  ${props => moveCursorStyle(props.isMovingVertex)}
`

const SvgText = styled.text`
  ${props => moveCursorStyle(props.isMovingVertex)}
  user-select: none;
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
  resizeVertexHandler,
  moveVertexHandler,
  isMovingVertex
}) => {
  return (
    <>
      <CircleOuter
        {...vertexCircleProps(vertex)}
        key={`outer-circle-${vertex.id}`}
        fill="black"
        onMouseDown={resizeVertexHandler}
      />
      <CircleInner
        {...vertexCircleProps(vertex)}
        key={`inner-circle-${vertex.id}`}
        r={vertex.radius - 3}
        fill="red"
        onMouseDown={moveVertexHandler}
        isMovingVertex={isMovingVertex}
      />
    </>
  )
}

const Vertex = ({
  vertex,
  renderContextMenu,
  vertices,
  edges,
  createEdge,
  deleteEdge,
  handleVertexMouseDown,
  isMovingVertex
}) => {
  const { centreX, centreY } = vertex

  const getMouseMoveHandler =
    objective =>
    event => handleVertexMouseDown({
      vertex,
      event,
      requestedObjective: objective
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
          moveVertexHandler={getMouseMoveHandler('move')}
          resizeVertexHandler={getMouseMoveHandler('resize')}
          isMovingVertex={isMovingVertex}
        />
      )}
      {vertex.shape === 'rectangle' && (
        <Rectangle
          {...vertexRectangleProps(vertex)}
          key={`rectangle-${vertex.id}`}
          fill="red"
          onMouseDown={getMouseMoveHandler('move')}
          isMovingVertex={isMovingVertex}
        />
      )}
      <SvgText
        x={centreX}
        y={centreY}
        fontSize="15"
        fill="yellow"
        onMouseDown={getMouseMoveHandler('move')}
        isMovingVertex={isMovingVertex}>
        {vertex.id}
      </SvgText>
    </g>
  )
}

export const Vertices = ({
  vertices,
  edges,
  createEdge,
  deleteEdge,
  renderContextMenu,
  handleVertexMouseDown,
  isMovingVertex
}) => {
  return vertices.map(vertex => {
    return (
      <Vertex
        vertex={vertex}
        key={`vertex-g-${vertex.id}`}
        handleVertexMouseDown={handleVertexMouseDown}
        renderContextMenu={renderContextMenu}
        vertices={vertices}
        edges={edges}
        createEdge={createEdge}
        deleteEdge={deleteEdge}
        isMovingVertex={isMovingVertex}
      />
    )
  })
}
