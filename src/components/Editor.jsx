import React, { useState } from 'react'
import styled from 'styled-components'

import { ARROW_TEMPLATE, VERTEX_TEMPLATE } from '../models/polygons'
import { TEMPLATE as EDGE_TEMPLATE } from '../models/edge'

const StyledEditor = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`

const H1 = styled.h1`
  font-family: sans-serif;
  font-size: 1.5em;
`

const Row = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;

  > *:not(last-child) {
    margin-right: 10px;
  }
`

const handleEdgeChange = ({
  event,
  endProperty,
  updateEdge,
  edgeId,
  editedEdge,
}) => {
  const vertexId = parseInt(event.target.value)
  const newAttributeValue = {
    ...editedEdge[endProperty],
    vertexId,
  }

  updateEdge({
    id: edgeId,
    property: endProperty,
    value: newAttributeValue,
  })
}

const EdgeEndInput = ({ value, handleChange }) => {
  return <input type="number" value={value} onChange={handleChange} />
}

const EdgesPanel = ({ createEdge, updateEdge, edges }) => {
  return (
    <div>
      <H1>Edges</H1>
      {edges.map((edge) => {
        return (
          <div key={edge.id}>
            ID: {edge.id}
            {[0, 1].map((endNumber) => {
              return (
                <EdgeEndInput
                  key={`${edge.id}-${endNumber}`}
                  value={edge[`end${endNumber}`].vertexId}
                  handleChange={(event) =>
                    handleEdgeChange({
                      updateEdge,
                      event,
                      endProperty: `end${endNumber}`,
                      edgeId: edge.id,
                      editedEdge: edge,
                    })
                  }
                />
              )
            })}
          </div>
        )
      })}
      <button onClick={() => createEdge(EDGE_TEMPLATE)}>Add Edge</button>
    </div>
  )
}

const validateArrowValue = (property, value) => {
  const formatter = {
    endId: parseInt,
    edgeId: parseInt,
    id: parseInt,
  }[property]

  if (!formatter) return value

  const formatted = formatter(value)
  if (String(formatted) === 'NaN') return value
  return formatted
}

const handleArrowChange = (event, updateArrow) => {
  const { dataset, value: valueRaw } = event.target
  const { arrowId, property } = dataset
  const value = validateArrowValue(property, valueRaw)
  const id = parseInt(arrowId)
  updateArrow({ id, property, value })
}

const ArrowEdgeEndForm = ({ arrowEdgeEndId, formEndId, inputProps }) => {
  return (
    <>
      <div>End {formEndId}</div>
      <input
        checked={parseInt(arrowEdgeEndId) === formEndId}
        value={formEndId}
        {...inputProps}
      />
    </>
  )
}

const ArrowsPanel = ({ arrows, createArrow, deleteArrow, updateArrow }) => {
  const highestId = arrows.map((arrow) => arrow.id).reverse()[0]
  const newId = highestId + 1
  const newArrowProps = { ...ARROW_TEMPLATE, id: newId }

  return (
    <div>
      <H1>Arrows</H1>
      {arrows.map((arrow, index) => {
        const { id, edgeId, endId, shape } = arrow

        const inputProps = {
          'data-arrow-id': id,
          onChange: (event) => handleArrowChange(event, updateArrow),
        }

        const radioProps = {
          ...inputProps,
          type: 'radio',
          'data-property': 'endId',
        }

        return (
          <React.Fragment key={`arrow-row-${id}`}>
            <Row>
              <div>ID: {id}</div>
              <div>
                Edge ID:
                <input {...inputProps} value={edgeId} data-property="edgeId" />
              </div>
              {[0, 1].map((formEndId) => {
                return (
                  <ArrowEdgeEndForm
                    key={`arrow${id}-end${formEndId}`}
                    arrowEdgeEndId={endId}
                    formEndId={formEndId}
                    inputProps={radioProps}
                  />
                )
              })}
              <div>Shape: {shape}</div>
              <button onClick={() => deleteArrow('id', id)}>Delete</button>
            </Row>
          </React.Fragment>
        )
      })}
      <button onClick={() => createArrow(newArrowProps)}>Add Arrow</button>
    </div>
  )
}

const handleGridIncrementChange = (event, setGridSizeInput) => {
  let newValue = parseInt(event.target.value)

  if (String(newValue) === 'NaN') {
    newValue = ''
  }

  setGridSizeInput(newValue)
}

const Editor = ({
  gridIncrement,
  setGridIncrement,
  vertices,
  createVertex,
  deleteVertex,
  edges,
  createEdge,
  updateEdge,
  arrows,
  createArrow,
  deleteArrow,
  updateArrow,
}) => {
  const [gridSizeInput, setGridSizeInput] = useState(gridIncrement)

  return (
    <StyledEditor>
      <div>
        <H1>Grid Square Size</H1>
        <input
          value={gridSizeInput}
          onChange={(event) =>
            handleGridIncrementChange(event, setGridSizeInput)
          }
        />
        <button onClick={() => setGridIncrement(gridSizeInput)}>Apply</button>
        <H1>Vertices (centre)</H1>
        {vertices.map((vertex, index) => {
          const { id } = vertex
          return (
            <Row key={index}>
              <div>
                {id}:: X: {vertex.centreX}, Y: {vertex.centreY}
              </div>
              <button onClick={() => deleteVertex('id', id)}>Delete</button>
            </Row>
          )
        })}
        <button onClick={() => createVertex(VERTEX_TEMPLATE)}>
          Add Vertex
        </button>
      </div>
      <EdgesPanel
        createEdge={createEdge}
        updateEdge={updateEdge}
        edges={edges}
      />
      <ArrowsPanel
        arrows={arrows}
        createArrow={createArrow}
        deleteArrow={deleteArrow}
        updateArrow={updateArrow}
      />
    </StyledEditor>
  )
}

export { Editor }
