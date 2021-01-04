import React, { useState, useEffect, useRef } from "react"
import styled from 'styled-components'
import { hot } from "react-hot-loader"

import { DEFAULT_VERTICES, DEFAULT_ARROWS } from '../models/polygons'
import { SEED as EDGES_SEED } from '../models/edge'
import { CIRCLE as CIRCLE_CONFIG } from '../geometry_helpers/shapes_config'
import { useArray } from '../hooks/useArray'
import { PositionWrapper } from './common/Wrappers.jsx'
import Arrows from './Arrows.jsx'
import { Editor } from './Editor.jsx'

const SVG_HEIGHT = 500
const SVG_WIDTH = 750

const StyledSvg = styled.svg`
  background: lightgrey;
`

const CircleG = styled.g`
  cursor: pointer;
`

const ContextMenu = styled.div`
  height: 100px;
  width: 100px;
  background: white;
  position: absolute;
  left: ${props => props.left || 0}px;
  top: ${props => props.top || 0}px
`

const getVertexById = ({ vertices, id }) => {
  return vertices.find(vertex => vertex.id === id)
}

const renderEdge = ({ edge, index, vertices }) => {
  const vertexId1 = edge.end0.vertexId
  const vertexId2 = edge.end1.vertexId

  const vertex1 = getVertexById({ vertices, id: vertexId1 })
  const vertex2 = getVertexById({ vertices, id: vertexId2 })

  if (!vertex1 || !vertex2) return null

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

const doesExceedBoundaries = ({ x, y }) => x > SVG_WIDTH || y > SVG_HEIGHT

const handleMouseMove = ({ event, setDraggedVertxId, draggedVertexId, updateVertex }) => {
  if (doesExceedBoundaries({ x: event.clientX, y: event.clientY })) {
    setDraggedVertxId(null)
  }

  if (draggedVertexId) {
    updateVertex({
      id: draggedVertexId,
      propertySet: {
        x: event.clientX,
        y: event.clientY
      }
    })
  }
}

const handleContextClick = ({
  event,
  setIsContextMenuOpen,
  setContextMenuLocation
}) => {
  event.preventDefault()

  setIsContextMenuOpen(true)
  setContextMenuLocation({
    x: event.clientX,
    y: event.clientY
  })
}

const Circle = ({
  x,
  y,
  index,
  id,
  setDraggedVertxId
}) => {
  return (
    <CircleG
      onMouseDown={event => handleMouseDown({ id, setDraggedVertxId })}
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

const handleDocumentClick = ({ event, contextMenuNode, setIsContextMenuOpen }) => {
  if (!Object.is(contextMenuNode.current, event.target)) {
    setIsContextMenuOpen(false)
  }
}

const App = props => {
  useEffect(() => {
    const mouseDownParams = [
      'mousedown',
      event => handleDocumentClick({
        event,
        contextMenuNode,
        setIsContextMenuOpen
      })
    ]

    document.addEventListener(...mouseDownParams)

    return () => {
      document.removeEventListener(...mouseDownParams)
    }
  }, [])

  const contextMenuNode = useRef()
  const [draggedVertexId, setDraggedVertxId] = useState(null)
  const [edges, setEdges] = useState(EDGES_SEED)
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  const [contextMenuLocation, setContextMenuLocation] = useState({})

  const {
    state: vertices,
    find: findVertex,
    push: createVertex,
    removeByProperty: deleteVertex,
    updateItem: updateVertex
  } = useArray(DEFAULT_VERTICES)

  const {
    state: arrows,
    push: createArrow,
    removeByProperty: deleteArrow,
    updateItem: updateArrow
  } = useArray(DEFAULT_ARROWS)

  return (
    <>
      <PositionWrapper>
        <StyledSvg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          onMouseMove={
            event => handleMouseMove({ event, setDraggedVertxId, draggedVertexId, updateVertex })
          }
          onMouseUp={() => setDraggedVertxId(null)}
          onContextMenu={event => handleContextClick({
            event,
            setIsContextMenuOpen,
            setContextMenuLocation
          })}
        >
          {
            edges.map((edge, index) => {
              return renderEdge({ edge, index, vertices, arrows })
            })
          }
          <Arrows arrows={arrows} edges={edges} vertices={vertices} />
          {
            vertices.map((vertex, index) => {
              return (
                <Circle
                  id={vertex.id}
                  x={vertex.x}
                  y={vertex.y}
                  index={index}
                  setDraggedVertxId={setDraggedVertxId}
                />
              )
            })
          }
        </StyledSvg>
        {isContextMenuOpen && (
          <ContextMenu
            ref={contextMenuNode}
            left={contextMenuLocation.x}
            top={contextMenuLocation.y}
          >
            blah
          </ContextMenu>
        )}
      </PositionWrapper>
      <Editor
        vertices={vertices}
        createVertex={createVertex}
        deleteVertex={deleteVertex}
        edges={edges}
        setEdges={setEdges}
        arrows={arrows}
        createArrow={createArrow}
        deleteArrow={deleteArrow}
        updateArrow={updateArrow}
      />
    </>
  )
}

export { App }
