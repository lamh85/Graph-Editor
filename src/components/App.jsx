import React, { useState, useEffect, useRef } from "react"
import styled, { css } from 'styled-components'
import { hot } from "react-hot-loader"

import { DEFAULT_ARROWS } from '../models/polygons'
import {
  DEFAULT_VERTICES,
  DEFAULT_CIRCLE,
  DEFAULT_RECTANGLE,
  RADIUS_MINIMUM
} from '../models/vertices'
import { SEED as EDGES_SEED } from '../models/edge'
import { useArray } from '../hooks/useArray'
import { useContextMenu } from '../hooks/useContextMenu'
import { useVertexMouseMove } from '../hooks/useVertexMouseMove'
import { PositionWrapper } from './common/Wrappers.jsx'
import { Grid } from './Grid.jsx'
import { Vertices } from './Vertices.jsx'
import { RectangleBuild } from './RectangleBuild.jsx'
import { CircleBuild } from './CircleBuild.jsx'
import Arrows from './Arrows.jsx'
import { Editor } from './Editor.jsx'
import { ContextMenu } from './ContextMenu.jsx'
import { Toolbar } from './Toolbar.jsx'
import { Paintbrush } from './Paintbrush.jsx'
import {
  getShapeTangent,
  useEffectMoveVertex,
  useEffectResizeVertex,
  createRectangleWithDrag,
  createCircleWithDrag
} from '../component_helpers/app'
import { doShareAncestry } from '../helpers/dom'
import { getResizeCircleCursor } from '../geometry_helpers/general'

const SVG_HEIGHT = 500
const SVG_WIDTH = 900

const DrawingsContainer = styled.svg`
  , * {
    user-select: none;
  }

  background: lightgrey;

  ${props =>
    (props.isDrawRectangleMode || props.isDrawCircleMode)
    && css`
    cursor: crosshair;
  `}

  ${props =>
    props.resizeCursor
    && props.isResizingVertex && css`
      , * {
        cursor: ${props.resizeCursor} !important;
      }
  `}
`

