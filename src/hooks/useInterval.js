import { useEffect, useRef } from "react"

export const useInterval = ({
  interval,
  handleTick,
  stateRef,
  shouldSetIntervalOnStart = true
}) => {
  const intervalId = undefined
  const intervalIdRef = useRef(intervalId)

  const callSetInterval = () => {
    intervalIdRef.current = setInterval(
      () => handleTick(stateRef.current),
      interval
    )
  }

  useEffect(() => {
    if (!shouldSetIntervalOnStart) return

    callSetInterval()

    return () => clearInterval(intervalIdRef.current)
  }, [])

  const callClearInterval = () => {
    console.log('stopping')
    clearInterval(intervalIdRef.current)
  }

  return { callSetInterval, callClearInterval }
}
