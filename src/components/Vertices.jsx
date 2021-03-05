import React, { useState } from "react"
import styled from 'styled-components'
import {
  getUnconnectedVertices,
  getConnectedVertices,
  vertexRectangleProps
} from '../component_helpers/vertices'
import { vertexCircleProps } from '../helpers/dom'
import { getResizeCircleCursor } from '../geometry_helpers/general'

const moveCursorStyle = isMovingVertex => {
  const value = isMovingVertex ? 'move' : 'pointer'
  return `cursor: ${value};`
}

const CircleInner = styled.circle`
  ${props => moveCursorStyle(props.isMovingVertex)}
`

const CircleOuter = styled.circle`
  &:hover {
    cursor: ${props => props.resizeCursor};
  }
`

const Rectangle = styled.rect`
  ${props => moveCursorStyle(props.isMovingVertex)}
`

const SvgText = styled.text`
  ${props => moveCursorStyle(props.isMovingVertex)}
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
  resizeVertexService,
  onMouseDownResize,
  onMouseDownMove,
  isMovingVertex
}) => {
  const [resizeCursor, setResizeCursor] = useState()

  return (
    <>
      <CircleOuter
        {...vertexCircleProps(vertex)}
        key={`outer-circle-${vertex.id}`}
        fill="black"
        onMouseDown={onMouseDownResize}
        onMouseOver={event => {
          if (!!resizeVertexService.selectedVertex) return

          const cursorStyle = getResizeCircleCursor({
            vertexCentreX: vertex.centreX,
            vertexCentreY: vertex.centreY,
            cursorX: event.clientX,
            cursorY: event.clientY
          })
          setResizeCursor(cursorStyle)
        }}
        resizeCursor={resizeCursor}
      />
      <CircleInner
        {...vertexCircleProps(vertex)}
        key={`inner-circle-${vertex.id}`}
        r={vertex.radius - 3}
        fill="red"
        onMouseDown={onMouseDownMove}
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
  moveVertexService,
  resizeVertexService
}) => {
  const { centreX, centreY } = vertex

  const isMovingVertex = !!moveVertexService.selectedVertex
  const onMouseDownMove = event => moveVertexService.mouseDownListener({
    event,
    vertex
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
          onMouseDownResize={event => resizeVertexService.mouseDownListener({
            event,
            vertex
          })}
          resizeVertexService={resizeVertexService}
          onMouseDownMove={onMouseDownMove}
          isMovingVertex={isMovingVertex}
        />
      )}
      {vertex.shape === 'rectangle' && (
        <Rectangle
          {...vertexRectangleProps(vertex)}
          key={`rectangle-${vertex.id}`}
          fill="red"
          onMouseDown={onMouseDownMove}
          isMovingVertex={isMovingVertex}
        />
      )}
      <SvgText
        x={centreX}
        y={centreY}
        fontSize="15"
        fill="yellow"
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
  moveVertexService,
  resizeVertexService
}) => {
  return vertices.map(vertex => {
    return (
      <Vertex
        vertex={vertex}
        key={`vertex-g-${vertex.id}`}
        renderContextMenu={renderContextMenu}
        vertices={vertices}
        edges={edges}
        createEdge={createEdge}
        deleteEdge={deleteEdge}
        moveVertexService={moveVertexService}
        resizeVertexService={resizeVertexService}
      />
    )
  })
}
