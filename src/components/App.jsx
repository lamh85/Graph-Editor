import React, { useState, useEffect, useRef } from "react"
import styled from 'styled-components'
import { hot } from "react-hot-loader"

import { DEFAULT_VERTICES, DEFAULT_ARROWS } from '../models/polygons'
import { SEED as EDGES_SEED } from '../models/edge'
import { doShareLineage } from '../dom_helpers/lineage'
import { useArray } from '../hooks/useArray'
import { useContextMenu } from '../hooks/useContextMenu'
import { PositionWrapper } from './common/Wrappers.jsx'
import { Grid } from './Grid.jsx'
import { Vertices } from './Vertices.jsx'
import Arrows from './Arrows.jsx'
import { Editor } from './Editor.jsx'
import { ContextMenu } from './ContextMenu.jsx'
import { getDistance } from "../geometry_helpers/general"
import { getHypotenuseLength } from '../geometry_helpers/trigonometry'

const SVG_HEIGHT = 500
const SVG_WIDTH = 750

const StyledSvg = styled.svg`
  background: lightgrey;
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
      <text x={averageX} y={averageY} fontSize="15" fill="black">Edge {edge.id}</text>
    </g>
  )
}

const doesExceedBoundaries = ({ x, y }) => x > SVG_WIDTH || y > SVG_HEIGHT

const handleMouseup = ({ setDraggedVertxId, setResizedVertexId }) => {
  setDraggedVertxId(null)
  setResizedVertexId(null)
}

const handleMouseMove = ({
  event,
  draggedVertexId,
  setDraggedVertxId,
  resizedVertexId,
  setResizedVertexId,
  updateVertex,
  findVertex
}) => {
  if (doesExceedBoundaries({ x: event.clientX, y: event.clientY })) {
    setDraggedVertxId(null)
    setResizedVertexId(null)
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

  if (resizedVertexId) {
    const vertex = findVertex(resizedVertexId)

    const {
      height: cursorFromVertexY,
      width: cursorFromVertexX
    } = getDistance({
      origin: vertex,
      destination: {
        x: event.clientX,
        y: event.clientY
      }
    })

    const cursorFromVertexHyp = getHypotenuseLength({
      adjacent: cursorFromVertexY,
      opposite: cursorFromVertexX
    })

    updateVertex({
      id: resizedVertexId,
      property: 'radius',
      value: cursorFromVertexHyp
    })
  }
}

const handleContextClick = ({
  event,
  renderContextMenu,
  createVertex
}) => {
  event.preventDefault()

  const coordinates = { x: event.clientX, y: event.clientY }
  const clickHandler = () => createVertex({ ...coordinates, radius: 20 })
  const items = [
    { display: 'Create vertex here', onClick: clickHandler }
  ]

  renderContextMenu({ ...coordinates, items })
}

const handleDocumentClick = ({ event, contextMenuNode, unRenderContextMenu }) => {
  if (doShareLineage(event.target, contextMenuNode.current)) {
    return
  }

  if (!Object.is(contextMenuNode.current, event.target)) {
    unRenderContextMenu()
  }
}

const App = props => {
  useEffect(() => {
    const mouseDownParams = [
      'mousedown',
      event => handleDocumentClick({
        event,
        contextMenuNode,
        unRenderContextMenu
      })
    ]

    document.addEventListener(...mouseDownParams)

    return () => {
      document.removeEventListener(...mouseDownParams)
    }
  }, [])

  const contextMenuNode = useRef()
  const [draggedVertexId, setDraggedVertxId] = useState(null)
  const [resizedVertexId, setResizedVertexId] = useState(null)
  const [dragCursorOrigin, setDragCursorOrigin] = useState({ x: null, y: null })
  const [gridIncrement, setGridIncrement] = useState(10)

  const {
    render: renderContextMenu,
    unRender: unRenderContextMenu,
    isRendering: isRenderingContextMenu,
    coordinates: contextMenuCoordinates,
    items: contextMenuItems
  } = useContextMenu()

  const {
    state: vertices,
    find: findVertex,
    push: createVertex,
    removeByProperty: deleteVertex,
    updateItem: updateVertex
  } = useArray(DEFAULT_VERTICES)

  const {
    state: edges,
    find: findEdge,
    push: createEdge,
    removeByProperty: deleteEdge,
    updateItem: updateEdge
  } = useArray(EDGES_SEED)

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
            event => handleMouseMove({
              event,
              draggedVertexId,
              setDraggedVertxId,
              resizedVertexId,
              setResizedVertexId,
              dragCursorOrigin,
              updateVertex,
              findVertex
            })
          }
          onMouseUp={() => handleMouseup({ setDraggedVertxId, setResizedVertexId })}
          onContextMenu={event => handleContextClick({
            event,
            renderContextMenu,
            createVertex
          })}
        >
          <Grid width={SVG_WIDTH} height={SVG_HEIGHT} increment={gridIncrement} />
          {
            edges.map((edge, index) => {
              return renderEdge({ edge, index, vertices, arrows })
            })
          }
          <Arrows arrows={arrows} edges={edges} vertices={vertices} />
          <Vertices
            vertices={vertices}
            edges={edges}
            createEdge={createEdge}
            deleteEdge={deleteEdge}
            setDraggedVertxId={setDraggedVertxId}
            setResizedVertexId={setResizedVertexId}
            setDragCursorOrigin={setDragCursorOrigin}
            renderContextMenu={renderContextMenu}
          />
        </StyledSvg>
        {isRenderingContextMenu && (
          <ContextMenu
            nodeRef={contextMenuNode}
            coordX={contextMenuCoordinates.x}
            coordY={contextMenuCoordinates.y}
            closeMenu={unRenderContextMenu}
            items={contextMenuItems}
          />
        )}
      </PositionWrapper>
      <Editor
        gridIncrement={gridIncrement}
        setGridIncrement={setGridIncrement}
        vertices={vertices}
        createVertex={createVertex}
        deleteVertex={deleteVertex}
        edges={edges}
        createEdge={createEdge}
        updateEdge={updateEdge}
        arrows={arrows}
        createArrow={createArrow}
        deleteArrow={deleteArrow}
        updateArrow={updateArrow}
      />
    </>
  )
}

export { App }
