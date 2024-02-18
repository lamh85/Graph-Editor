import React, { useState } from 'react'
import styled from 'styled-components'
import { TEMPLATE as EDGE_TEMPLATE, EdgeT } from '../../../models/edge.ts'

const H1 = styled.h1`
  font-family: sans-serif;
  font-size: 1.5em;
`

type EdgeInputT = EdgeT & {
  validationMessage?: string
  validationSource?: string
}

export function EdgesPanel({ createEdge, updateEdge, edges, vertices }) {
  const [edgesInput, setEdgesInput] = useState<EdgeInputT[]>(edges)

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

    const isValidVertex = vertexIds.includes(newVertexId)
    let validationMessage = ''
    let validationSource = ''

    if (!isValidVertex) {
      validationMessage = 'Invalid Vertex'
      validationSource = propertyName
    }

    inputClone[inputIndex] = {
      ...editedEdge,
      [propertyName]: endValue,
      validationMessage,
      validationSource,
    }

    setEdgesInput(inputClone)

    if (!isValidVertex) {
      return
    }

    updateEdge({
      id: edgeId,
      property: propertyName,
      value: endValue,
    })
  }

  const handleUpdateWeight = (event, edgeId, inputIndex) => {
    const inputClone = [...edgesInput]
    const editedEdge = inputClone[inputIndex]
    const newWeight = parseInt(event.target.value)

    inputClone[inputIndex] = {
      ...editedEdge,
      weight: newWeight,
    }

    setEdgesInput(inputClone)

    updateEdge({
      id: edgeId,
      property: 'weight',
      value: newWeight,
    })
  }

  return (
    <div>
      <H1>Edges</H1>
      {edgesInput.map((edge, inputIndex) => {
        return (
          <div key={edge.id}>
            <div style={{ fontWeight: 'bold' }}>Edge ID: {edge.id}</div>
            {[0, 1].map((endNumber) => {
              const validationMessage =
                edge?.validationSource == `end${endNumber}` &&
                edge?.validationMessage.length > 0
                  ? edge?.validationMessage
                  : ''

              return (
                <EdgeEndInput
                  key={`${edge.id}-${endNumber}`}
                  value={edge?.[`end${endNumber}`]?.vertexId}
                  handleChange={(event) =>
                    handleUpdateEndVetex(event, edge.id, inputIndex, endNumber)
                  }
                  endId={endNumber}
                  validationMessage={validationMessage}
                />
              )
            })}
            <div style={{ display: 'block' }}>
              <div>Weight</div>
              <input
                value={edge?.weight}
                onChange={(event) =>
                  handleUpdateWeight(event, edge.id, inputIndex)
                }
              />
            </div>
          </div>
        )
      })}
      <button onClick={() => createEdge(EDGE_TEMPLATE)}>Add Edge</button>
    </div>
  )
}

function EdgeEndInput({ value, handleChange, endId, validationMessage }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div>End ID {endId}</div>
      <input type="number" value={value} onChange={handleChange} />
      <div>{validationMessage}</div>
    </div>
  )
}
