import { shortRemaining } from '../lib/format'

const HOUR = 3600 * 1000

export default function StatusPill({ status }) {
  switch (status.state) {
    case 'active': {
      const tone = status.msLeft < HOUR ? 'critical' : status.msLeft < 12 * HOUR ? 'warning' : 'active'
      return <span className={`pill pill--${tone}`}>In progress · {shortRemaining(status.msLeft)}</span>
    }
    case 'submitted':
      return <span className="pill pill--done">Submitted</span>
    case 'expired':
      return <span className="pill pill--critical">Window closed</span>
    default:
      return null
  }
}
