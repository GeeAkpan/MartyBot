import { useEffect, useReducer, useRef } from 'react'
import { initialState, reducer } from './engine'

/** Runs the playground simulation: price ticks and copy-trade events. */
export function useMartySim(active: boolean) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const hasToken = !!state.token
  const copying = !!state.copy

  // Price moves about once a second while the playground is on screen.
  useEffect(() => {
    if (!active || !hasToken) return
    const id = window.setInterval(() => {
      if (!document.hidden) dispatch({ type: 'tick' })
    }, 1000)
    return () => window.clearInterval(id)
  }, [active, hasToken])

  // The copied wallet trades every ~8 seconds.
  useEffect(() => {
    if (!active || !copying) return
    const id = window.setInterval(() => {
      if (!document.hidden) dispatch({ type: 'copyTrade' })
    }, 8000)
    return () => window.clearInterval(id)
  }, [active, copying])

  return [state, dispatch] as const
}

/** True while the element is (nearly) on screen. */
export function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useReducer((_: boolean, v: boolean) => v, false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible] as const
}
