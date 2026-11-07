/**
 * One IntersectionObserver per root margin, shared by every Reveal on the page.
 * A page has ~20 reveal targets; 20 separate observers is 20 sets of bookkeeping
 * for what the browser can do in one.
 */

type Callback = () => void

const observers = new Map<string, IntersectionObserver>()
const callbacks = new WeakMap<Element, Callback>()

function observerFor(rootMargin: string) {
  let io = observers.get(rootMargin)
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const cb = callbacks.get(entry.target)
          // Reveals fire once and stay, so unobserve immediately rather than
          // keeping a live entry for something that can never change again.
          io?.unobserve(entry.target)
          callbacks.delete(entry.target)
          cb?.()
        }
      },
      { rootMargin, threshold: 0 }
    )
    observers.set(rootMargin, io)
  }
  return io
}

/** Runs `cb` the first time `el` scrolls into view. Returns a cleanup. */
export function onReveal(el: Element, rootMargin: string, cb: Callback) {
  const io = observerFor(rootMargin)
  callbacks.set(el, cb)
  io.observe(el)
  return () => {
    io.unobserve(el)
    callbacks.delete(el)
  }
}
