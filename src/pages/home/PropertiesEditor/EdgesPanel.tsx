import React, { useState } from 'react'
import styled from 'styled-components'
import { TEMPLATE as EDGE_TEMPLATE, EdgeT } from '../../../models/edge.ts'

const H1 = styled.h1`
  font-family: sans-serif;
  font-size: 1.5em;
`

export function EdgesPanel({ createEdge, updateEdge, edges, vertices }) {
  const [edgesInput, setEdgesInput] = useState<EdgeT[]>(edges)

  const vertexIds = vertices.map((vertex) => vertex.id)

  const handleUpdateEndVetex = (event, edgeId, inputIndex, endNumber) => {
    const inputClone = [...edgesInput]
    const editedEdge = inputClone[inputIndex]
    const newVertexId = parseInt(event.target.value)
    const propertyName = `end${endNumber}`

    const endValue = {
      ...editedEdge[propertyName],
      vertexId: newVertexId,
    }

    inputClone[inputIndex] = {
      ...editedEdge,
      [propertyName]: endValue,
    }

    setEdgesInput(inputClone)

    if (!vertexIds.includes(newVertexId)) {
      return
    }

    updateEdge({
      id: edgeId,
      property: propertyName,
      value: endValue,
    })
  }

  return (
    <div>
      <H1>Edges</H1>
      {edgesInput.map((edge, inputIndex) => {
        return (
          <div key={edge.id}>
            ID: {edge.id}
            {[0, 1].map((endNumber) => {
              return (
                <EdgeEndInput
                  key={`${edge.id}-${endNumber}`}
                  value={edge?.[`end${endNumber}`]?.vertexId}
                  handleChange={(event) =>
                    handleUpdateEndVetex(event, edge.id, inputIndex, endNumber)
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
