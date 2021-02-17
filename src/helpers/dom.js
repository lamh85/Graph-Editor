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
