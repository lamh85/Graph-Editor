export const canvasCoordinatesConversion = ({
  cursorX,
  cursorY,
  canvasX,
  canvasY,
  canvasRef
}) => {
  const { scrollTop, scrollLeft } = document.querySelector('html')

  let canvasFromPage = { x: 0, y: 0 }
  if (canvasRef?.current) {
    canvasFromPage = canvasRef.current.getBoundingClientRect()
  }

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

export const getAncestry = element => {
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
  const lineage = getAncestry(youngest)
  return lineage.includes(ancestorTested)
}

export const vertexCircleProps = vertex => {
  const { centreX, centreY, radius } = vertex

  return { cx: centreX, cy: centreY, r: radius }
}
