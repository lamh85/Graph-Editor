import React from "react"

export const CircleBuild = ({
  circleProps,
  isToolSelected
}) => {
  if (!isToolSelected || !circleProps) return null

  const { cx, cy, r } = circleProps

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="blue"
    />
  )
}
