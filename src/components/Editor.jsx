import React, { useState } from "react"
import styled from 'styled-components'

import { ARROW_TEMPLATE, VERTEX_TEMPLATE } from '../models/polygons'

const StyledEditor = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`

const Row = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;

  > *:not(last-child) {
    margin-right: 10px
  }
`

const handleEdgeChange = ({ event, edges, endProperty, setEdges, edgeId }) => {
  const newEdges = [...edges]
  const edgeIndex = edges.findIndex(edge => edge.id === edgeId)
  const editedEdge = newEdges[edgeIndex]
  editedEdge[endProperty].vertexId = parseInt(event.target.value)
  newEdges[edgeIndex] = editedEdge

  setEdges(newEdges)
}

const EdgeEndInput = ({ key, value, handleChange }) => {
  return (
    <input
      key={key}
      type="number"
      value={value}
      onChange={handleChange}
    />
  )
}

const handleAddEdge = ({ edges, setEdges }) => {
  const edgeIds = edges.map(edge => edge.id)
  const highestId = edgeIds.reverse()[0]
  const newId = highestId + 1

  const newEdges = [...edges]
  const newEdge = {
    ...edges.reverse()[0],
    id: newId,
    end0: {
      ...edges.reverse()[0].end0,
      vertexId: null
    },
    end1: {
      ...edges.reverse()[0].end1,
      vertexId: null
    }
  }
  newEdges.push(newEdge)

  setEdges(newEdges)
}

const EdgesPanel = ({ setEdges, edges }) => {
  return (
    <div>
      <h1>Edges</h1>
      {
        edges.map(edge => {
          return (
            <div key={edge.id}>
              ID: {edge.id}
              {[0, 1].map((endNumber) => {
                return (
                  <EdgeEndInput
                    key={`${edge.id}-${endNumber}`}
                    value={edge[`end${endNumber}`].vertexId}
                    handleChange={event => handleEdgeChange({
                      edges,
                      setEdges,
                      event,
                      endProperty: `end${endNumber}`,
                      edgeId: edge.id
                    })}
                  />
                )
              })}
            </div>
          )
        })
      }
      <button onClick={() => handleAddEdge({ edges, setEdges })}>
        Add Edge
      </button>
    </div>
  )
}

const validateArrowValue = (property, value) => {
  const formatter = {
    endId: parseInt,
    edgeId: parseInt,
    id: parseInt
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

const ArrowEdgeEndForm = ({
  arrowId,
  arrowEdgeEndId,
  formEndId,
  inputProps
}) => {
  const keyPrefix = `${arrowId}-${arrowEdgeEndId}`

  return (
    <>
      <div key={`${keyPrefix}-title`}>End {formEndId}</div>
      <input
        key={`${keyPrefix}-input`}
        checked={parseInt(arrowEdgeEndId) === formEndId}
        value={formEndId}
        {...inputProps}
      />
    </>
  )
}

const ArrowsPanel = ({ arrows, createArrow, deleteArrow, updateArrow }) => {
  const highestId = arrows.map(arrow => arrow.id).reverse()[0]
  const newId = highestId + 1
  const newArrowProps = { ...ARROW_TEMPLATE, id: newId }

  return (
    <div>
      <h1>Arrows</h1>
      {
        arrows.map((arrow, index) => {
          const { id, edgeId, endId, shape } = arrow

          const inputProps = {
            'data-arrow-id': id,
            onChange: event => handleArrowChange(event, updateArrow)
          }

          const radioProps = { ...inputProps, type: 'radio', 'data-property': 'endId' }

          return (
            <>
              <Row key={index}>
                <div>ID: {id}</div>
                <div>
                  Edge ID:
                  <input
                    {...inputProps}
                    value={edgeId}
                    data-property="edgeId"
                  />
                </div>
                {
                  [0, 1].map(formEndId => {
                    return (
                      <ArrowEdgeEndForm
                        arrowId={id}
                        arrowEdgeEndId={endId}
                        formEndId={formEndId}
                        inputProps={radioProps}
                      />
                    )
                  })
                }
                <div>Shape: {shape}</div>
                <button onClick={() => deleteArrow('id', id)}>
                  Delete
                </button>
              </Row>
            </>
          )
        })
      }
      <button onClick={() => createArrow(newArrowProps)}>
        Add Arrow
      </button>
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
  setEdges,
  arrows,
  createArrow,
  deleteArrow,
  updateArrow
}) => {
  const [gridSizeInput, setGridSizeInput] = useState(gridIncrement)

  return (
    <StyledEditor>
      <div>
        <h1>Grid Square Size</h1>
        <input
          value={gridSizeInput}
          onChange={event => handleGridIncrementChange(event, setGridSizeInput)}
        />
        <button onClick={() => setGridIncrement(gridSizeInput)}>
          Apply
        </button>
        <h1>Vertices</h1>
        {
          vertices.map((vertex, index) => {
            const { id } = vertex
            return (
              <Row key={index}>
                <div>{id}:: X: {vertex.x}, Y: {vertex.y}</div>
                <button onClick={() => deleteVertex('id', id)}>Delete</button>
              </Row>
            )
          })
        }
        <button onClick={() => createVertex(VERTEX_TEMPLATE)}>
          Add Vertex
        </button>
      </div>
      <EdgesPanel setEdges={setEdges} edges={edges} />
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
