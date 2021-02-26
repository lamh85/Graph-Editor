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
    queryArgs => {
      queryFunction(queryArgs)
    },
    {
      onSuccess: (data, queryArgs) => {
        setVersionFulfilled(queryArgs.versionId)
        handleSuccess(data)
      },
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
    isRequestLoading
  }

  // CAUTION: The states inside will become stale because the function
  // will be called inside setInterval. Should store the states inside a
  // ref.
  const handleTick = () => {
    const ref = stateRef.current

    const versionSnapshot = ref.stateVersionId

    const didRequestLatest = versionSnapshot === ref.versionFulfilled
    if (didRequestLatest || ref.isRequestLoading) return

    mutate({ versionId: versionSnapshot })
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
