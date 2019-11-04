import { useRef, useEffect } from 'react'

const useIsMounted = (): { current: any } => {
  const refIsMounted = useRef(false)

  useEffect((): any => {
    refIsMounted.current = true

    return (): boolean => (refIsMounted.current = false)
  })

  return refIsMounted
}

export { useIsMounted }
