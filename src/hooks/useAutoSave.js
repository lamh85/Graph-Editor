import { useState, useEffect, useRef } from 'react'
import { useMutation } from "react-query"

import { useInterval } from './useInterval'

export const useAutoSave = ({
  interval,
  debouncedState,
  queryFunction,
  handleSuccess,
  handleError
}) => {
  const [stateVersionId, setStateVersionId] = useState(0)
  const [versionFulfilled, setVersionFulfilled] = useState(0)

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading: isRequestLoading,
    isSuccess,
    mutate
  } = useMutation(
    queryFunction,
    {
      onSuccess: handleSuccess,
      onError: handleError
    }
  )

  useEffect(() => {
    setStateVersionId(stateVersionId + 1)
  }, [debouncedState])

  const stateRef = useRef()
  stateRef.current = {
    stateVersionId,
    versionFulfilled,
    isRequestLoading,
    debouncedState
  }

  // CAUTION: The states inside will become stale because the function
  // will be called inside setInterval. Should store the states inside a
  // ref.
  const handleTick = () => {
    const ref = stateRef.current

    const versionSnapshot = ref.stateVersionId

    // TODO: stop interval if state stopped changing
      // conditions: no new state since last tick + last state was handled
    const didRequestLatest = versionSnapshot === ref.versionFulfilled
    if (didRequestLatest || ref.isRequestLoading) return

    setVersionFulfilled(versionSnapshot)
    console.log('calling mutate -----')
    mutate(ref.debouncedState)
  }

  const {
    startInterval: startAutoSave,
    endInterval: endAutoSave,
    isIntervalSet: didStartAutoSave
  } = useInterval({
    interval,
    handleTick,
    shouldSetIntervalOnStart: false
  })

  return { startAutoSave, endAutoSave, didStartAutoSave }
}
