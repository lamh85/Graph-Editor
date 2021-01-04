import React from 'react'
import styled from 'styled-components'

const StyledG = styled.g`
`

const buildIncrementedSeries = (maximum, increment) => {
  const series = [0]
  const validatedIncrement = parseInt(increment)

  let nextItem = series[series.length - 1] + validatedIncrement
  while (nextItem < maximum) {
    series.push(nextItem)
    nextItem = series[series.length - 1] + validatedIncrement
  }

  return series
}

const ParallelLines = ({ svgWidth, svgHeight, increment, lineOrientation }) => {
  let seriesMaximum = svgHeight
  if (lineOrientation === 'vertical') {
    seriesMaximum = svgWidth
  }

  const incrementedSeries = buildIncrementedSeries(seriesMaximum, increment)

  return incrementedSeries.map((seriesItem, index) => {
    let coordinates = {
      x1: 0,
      y1: seriesItem,
      x2: svgWidth,
      y2: seriesItem
    }

    if (lineOrientation === 'vertical') {
      coordinates = {
        x1: seriesItem,
        y1: 0,
        x2: seriesItem,
        y2: svgHeight
      }
    }

    return <line key={index} {...coordinates} strokeWidth="1" stroke="white" />
  })
}

const ParallelLinesSets = ({ svgWidth, svgHeight, increment }) => {
  const baseProps = { svgWidth, svgHeight, increment }

  return (
    <>
      <ParallelLines {...baseProps} lineOrientation="horizontal" />
      <ParallelLines {...baseProps} lineOrientation="vertical" />
    </>
  )
}

const Grid = ({
  height,
  width
}) => {
  return (
    <StyledG>
      <ParallelLinesSets svgWidth={width} svgHeight={height} increment="10" />
    </StyledG>
  )
}

export { Grid }
