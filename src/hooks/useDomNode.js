import { useRef } from "react"
import { getAncestry, doShareAncestry } from '../helpers/dom'

export const useDomNode = () => {
  const ref = useRef()

  const element = ref.current

  const boundingClientRect = element?.getBoundingClientRect()

  const ancestors = getAncestry(element)

  const doAncestorsInclude = testedAncestor => {
    return doShareAncestry(element, testedAncestor)
  }

  return {
    ref,
    scrollOffsetX: boundingClientRect?.x,
    scrollOffsetY: boundingClientRect?.y,
    ancestors,
    doAncestorsInclude
  }
}
