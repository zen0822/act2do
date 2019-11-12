import {
  useState,
  useCallback,
  useRef,
  useEffect
} from 'react'

/**
 * 计算节点长度和高度
 */
export function useClientRect(): any {
  const [rect, setRect] = useState(null)
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect())
    }
  }, [])

  return [rect, ref]
}

/**
 * 是否已经安装了 dom
 */
export const useIsMounted = (): { current: any } => {
  const refIsMounted = useRef(false)

  useEffect((): any => {
    refIsMounted.current = true

    return (): boolean => (refIsMounted.current = false)
  })

  return refIsMounted
}

/**
 * 获取上一轮的 props 或 state
 *
 * @param value
 */
export function usePre<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * setInterval
 *
 * @param callback
 * @param delay
 */
export function useInterval(callback: Function, delay: number | null): any {
  const savedCallback = useRef<Function>()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (delay !== null) {
      const id = window.setInterval(function tick() {
        savedCallback.current && savedCallback.current()
      }, delay)

      return (): any => window.clearInterval(id)
    }
  }, [delay])
}
