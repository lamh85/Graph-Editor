import React from "react"
import { MenuItem } from './common/MenuItem.jsx'

export const Toolbar = ({
  extraOptions,
  setPaintbrushShape
}) => {
  return (
    <>
      <MenuItem onClick={() => {
        setPaintbrushShape(null)
      }}>
        Default mode
      </MenuItem>
      <MenuItem onClick={() => setPaintbrushShape('circle')}>
        Place a circle
      </MenuItem>
      <MenuItem onClick={() => setPaintbrushShape('rectangle')}>
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
