import React from "react"

export const VertexBuild = ({
  rectangleProps
}) => {
  if (!rectangleProps) return null

  return (
    <rect
      x={rectangleProps.left}
      y={rectangleProps.top}
      height={rectangleProps.height}
      width={rectangleProps.width}
      fill="blue"
    />
  )
}
