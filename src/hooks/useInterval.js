import { useState, useEffect, useRef } from "react"

export const useInterval = ({
  interval,
  handleTick,
  stateRef = { current: null },
  shouldSetIntervalOnStart = true
}) => {
  const [isIntervalSet, setIsIntervalSet] = useState(false)

  const intervalIdRef = useRef()

  useEffect(() => {
    if (isIntervalSet) {
      intervalIdRef.current = setInterval(
        () => handleTick(stateRef.current),
        interval
      )
    } else {
      clearInterval(intervalIdRef.current)
    }

    return () => clearInterval(intervalIdRef.current)
  }, [isIntervalSet])

  useEffect(() => {
    if (!shouldSetIntervalOnStart) return

    setIsIntervalSet(true)

    return () => clearInterval(intervalIdRef.current)
  }, [])

  return {
    startInterval: () => setIsIntervalSet(true),
    endInterval: () => setIsIntervalSet(false),
    isIntervalSet
  }
}
