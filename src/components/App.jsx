import React, { useState, useEffect, useRef } from "react"
import styled from 'styled-components'
import { hot } from "react-hot-loader"

import { DEFAULT_ARROWS } from '../models/polygons'
import {
  DEFAULT_VERTICES,
  DEFAULT_CIRCLE,
  DEFAULT_RECTANGLE
} from '../models/vertices'
import { SEED as EDGES_SEED } from '../models/edge'
import { useArray } from '../hooks/useArray'
import { useContextMenu } from '../hooks/useContextMenu'
import { PositionWrapper } from './common/Wrappers.jsx'
import { Grid } from './Grid.jsx'
import { Vertices } from './Vertices.jsx'
import Arrows from './Arrows.jsx'
import { Editor } from './Editor.jsx'
import { ContextMenu } from './ContextMenu.jsx'
import { getDistance } from "../geometry_helpers/get_distance"
import { getHypotenuseLength } from '../geometry_helpers/trigonometry'
import {
  getShapeTangent,
  doShareLineage,
  getRectangleCentre
} from '../component_helpers/app'

const SVG_HEIGHT = 500
const SVG_WIDTH = 750

const StyledSvg = styled.svg`
  background: lightgrey;
`

const renderEdge = ({ edge, index, tangents }) => {
  const { end0, end1 } = edge
  if (!end0.vertexId || !end1.vertexId || !tangents?.length) return

  const end0Coordinates = tangents.find(tangent => {
    return tangent.endId === 0 && tangent.edgeId === edge.id
  })?.coordinates

  if (!end0Coordinates) return null

  const end1Coordinates = tangents.find(tangent => {
    return tangent.endId === 1 && tangent.edgeId === edge.id
  })?.coordinates

  if (!end1Coordinates) return null

  const { x: x1, y: y1 } = end0Coordinates
  const { x: x2, y: y2 } = end1Coordinates

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
        centreX: event.clientX,
        centreY: event.clientY
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
  const { clientX, clientY } = event

  const vertexCentre = { centreX: clientX, centreY: clientY }
  const createCircle = () => createVertex({
    ...DEFAULT_CIRCLE,
    ...vertexCentre
  })
  const createRectangle = () => createVertex({
    ...DEFAULT_RECTANGLE,
    ...vertexCentre
  })
  const items = [
    { display: 'Create circle here', onClick: createCircle },
    { display: 'Create rectangle here', onClick: createRectangle }
  ]

  renderContextMenu({ x: clientX, y: clientY, items })
}

const handleDocumentClick = ({ event, contextMenuNode, unRenderContextMenu }) => {
  if (doShareLineage(event.target, contextMenuNode.current)) {
    return
  }

  if (!Object.is(contextMenuNode.current, event.target)) {
    unRenderContextMenu()
  }
}

const updateTangents = ({ edges, findVertex, setTangents }) => {
  const tangents = []

  edges.forEach(edge => {
    if (!edge.end0?.vertexId || !edge.end1?.vertexId) return

    const vertex0 = findVertex(edge.end0.vertexId)
    const vertex1 = findVertex(edge.end1.vertexId)

    // if (vertex0.id === 2) {
    //   debugger
    // }

    const end0Tangent = getShapeTangent({
      origin: vertex0,
      destination: vertex1
    })

    tangents.push({
      edgeId: edge.id,
      endId: 0,
      vertexId: edge.end0.vertexId,
      coordinates: end0Tangent
    })

    const end1Tangent = getShapeTangent({
      // ...vertex1,
      origin: vertex1,
      destination: vertex0
    })

    tangents.push({
      edgeId: edge.id,
      endId: 1,
      vertexId: edge.end1.vertexId,
      coordinates: end1Tangent
    })
  })

  setTangents(tangents)
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
  const [tangents, setTangents] = useState([])

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

  useEffect(() => {
    updateTangents({ edges, findVertex, setTangents })
  }, [vertices, edges])

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
              return renderEdge({ edge, index, tangents })
            })
          }
          <Arrows
            arrows={arrows}
            tangents={tangents}
          />
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
