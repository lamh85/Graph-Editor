import { useState } from "react"

export const useArray = initialValue => {
  const [state, setState] = useState(initialValue)

  const find = id => state.find(item => item.id === id)

  const highestId = state
    .map(items => items.id)
    .reverse()[0]

  const newId = highestId + 1

  const push = item => setState(
    [...state, { ...item, id: newId }]
  )

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

  const updateItem = ({ id, property, value, propertySet }) => {
    const index = state.findIndex(item => item.id === id)
    if (index === -1) return

    let newProperties = { [property]: value }
    if (propertySet) {
      newProperties = propertySet
    }

    const updatedItem = {
      ...[...state][index],
      ...newProperties
    }

    const newState = [...state]
    newState.splice(index, 1, updatedItem)
    setState(newState)
  }

  return {
    state,
    find,
    push,
    removeByProperty,
    removeByValue,
    updateItem
  }
}
