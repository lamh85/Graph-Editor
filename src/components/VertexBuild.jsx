import React from "react"

export const VertexBuild = ({
  vertexDragCreator
}) => {
  const {
    selectedVertex,
    canvasClickOrigin,
    canvasCoordinates
  } = vertexDragCreator

  if (!selectedVertex|| !canvasClickOrigin || !canvasCoordinates) return null

  const left = canvasClickOrigin.x < canvasCoordinates.x
    ? canvasClickOrigin.x
    : canvasCoordinates.x

  const top = canvasClickOrigin.y < canvasCoordinates.y
    ? canvasClickOrigin.y
    : canvasCoordinates.y

  const height = Math.abs(canvasCoordinates.y - canvasClickOrigin.y)
  const width = Math.abs(canvasCoordinates.x - canvasClickOrigin.x)

  // return (
  //   <div>
  //     {JSON.stringify(vertexDragCreator)}
  //   </div>
  // )

  return (
    <rect
      x={left}
      y={top}
      height={height}
      width={width}
      fill="blue"
    />
  )
}