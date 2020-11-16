
import React, { Component } from "react"
import { hot } from "react-hot-loader"

const LINE_ATTRIBUTES = {
  stroke: 'red',
  strokeWidth: 2
}

const CIRCLE_ATTRIBUTES = {
  fill: 'blue',
  strokeWidth: 3,
  stroke: 'black'
}

const App = props => {

  return (
    <svg height="500" width="500">
      <line x1="40" y1="40" x2="200" y2="40" {...LINE_ATTRIBUTES} />
      <line x1="200" y1="40" x2="200" y2="200" {...LINE_ATTRIBUTES} />
      <line x1="40" y1="40" x2="200" y2="200" {...LINE_ATTRIBUTES} />

      <circle cx="40" cy="40" r="20" {...CIRCLE_ATTRIBUTES} />
      <circle cx="200" cy="40" r="20" {...CIRCLE_ATTRIBUTES} />
      <circle cx="200" cy="200" r="20" {...CIRCLE_ATTRIBUTES} />
    </svg>
  )
}

export { App }
