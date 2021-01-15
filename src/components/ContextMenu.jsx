import React, { useState } from "react"
import styled from 'styled-components'

const StyledContextMenu = styled.div`
  width: 100px;
  background: white;
  position: absolute;
  left: ${props => props.left || 0}px;
  top: ${props => props.top || 0}px
`

const handleItemClick = ({ event, clickAction, closeMenu }) => {
  console.log('handleItemClick')
  // event.preventDefault()
  clickAction(event)
  closeMenu()
}

export const ContextMenu = ({ nodeRef, coordX, coordY, items, closeMenu }) => {
  return (
    <StyledContextMenu
      ref={nodeRef}
      left={coordX}
      top={coordY}
    >
      {items && items.map(item => {
        const { clickAction, display } = item
        return (
          <div
            onClick={event => handleItemClick({
              event,
              clickAction,
              closeMenu
            })}
          >
            {display}
          </div>
        )
      })}
    </StyledContextMenu>
  )
}
