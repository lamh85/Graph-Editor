export const getConnectedVertices = (vertexId, edges) => {
  const vertexEdges = edges.filter(edge => {
    return edge.end0.vertexId === vertexId || edge.end1.vertexId === vertexId
  })

  const connectedVertices = []
  vertexEdges.forEach(edge => {
    const { end0, end1 } = edge

    if (end0.vertexId === vertexId) {
      connectedVertices.push(end1.vertexId)
    }
    
    if (end1.vertexId === vertexId) {
      connectedVertices.push(end0.vertexId)
    }
  })

  return connectedVertices
}

export const getUnconnectedVertices = ({ vertexId, vertices, edges }) => {
  const connectedVertices = getConnectedVertices(vertexId, edges)

  const allVertexIds = vertices.map(vertex => vertex.id)
  return allVertexIds.filter(id => {
    return !connectedVertices.includes(id) && id !== vertexId
  })
}

export const vertexCircleProps = vertex => {
  const { centreX, centreY, radius } = vertex

  return { cx: centreX, cy: centreY, r: radius }
}

export const vertexRectangleProps = vertex => {
  const { centreX, centreY, height, width } = vertex

  const left = centreX - width / 2
  const top = centreY - height / 2

  return { x: left, y: top, height, width }
}
