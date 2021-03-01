export const canvasCoordinatesConversion = ({
  cursorX,
  cursorY,
  canvasX,
  canvasY
}) => {
  const { scrollTop, scrollLeft } = document.querySelector('html')

  if (cursorX && cursorY) {
    return {
      x: cursorX + scrollLeft,
      y: cursorY + scrollTop
    }
  } else if (canvasX && canvasY) {
    return {
      x: canvasX - scrollLeft,
      y: canvasY - scrollTop
    }
  }
}

const getLineage = element => {
  const lineage = [element]
  let cursor = element

  while (lineage.slice(-1)[0] !== null) {
    const newCursor = cursor.parentElement
    lineage.push(newCursor)
    cursor = newCursor
  }

  return lineage
}

export const doShareAncestry = (youngest, ancestorTested) => {
  const lineage = getLineage(youngest)
  return lineage.includes(ancestorTested)
}
