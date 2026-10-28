export function windowLabel(hours) {
  return hours % 24 === 0 ? `${hours / 24}-day window` : `${hours}-hour window`
}

export function splitDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

export function shortRemaining(ms) {
  const { days, hours, minutes } = splitDuration(ms)
  if (days) return `${days}d ${hours}h left`
  if (hours) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}

const dateFmt = new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })
const dateTimeFmt = new Intl.DateTimeFormat('en-IE', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export const formatDate = (d) => dateFmt.format(new Date(d))
export const formatDateTime = (d) => dateTimeFmt.format(new Date(d))

export function formatBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}
