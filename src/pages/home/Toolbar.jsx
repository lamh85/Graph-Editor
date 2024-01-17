import React from 'react'
import styled from 'styled-components'

import { MenuItem } from '../../components/MenuItem.jsx'

const StyleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const Toolbar = ({ extraOptions, drawingTools }) => {
  return (
    <StyleWrapper>
      <MenuItem onClick={drawingTools.stopTool}>Default mode</MenuItem>
      <MenuItem
        onClick={() =>
          drawingTools.handleMenuSelection({
            toolType: 'DROP',
            shapeSelected: 'circle',
          })
        }
      >
        Place a circle
      </MenuItem>
      <MenuItem
        onClick={() =>
          drawingTools.handleMenuSelection({
            toolType: 'DROP',
            shapeSelected: 'rectangle',
          })
        }
      >
        Place a rectangle
      </MenuItem>

      {extraOptions.map((item, index) => {
        return (
          <MenuItem onClick={item.onClick} key={`extra${index}`}>
            {item.display}
          </MenuItem>
        )
      })}
    </StyleWrapper>
  )
}
