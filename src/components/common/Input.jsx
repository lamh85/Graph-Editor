import React, { useState, useEffect } from "react"

const Input = ({ initialValue, setState, inputProps }) => {
  const [inputState, setInputState] = useState(initialValue)

  useEffect(
    () => setState(inputState),
    [inputState]
  )

  const handleChange = event => setInputState(event.target.value)

  return (
    <input
      {...inputProps}
      onChange={handleChange}
      value={inputState}
    />
  )
}

export { Input }
