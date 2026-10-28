import { useCallback, useEffect, useState } from 'react'

// Prototype only: progress lives in this browser. The full build stores
// startedAt on the server so a student can't reset the clock.
const KEY = 'ucd-live-projects:v1'
const HOUR = 60 * 60 * 1000

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage blocked (private window): progress lasts for this visit only.
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  useEffect(() => save(progress), [progress])

  const update = useCallback((id, fn) => {
    setProgress((prev) => {
      const next = { ...prev }
      const value = fn(prev[id])
      if (value) next[id] = value
      else delete next[id]
      return next
    })
  }, [])

  // The clock starts on the first download and never restarts.
  const startClock = useCallback(
    (id) => update(id, (p) => (p?.startedAt ? p : { ...p, startedAt: Date.now() })),
    [update],
  )

  const submit = useCallback(
    (id, submission) => update(id, (p) => ({ ...p, submission: { ...submission, at: Date.now() } })),
    [update],
  )

  const reset = useCallback((id) => update(id, () => null), [update])

  // Demo helper: move the start time back so the clock shows `msLeft` remaining.
  const jumpTo = useCallback(
    (id, windowHours, msLeft) =>
      update(id, (p) => ({ ...p, startedAt: Date.now() - windowHours * HOUR + msLeft })),
    [update],
  )

  return { progress, startClock, submit, reset, jumpTo }
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}

export function getStatus(project, entry, now) {
  if (!entry?.startedAt) return { state: 'open' }
  const deadline = entry.startedAt + project.windowHours * HOUR
  if (entry.submission) {
    return { state: 'submitted', deadline }
  }
  const msLeft = deadline - now
  if (msLeft <= 0) return { state: 'expired', deadline, msLeft: 0 }
  return { state: 'active', deadline, msLeft }
}
