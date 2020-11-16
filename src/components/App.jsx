
import React, { Component } from "react"
import { hot } from "react-hot-loader"

const LINE_ATTRIBUTES = {
  stroke: 'red',
  strokeWidth: 2
}

const vertices = [
  { id: 1, x: 40, y: 40 },
  { id: 2, x: 200, y: 40 },
  { id: 3, x: 200, y: 200 }
]

const edges = [
  [vertices[0], vertices[1]],
  [vertices[1], vertices[2]],
  [vertices[2], vertices[0]],
]

const renderLine = (endPoints, index) => {
  const attributes = {
    x1: endPoints[0].x,
    y1: endPoints[0].y,
    x2: endPoints[1].x,
    y2: endPoints[1].y,
    stroke: 'red',
    strokeWidth: 2,
    key: index
  }

  return <line {...attributes} />
}

const Circle = ({ x, y }) => {
  return <circle cx={x} cy={y} fill="blue" strokeWidth="3" stroke="black" r="20" />
}

const App = props => {
  console.log(edges)

  return (
    <svg height="500" width="500">
      {
        edges.map((edge, index) => renderLine(edge, index))
      }

      {
        vertices.map((vertex, index) => <Circle x={vertex.x} y={vertex.y} key={index} />)
      }
    </svg>
  )
}

export { App }
