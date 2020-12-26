import { useState } from "react"

export const useArray = initialValue => {
  const [state, setState] = useState(initialValue)

  const push = item => setState([...state, item])

  const removeByProperty = (property, value) => {
    const itemIndex = state.findIndex(item => {
      return item[property] == value
    })

    const newState = [...state]
    newState.splice(itemIndex, 1)
    setState(newState)
  }

  const removeByValue = query => {
    const itemIndex = state.findIndex(item => {
      return JSON.stringify(item) == JSON.stringify(query)
    })

    const newState = [...state]
    newState.splice(itemIndex, 1)
    setState(newState)
  }

  const updateItem = ({ id, property, value }) => {
    const index = state.findIndex(item => item.id === id)
    if (index === -1) return

    const updatedItem = {
      ...[...state][index],
      [property]: value
    }
    
    const newState = [...state]
    newState.splice(index, 1, updatedItem)
    setState(newState)
  }

  return { state, push, removeByProperty, removeByValue, updateItem }
}
