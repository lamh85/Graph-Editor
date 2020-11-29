const getHighestObjectId = object => {
  const ids = Object.keys(object)
  return ids.reverse()[0]
}

export const handleAddVertex = ({ vertices, setVertices }) => {
  const highestId = getHighestObjectId(vertices)
  const nextId = Number(highestId) + 1

  const newVertices = {
    ...vertices,
    [nextId]: { x: 20, y: 20 }
  }

  setVertices(newVertices)
}

export const handleDeleteVertex = ({ id, vertices, setVertices }) => {
  const newVertices = { ...vertices }
  delete newVertices[id]
  setVertices(newVertices)
}
