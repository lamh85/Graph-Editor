import React, { useState } from "react"
import styled from 'styled-components'

import { Triangle } from './common/Triangle.jsx'

const StyledContextMenu = styled.div`
  max-width: 200px;
  background: white;
  position: absolute;
  left: ${props => props.left || 0}px;
  top: ${props => props.top || 0}px;
`

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border: 1px solid grey;

  &:hover {
    background: yellow;
  }
`

const handleItemClick = ({ event, clickAction, closeMenu }) => {
  console.log('handleItemClick')
  // event.preventDefault()
  clickAction(event)
  closeMenu()
}

const RightIcon = (
  <Triangle
    leftSlopeWidth={10}
    height={20}
    rightSlopeWidth={10}
    color="black"
    direction="right"
  />
)

export const ContextMenu = ({ nodeRef, coordX, coordY, items, closeMenu }) => {
  return (
    <StyledContextMenu
      ref={nodeRef}
      left={coordX}
      top={coordY}
    >
      {items && items.map(item => {
        return (
          <MenuItem
            onClick={event => handleItemClick({
              event,
              clickAction: item.onClick,
              closeMenu
            })}
          >
            {item.display}
            { item.subItems && RightIcon }
          </MenuItem>
        )
      })}
    </StyledContextMenu>
  )
}
