import { useState, useEffect, useRef } from "react"

export const useInterval = ({
  interval,
  handleTick,
  stateRef = { current: null },
  shouldSetIntervalOnStart = true
}) => {
  const [isIntervalSet, setIsIntervalSet] = useState(false)

  const intervalIdRef = useRef()

  const callSetInterval = () => {
    intervalIdRef.current = setInterval(
      () => handleTick(stateRef.current),
      interval
    )

    setIsIntervalSet(true)
  }

  useEffect(() => {
    if (!shouldSetIntervalOnStart) return

    callSetInterval()

    return () => clearInterval(intervalIdRef.current)
  }, [])

  const callClearInterval = () => {
    clearInterval(intervalIdRef.current)
    setIsIntervalSet(false)
  }

  return {
    callSetInterval,
    callClearInterval,
    isIntervalSet
  }
}
