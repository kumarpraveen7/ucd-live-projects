import { useState } from 'react'
import Countdown from './Countdown'
import { formatBytes, formatDate, formatDateTime } from '../lib/format'

const HOUR = 3600 * 1000

export default function SubmissionPanel({ project: p, entry, status, onSubmit }) {
  const [files, setFiles] = useState([])
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!files.length) {
      setError('Add at least one file before you submit.')
      return
    }
    onSubmit({ files: files.map((f) => ({ name: f.name, size: f.size })), note: note.trim() })
  }

  if (status.state === 'open') {
    return (
      <section className="panel panel--muted">
        <h2>Submission</h2>
        <p>The submission form opens once you download the problem pack.</p>
      </section>
    )
  }

  if (status.state === 'submitted') {
    return (
      <section className="panel panel--done">
        <h2>Submitted</h2>
        <p>
          Received {formatDateTime(entry.submission.at)}. {p.company} reviews all submissions
          after the project closes on {formatDate(p.closesOn)}.
        </p>
        <ul className="file-list">
          {entry.submission.files.map((f) => (
            <li key={f.name}>
              {f.name} <span>{formatBytes(f.size)}</span>
            </li>
          ))}
        </ul>
        {entry.submission.note && <blockquote>{entry.submission.note}</blockquote>}
      </section>
    )
  }

  if (status.state === 'expired') {
    return (
      <section className="panel panel--closed">
        <h2>Window closed</h2>
        <p>
          Your window ended {formatDateTime(status.deadline)}. Submissions for this project are now
          locked.
        </p>
      </section>
    )
  }

  return (
    <section className="panel">
      <h2>Time left to submit</h2>
      <Countdown msLeft={status.msLeft} totalMs={p.windowHours * HOUR} />
      <p className="note">
        Started {formatDateTime(entry.startedAt)} · Due <strong>{formatDateTime(status.deadline)}</strong>
      </p>

      <form className="submit-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="files">Your files</label>
          <input
            id="files"
            type="file"
            multiple
            onChange={(e) => {
              setFiles([...e.target.files])
              setError('')
            }}
          />
          <span className="hint">Expected: {p.deliverables.join('; ')}</span>
        </div>
        <div className="field">
          <label htmlFor="note">Note to the company (optional)</label>
          <textarea
            id="note"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Links to a repository, assumptions you made…"
          />
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--primary btn--block">
          Submit solution
        </button>
      </form>
    </section>
  )
}
