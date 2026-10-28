import { splitDuration } from '../lib/format'

const HOUR = 3600 * 1000
const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ msLeft, totalMs }) {
  const { days, hours, minutes, seconds } = splitDuration(msLeft)
  const tone = msLeft < HOUR ? 'critical' : msLeft < 12 * HOUR ? 'warning' : 'ok'
  const used = Math.min(100, Math.max(0, 100 - (msLeft / totalMs) * 100))

  return (
    <div className={`countdown countdown--${tone}`} role="timer" aria-live="off">
      <div className="countdown__digits">
        {[
          [days, 'days'],
          [hours, 'hrs'],
          [minutes, 'min'],
          [seconds, 'sec'],
        ].map(([v, unit]) => (
          <div key={unit} className="countdown__unit">
            <span className="countdown__value">{pad(v)}</span>
            <span className="countdown__label">{unit}</span>
          </div>
        ))}
      </div>
      <div className="countdown__bar" aria-hidden="true">
        <span style={{ width: `${used}%` }} />
      </div>
    </div>
  )
}
