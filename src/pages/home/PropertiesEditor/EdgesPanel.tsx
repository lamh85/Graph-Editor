import React from 'react'
import styled from 'styled-components'
import { TEMPLATE as EDGE_TEMPLATE } from '../../../models/edge.ts'

const H1 = styled.h1`
  font-family: sans-serif;
  font-size: 1.5em;
`

export function EdgesPanel({ createEdge, updateEdge, edges }) {
  const handleChange = ({ event, endProperty, edgeId, editedEdge }) => {
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
                    handleChange({
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

function EdgeEndInput({ value, handleChange }) {
  return <input type="number" value={value} onChange={handleChange} />
}
