import { useState, useEffect } from 'react-query'
import { useQuery } from "react-query"

import { useInterval } from './useInterval'

export const useAutoSave = ({
  interval,
  observedState,
  queryPath,
  handleSuccess,
  handleError,
  parseResponse
}) => {
  const [stateVersionId, setStateVersionId] = useState(0)
  const [idHandled, setIdHandled] = useState(0)

  const { isLoading: isRequestLoading } = useQuery(
    idHandled,
    () => {
      fetch(queryPath, observedState)
    }, // TODO: API function
    {
      onSuccess: handleSuccess,
      onError: handleError,
      select: parseResponse,
      enabled: stateVersionId > 1
    }
  )

  useEffect(() => {
    setStateVersionId(stateVersionId + 1)
  }, [observedState])

  const handleTick = () => {
    const didProcessObserved = stateVersionId === idHandled
    if (didProcessObserved || isRequestLoading) return

    setIdHandled(stateVersionId)
  }

  const { callSetInterval } = useInterval({
    interval,
    handleTick,
    stateRef,
    shouldSetIntervalOnStart: false
  })

  return { callSetInterval }
}
