import { useState, useEffect } from "react"

const useTimeout = () => {
  const [timeoutExists, setTimeoutExists] = useState(false)

  let intervalId

  const setTimeoutState = ({
    processObserved,
    interval
  }) => {
    intervalId = setTimeout(
      () => {
        processObserved()
        clearIntervalState()
      },
      interval
    )
    setTimeoutExists(true)
  }

  const clearIntervalState = () => {
    clearInterval(intervalId)
    setTimeoutExists(false)
  }

  return { timeoutExists, setTimeoutState }
}

export const useDebounce = ({
  processObserved,
  interval,
  observed
}) => {
  const {
    timeoutExists,
    setTimeoutState
  } = useTimeout()

  const debounce = observedLatest => {
    if (timeoutExists) return

    setTimeoutState({
      processObserved: () => processObserved(observedLatest),
      interval
    })
  }

  const normalizedObserved =
    Array.isArray(observed)
      ? observed
      : [observed]

  useEffect(
    () => debounce(normalizedObserved),
    normalizedObserved
  )
}
