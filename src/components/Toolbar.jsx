import React from "react"
import { MenuItem } from './common/MenuItem.jsx'

export const Toolbar = ({
  extraOptions,
  setIsPlaceCircleMode,
  setIsPlaceRectMode
}) => {
  return (
    <>
      <MenuItem onClick={() => {
        setIsPlaceCircleMode(false)
        setIsPlaceRectMode(false)
      }}>
        Default mode
      </MenuItem>
      <MenuItem onClick={() => setIsPlaceCircleMode(true)}>
        Place a circle
      </MenuItem>
      <MenuItem onClick={() => setIsPlaceRectMode(true)}>
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
