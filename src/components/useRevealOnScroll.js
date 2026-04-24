import { useEffect } from 'react'

export function useRevealOnScroll(selector = '[data-reveal]') {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector))
    if (elements.length === 0) return

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      for (const el of elements) el.dataset.reveal = 'in'
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.dataset.reveal = 'in'
            io.unobserve(entry.target)
          }
        }
      },
      { root: null, threshold: 0.12 },
    )

    for (const el of elements) io.observe(el)
    return () => io.disconnect()
  }, [selector])
}

