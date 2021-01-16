import React from "react"
import styled from 'styled-components'

const ROTATIONS = {
  up: 0,
  right: 90,
  down: 180,
  left: 270
}

const StyleWrapper = styled.div`
  background: rgba(0, 0, 0, 0);
  height: 0px;
  width: 0px;
  border-style: solid;
  border-width:
    0px
    ${props => props.leftSlopeWidth}px
    ${props => props.height}px
    ${props => props.rightSlopeWidth}px;
  border-color: ${props => props.color} transparent;
  transform-origin: 50% 50%;
  transform: rotate(${props => ROTATIONS[props.direction]}deg);
`

export const Triangle = props => <StyleWrapper {...props} />
