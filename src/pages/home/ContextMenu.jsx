import React, { useState } from 'react'
import styled from 'styled-components'

import { Triangle } from '../../components/Triangle.jsx'
import { MenuItem } from '../../components/MenuItem.jsx'

const StyledContextMenu = styled.div`
  max-width: 200px;
  background: white;
  position: absolute;
  left: ${(props) => props.left || 0}px;
  top: ${(props) => props.top || 0}px;
`

const handleItemClick = ({ event, clickAction, closeMenu }) => {
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
    <StyledContextMenu ref={nodeRef} left={coordX} top={coordY}>
      {items &&
        items.map((item, index) => {
          return (
            <MenuItem
              key={`context-menu-item-${index}`}
              onClick={(event) =>
                handleItemClick({
                  event,
                  clickAction: item.onClick,
                  closeMenu,
                })
              }
            >
              {item.display}
              {item.subItems && RightIcon}
            </MenuItem>
          )
        })}
    </StyledContextMenu>
  )
}
