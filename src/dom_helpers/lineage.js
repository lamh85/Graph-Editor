const getLineage = element => {
  const lineage = []
  let cursor = element

  while (lineage.slice(-1)[0] !== null) {
    const newCursor = cursor.parentElement
    lineage.push(newCursor)
    cursor = newCursor
  }

  return lineage
}

export const doShareLineage = (youngest, ancestorTested) => {
  const lineage = getLineage(youngest)
  return lineage.includes(ancestorTested)
}
