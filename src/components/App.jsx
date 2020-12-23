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
import { Editor } from './Editor.jsx'

const SVG_HEIGHT = 500
const SVG_WIDTH = 750

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

const renderConnections = ({ edge, index, vertices }) => {
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
      {renderArrow({ towardsVertex: vertex1, awayVertex: vertex2 })}
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
  const {
    state: arrows,
    push: createArrow,
    removeByProperty: deleteArrow,
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
      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        onMouseMove={event => handleMouseMove({ ...commonProps, event })}
        onMouseUp={() => setDraggedVertxId(null)}
      >
        {
          edges.map((edge, index) => {
            return renderConnections({ edge, index, vertices, arrows })
          })
        }

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
      </svg>
      <Editor
        vertices={vertices}
        setVertices={setVertices}
        edges={edges}
        setEdges={setEdges}
        arrows={arrows}
        createArrow={createArrow}
        deleteArrow={deleteArrow}
      />
    </>
  )
}

export { App }
