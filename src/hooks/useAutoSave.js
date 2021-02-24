import { useState, useEffect } from 'react'
import { useMutation } from "react-query"

import { useInterval } from './useInterval'

const fakeApiCall = payload => {
  return new Promise((resolve, reject) => {
    console.log('starting fake API call ---------')
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
  const [stateVersionId, setStateVersionId] = useState(0)
  const [versionHandled, setVersionHandled] = useState(0)
  const [lastTickVersion, setLastTickVersion] = useState(0)

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

  const handleTick = () => {
    const snapshotVersion = stateVersionId

    setLastTickVersion(snapshotVersion)
    // TODO: stop interval if state stopped changing
      // conditions: no new state since last tick + last state was handled

    const didRequestLatest = snapshotVersion === versionHandled
    if (didRequestLatest || isRequestLoading) return

    setVersionHandled(snapshotVersion)
    mutate(debouncedState)
  }

  const {
    callSetInterval,
    callClearInterval
  } = useInterval({
    interval,
    handleTick,
    shouldSetIntervalOnStart: false
  })

  return { callSetInterval, callClearInterval }
}
