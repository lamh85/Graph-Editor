import React, { useState } from "react"
import styled from 'styled-components'
import { hot } from "react-hot-loader"

import {
  DEFAULT_EDGES,
  DEFAULT_VERTICES,
  DEFAULT_ARROWS
} from '../datasets/polygons'
import { getVertexTangent } from '../geometry_helpers/get_vertex_tangent'
import { CIRCLE as CIRCLE_CONFIG } from '../geometry_helpers/shapes_config'
import { getArrowProps } from '../geometry_helpers/shapes_config'
import { coordinatesToSvgPoints } from '../geometry_helpers/general'
import { useArray } from '../hooks/useArray'
import { PositionWrapper } from './common/Wrappers.jsx'
import { Editor } from './Editor.jsx'

const SVG_HEIGHT = 500
const SVG_WIDTH = 750

const StyledSvg = styled.svg`
  background: lightgrey;
`

const ContextMenu = styled.div`
  height: 100px;
  width: 100px;
  background: white;
  position: absolute;
  left: ${props => props.left || 0}px;
  top: ${props => props.top || 0}px
`

const getVertexById = ({ vertices, id }) => vertices[id]

const renderArrow = ({ towardsVertex, awayVertex }) => {
  const { tangentOrigin, tangentDestination } = getVertexTangent({
    vertexOrigin: towardsVertex,
    vertexDestination: awayVertex
  })

  const arrowProps = getArrowProps({
    towards: tangentOrigin,
    away: tangentDestination
  })

  if (arrowProps === null) {
    return null
  } else {
    const { svgPoints, cssRotation } = arrowProps
    const rotationOrigin = coordinatesToSvgPoints([tangentOrigin])
    const transform = `rotate(${cssRotation}, ${rotationOrigin})`
    return <polygon points={svgPoints} stroke="red" fill="yellow" transform={transform} />
  }
}

const renderArrows = ({ arrows, edges, vertices }) => {
  return arrows.map((arrow, index) => {
    const edge = edges.find(edge => edge.id === arrow.edgeId)
    if (!edge) return null

    const endKey = `end${arrow.endId}`
    const towardsVertexId = edge[endKey].vertexId
    const towardsVertex = vertices[towardsVertexId]

    const awayEndId = arrow.endId === 0 ? 1 : 0
    const awayEndKey = `end${awayEndId}`
    const awayVertexId = edge[awayEndKey].vertexId
    const awayVertex = vertices[awayVertexId]

    return renderArrow({ towardsVertex, awayVertex })
  })
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

const handleMouseMove = ({ event, setDraggedVertxId, draggedVertexId, vertices, setVertices }) => {
  if (doesExceedBoundaries({ x: event.clientX, y: event.clientY })) {
    setDraggedVertxId(null)
  }

  if (draggedVertexId) {
    const location = {
      ...vertices,
      [draggedVertexId]: {
        x: event.clientX,
        y: event.clientY
      }
    }

    setVertices(location)
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
    <g
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
    </g>
  )
}

const App = props => {
  const [draggedVertexId, setDraggedVertxId] = useState(null)
  const [vertices, setVertices] = useState(DEFAULT_VERTICES)
  const [edges, setEdges] = useState(DEFAULT_EDGES)
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  const [contextMenuLocation, setContextMenuLocation] = useState({})

  const {
    state: arrows,
    push: createArrow,
    removeByProperty: deleteArrow,
    updateItem: updateArrow
  } = useArray(DEFAULT_ARROWS)

  const commonProps = {
    setDraggedVertxId,
    draggedVertexId,
    setVertices,
    vertices,
    edges,
    setEdges
  }

  return (
    <>
      <PositionWrapper>
        <StyledSvg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          onMouseMove={event => handleMouseMove({ ...commonProps, event })}
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
          {renderArrows({ arrows, edges, vertices })}
          {
            Object.keys(vertices).map((vertexId, index) => {
              return (
                <Circle
                  id={vertexId}
                  x={vertices[vertexId].x}
                  y={vertices[vertexId].y}
                  index={index}
                  setDraggedVertxId={setDraggedVertxId}
                />
              )
            })
          }
        </StyledSvg>
        {isContextMenuOpen && (
          <ContextMenu
            left={contextMenuLocation.x}
            top={contextMenuLocation.y}
          >
            blah
          </ContextMenu>
        )}
      </PositionWrapper>
      <Editor
        vertices={vertices}
        setVertices={setVertices}
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
