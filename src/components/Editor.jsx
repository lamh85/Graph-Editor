import React from "react"
import styled from 'styled-components'

import { handleAddVertex, handleDeleteVertex } from '../state_interfaces/polygons'

const StyledEditor = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`

const Row = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`

const handleEdgeChange = ({ event, edges, endProperty, setEdges, edgeId }) => {
  const newEdges = [...edges]
  const edgeIndex = edges.findIndex(edge => edge.id === edgeId)
  const editedEdge = newEdges[edgeIndex]
  editedEdge[endProperty].vertexId = event.target.value
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

const ArrowsPanel = ({ arrows, createArrow, deleteArrow }) => {
  return (
    <div>
      <h1>Arrows</h1>
      <div>
        {
          arrows.map((arrow, index) => {
            const { id, edgeId, endId, shape } = arrow

            return (
              <Row key={index}>
                <div>ID: {id}</div>
                <div>Edge ID: {edgeId}</div>
                <div>End ID: {endId}</div>
                <div>Shape: {shape}</div>
                <button onClick={() => deleteArrow('id', id)}>
                  Delete
                </button>
              </Row>
            )
          })
        }
      </div>
    </div>
  )
}

const Editor = ({
  vertices,
  setVertices,
  edges,
  setEdges,
  arrows,
  createArrow,
  deleteArrow
}) => {
  return (
    <StyledEditor>
      <div>
        <h1>Vertices</h1>
        {
          Object.keys(vertices).map(id => {
            return (
              <Row>
                <div>{id}:: X: {vertices[id].x}, Y: {vertices[id].y}</div>
                <button onClick={() => handleDeleteVertex({ id, vertices, setVertices })}>Delete</button>
              </Row>
            )
          })
        }
        <button onClick={() => handleAddVertex({ vertices, setVertices })}>
          Add Vertex
        </button>
      </div>
      <EdgesPanel setEdges={setEdges} edges={edges} />
      <ArrowsPanel
        arrows={arrows}
        createArrow={createArrow}
        deleteArrow={deleteArrow}
      />
    </StyledEditor>
  )
}

export { Editor }
