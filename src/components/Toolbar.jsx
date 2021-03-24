import React from "react"
import { MenuItem } from './common/MenuItem.jsx'

export const Toolbar = ({
  extraOptions,
  drawingTools
}) => {
  return (
    <>
      <MenuItem onClick={drawingTools.stopTool}>
        Default mode
      </MenuItem>
      <MenuItem onClick={() => drawingTools.handleMenuSelection({
        toolType: 'DRAW',
        shapeSelected: 'circle'
      })}>
        Place a circle
      </MenuItem>
      <MenuItem onClick={() => drawingTools.handleMenuSelection({
        toolType: 'DRAW',
        shapeSelected: 'rectangle'
      })}>
        Place a rectangle
      </MenuItem>

      {extraOptions.map((item, index) => {
        return (
          <MenuItem onClick={item.onClick} key={`extra${index}`}>
            {item.display}
          </MenuItem>
        )
      })}
    </>
  )
}
