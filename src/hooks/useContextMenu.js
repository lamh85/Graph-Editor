import { useState } from "react"

export const useContextMenu = () => {
  const [isRendering, setIsRendering] = useState(false)
  const [coordinates, setCoordinates] = useState({ x: null, y: null })
  const [items, setItems] = useState([])

  const render = ({ x, y, items }) => {
    setIsRendering(true)
    setCoordinates({ x, y })
    setItems(items)
  }

  const unRender = () => setIsRendering(false)

  return {
    render,
    unRender,
    isRendering,
    coordinates,
    items
  }
}
