import React, { useState } from 'react'
import styled from 'styled-components'
import {
  getUnconnectedVertices,
  getConnectedVertices,
  vertexRectangleProps,
} from '../../component_helpers/vertices'
import { vertexCircleProps } from '../../helpers/dom'
import { getResizeCircleCursor } from '../../geometry_helpers/general'

const moveCursorStyle = (props) => {
  const { areVerticesMouseEditable, isMovingVertex } = props

  if (!areVerticesMouseEditable) return ''

  let value = 'pointer'
  if (isMovingVertex) value = 'move'

  return `cursor: ${value};`
}

const CircleInner = styled.circle`
  ${(props) => moveCursorStyle(props)}
`

const CircleOuter = styled.circle`
  ${(props) =>
    props.resizeCursor &&
    props.areVerticesMouseEditable &&
    `
    cursor: ${props.resizeCursor};
  `}
`

const Rectangle = styled.rect`
  ${(props) => moveCursorStyle(props)}
`

const SvgText = styled.text`
  ${(props) => moveCursorStyle(props.isMovingVertex)}
`

const handleConnectVertexClick = ({ vertex1Id, vertex2Id, createEdge }) => {
  const newEdge = {
    end0: {
      vertexId: vertex1Id,
    },
    end1: {
      vertexId: vertex2Id,
    },
  }

  createEdge(newEdge)
}

const handleDisconnectVertexClick = ({
  vertex1Id,
  vertex2Id,
  edges,
  deleteEdge,
}) => {
  const connectionEdge = edges.find((edge) => {
    const {
      end0: { vertexId: connectedVertex1 },
      end1: { vertexId: connectedVertex2 },
    } = edge

    const connectedVertices = [connectedVertex1, connectedVertex2]
      .sort()
      .join(',')
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
  deleteEdge,
}) => {
  event.preventDefault()
  event.stopPropagation()
  const unconnectedVertices = getUnconnectedVertices({
    vertexId,
    vertices,
    edges,
  })

  const connectedVertices = getConnectedVertices(vertexId, edges)

  const menuItems = [
    ...unconnectedVertices.map((unconnectedId) => {
      return {
        display: `Connect to Vertex ${unconnectedId}`,
        onClick: () =>
          handleConnectVertexClick({
            vertex1Id: vertexId,
            vertex2Id: unconnectedId,
            createEdge,
          }),
      }
    }),
    ...connectedVertices.map((connectedId) => {
      return {
        display: `DISCONNECT from Vertex ${connectedId}`,
        onClick: () =>
          handleDisconnectVertexClick({
            vertex1Id: vertexId,
            vertex2Id: connectedId,
            edges,
            deleteEdge,
          }),
      }
    }),
  ]

  renderContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: menuItems,
  })
}

const CircleGroup = ({
  vertex,
  drawingTools,
  isMovingVertex,
  areVerticesMouseEditable,
}) => {
  const [resizeCursor, setResizeCursor] = useState()

  return (
    <>
      <CircleOuter
        {...vertexCircleProps(vertex)}
        key={`outer-circle-${vertex.id}`}
        fill="black"
        onMouseDown={(event) =>
          drawingTools.handleMouseDownCanvas(event, { tool: 'RESIZE', vertex })
        }
        onMouseOver={(event) => {
          if (drawingTools.vertexSelected) return

          const cursorStyle = getResizeCircleCursor({
            vertexCentreX: vertex.centreX,
            vertexCentreY: vertex.centreY,
            cursorX: event.clientX,
            cursorY: event.clientY,
          })
          setResizeCursor(cursorStyle)
        }}
        resizeCursor={resizeCursor}
        areVerticesMouseEditable={areVerticesMouseEditable}
      />
      <CircleInner
        {...vertexCircleProps(vertex)}
        key={`inner-circle-${vertex.id}`}
        r={vertex.radius - 3}
        fill="red"
        onMouseDown={(event) =>
          drawingTools.handleMouseDownCanvas(event, { tool: 'MOVE', vertex })
        }
        isMovingVertex={isMovingVertex}
        areVerticesMouseEditable={areVerticesMouseEditable}
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
  areVerticesMouseEditable,
  drawingTools,
}) => {
  const { centreX, centreY } = vertex

  const isMovingVertex = drawingTools.isToolSelected('MOVE')

  return (
    <g
      onContextMenu={(event) => {
        return handleVertexContextClick({
          vertexId: vertex.id,
          vertices,
          edges,
          createEdge,
          renderContextMenu,
          event,
          deleteEdge,
        })
      }}
    >
      {vertex.shape === 'circle' && (
        <CircleGroup
          vertex={vertex}
          drawingTools={drawingTools}
          isMovingVertex={isMovingVertex}
          areVerticesMouseEditable={areVerticesMouseEditable}
        />
      )}
      {vertex.shape === 'rectangle' && (
        <Rectangle
          {...vertexRectangleProps(vertex)}
          key={`rectangle-${vertex.id}`}
          fill="red"
          onMouseDown={(event) =>
            drawingTools.handleMouseDownCanvas(event, { tool: 'MOVE', vertex })
          }
          isMovingVertex={isMovingVertex}
          areVerticesMouseEditable={areVerticesMouseEditable}
        />
      )}
      <SvgText
        x={centreX}
        y={centreY}
        fontSize="15"
        fill="yellow"
        isMovingVertex={isMovingVertex}
      >
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
  areVerticesMouseEditable,
  drawingTools,
}) => {
  return vertices.map((vertex) => {
    return (
      <Vertex
        vertex={vertex}
        key={`vertex-g-${vertex.id}`}
        renderContextMenu={renderContextMenu}
        vertices={vertices}
        edges={edges}
        createEdge={createEdge}
        deleteEdge={deleteEdge}
        drawingTools={drawingTools}
        areVerticesMouseEditable={areVerticesMouseEditable}
      />
    )
  })
}