const DrawingsRow = styled.div`
  display: flex;
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
    <g key={`edge${edge.id}`}>
      <line {...lineProps} />
      <text x={averageX} y={averageY} fontSize="15" fill="black">Edge {edge.id}</text>
    </g>
  )
}

const buildCommonContextOptions = ({
  isDrawRectangleMode,
  setIsDrawRectangleMode,
  isDrawCircleMode,
  setIsDrawCircleMode
}) => {
  const disableDrawingMode = () => {
    setIsDrawRectangleMode(false)
    setIsDrawCircleMode(false)
  }

  const options = []

  if (isDrawRectangleMode || isDrawCircleMode) {
    options.push({
      display: 'CANCEL drawing shapes',
      onClick: disableDrawingMode
    })
  }

  if (!isDrawRectangleMode) {
    options.push({
      display: 'START drawing rectangles',
      onClick: () => {
        disableDrawingMode()
        setIsDrawRectangleMode(true)
      }
    })
  }

  if (!isDrawCircleMode) {
    options.push({
      display: 'START drawing circles',
      onClick: () => {
        disableDrawingMode()
        setIsDrawCircleMode(true)
      }
    })
  }

  return options
}

const handleContextClick = ({
  event,
  renderContextMenu,
  createVertex,
  setIsDrawRectangleMode,
  isDrawRectangleMode,
  isDrawCircleMode,
  setIsDrawCircleMode
}) => {
  event.preventDefault()

  const commonOptions = buildCommonContextOptions({
    isDrawRectangleMode,
    setIsDrawRectangleMode,
    isDrawCircleMode,
    setIsDrawCircleMode
  })

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
    { display: 'Place circle HERE', onClick: createCircle },
    { display: 'Place rectangle HERE', onClick: createRectangle },
    ...commonOptions
  ]

  renderContextMenu({ x: clientX, y: clientY, items })
}

const handleDocumentClick = ({ event, contextMenuNode, unRenderContextMenu }) => {
  if (doShareAncestry(event.target, contextMenuNode.current)) {
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

    const vertexPairs = [
      { origin: vertex0, destination: vertex1 },
      { origin: vertex1, destination: vertex0 }
    ]
    
    vertexPairs.forEach((pair, index) => {
      const tangent = getShapeTangent(pair)

      tangents.push({
        edgeId: edge.id,
        endId: index,
        vertexId: pair.origin.id,
        coordinates: tangent
      })
    })
  })

  setTangents(tangents)
}

const useDrawingsContainerCursorStyle = () => {
  const [innerState, setInnerState] = useState('default')

  const setState = state => {
    if (!state) setInnerState('default')

    setInnerState(state)
  }

  return { state: innerState, setState }
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
  const [gridIncrement, setGridIncrement] = useState(100)
  const [tangents, setTangents] = useState([])
  const [isDrawRectangleMode, setIsDrawRectangleMode] = useState(false)
  const [isDrawCircleMode, setIsDrawCircleMode] = useState(false)
  const [isPlaceCircleMode, setIsPlaceCircleMode] = useState(false)
  const [isPlaceRectMode, setIsPlaceRectMode] = useState(false)

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

  const canvasRef = useRef()

  const areVerticesMouseEditable = !isDrawRectangleMode && !isDrawCircleMode

  const moveVertexService = useVertexMouseMove({
    canvasRef,
    isEnabled: areVerticesMouseEditable
  })

  const resizeVertexService = useVertexMouseMove({
    canvasRef,
    isEnabled: areVerticesMouseEditable
  })

  const manualRectCreator = useVertexMouseMove({
    canvasRef,
    isEnabled: isDrawRectangleMode
  })

  const manualCircleCreator = useVertexMouseMove({
    canvasRef,
    isEnabled: isDrawCircleMode
  })
 
  const {
    state: drawingsContainerCursorStyle,
    setState: setDrawingsContainerCursorStyle
  } = useDrawingsContainerCursorStyle()

  useEffect(() => {
    useEffectMoveVertex({
      moveVertexService,
      updateVertex
    })
  }, [moveVertexService.canvasCoordinates])

  useEffect(() => {
    useEffectResizeVertex({
      resizeVertexService,
      updateVertex
    })

    const {
      selectedVertex,
      canvasCoordinates
    } = resizeVertexService

    if (selectedVertex) {
      const cursorStyle = getResizeCircleCursor({
        vertexCentreX: selectedVertex.centreX,
        vertexCentreY: selectedVertex.centreY,
        cursorX: canvasCoordinates.x,
        cursorY: canvasCoordinates.y
      })

      setDrawingsContainerCursorStyle(cursorStyle)
    }
  }, [resizeVertexService.canvasCoordinates])

  let paintbrushShape = null
  if (isPlaceCircleMode) {
    paintbrushShape = 'circle'
  } else if (isPlaceRectMode) {
    paintbrushShape = 'rectangle'
  }

  return (
    <div
      onMouseUp={() => {
        if (manualRectCreator.selectedVertex) {
          createRectangleWithDrag({
            rectangleProps: manualRectCreator.rectangleProps,
            createVertex
          })
        }

        if (manualCircleCreator.selectedVertex) {
          createCircleWithDrag({
            circleProps: manualCircleCreator.circleProps,
            createVertex
          })
        }

        moveVertexService.mouseUpListener()
        resizeVertexService.mouseUpListener()
        manualRectCreator.mouseUpListener()
        manualCircleCreator.mouseUpListener()
      }}
      onMouseMove={event => {
        moveVertexService.mouseMoveListener(event)
        resizeVertexService.mouseMoveListener(event)
        manualRectCreator.mouseMoveListener(event)
        manualCircleCreator.mouseMoveListener(event)
      }}
    >
      <DrawingsRow>
        <PositionWrapper>
          <DrawingsContainer
            ref={canvasRef}
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            onContextMenu={event => handleContextClick({
              event,
              renderContextMenu,
              createVertex,
              setIsDrawRectangleMode,
              isDrawRectangleMode,
              isDrawCircleMode,
              setIsDrawCircleMode
            })}
            onMouseDown={event => {
              manualRectCreator.mouseDownListener({
                event,
                vertex: 'TEMPORARY_RECTANGLE'
              })

              manualCircleCreator.mouseDownListener({
                event,
                vertex: 'TEMPORARY_CIRCLE'
              })
            }}
            isDrawRectangleMode={isDrawRectangleMode}
            isDrawCircleMode={isDrawCircleMode}
            resizeCursor={drawingsContainerCursorStyle}
            isResizingVertex={!!resizeVertexService.selectedVertex}
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
              moveVertexService={moveVertexService}
              resizeVertexService={resizeVertexService}
              renderContextMenu={renderContextMenu}
              areVerticesMouseEditable={areVerticesMouseEditable}
            />
            <RectangleBuild
              rectangleProps={manualRectCreator.rectangleProps}
            />
            <CircleBuild
              circleProps={manualCircleCreator.circleProps}
            />
            <Paintbrush
              x={4}
              y={4}
              shape={paintbrushShape}
            />
          </DrawingsContainer>
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
        <Toolbar
          extraOptions={buildCommonContextOptions({
            isDrawRectangleMode,
            setIsDrawRectangleMode,
            isDrawCircleMode,
            setIsDrawCircleMode
          })}
          setIsPlaceCircleMode={setIsPlaceCircleMode}
          setIsPlaceRectMode={setIsPlaceRectMode}
        />
      </DrawingsRow>
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
    </div>
  )
}

export { App }
