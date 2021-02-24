import { useState, useEffect, useRef } from 'react'
import { useMutation } from "react-query"

import { useInterval } from './useInterval'

const fakeApiCall = payload => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve({ receivedPayload: payload })
      }, 2000)
    } catch(error) {
      reject(error)
    }
  })
}

export const useAutoSave = ({
  interval,
  debouncedState,
  queryFunction,
  handleSuccess,
  handleError
}) => {
  const [stateVersionId, setStateVersionId] = useState(1)
  const [versionHandled, setVersionHandled] = useState(0)

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
    versionHandled,
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
    const didRequestLatest = versionSnapshot === ref.versionHandled
    if (didRequestLatest || ref.isRequestLoading) return

    setVersionHandled(versionSnapshot)
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
