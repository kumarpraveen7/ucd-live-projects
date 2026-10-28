import { useState } from 'react'
import { getStatus } from '../lib/progress'
import { downloadAll, downloadAsset } from '../lib/assets'
import { formatDate, windowLabel } from '../lib/format'
import CategoryTag from './CategoryTag'
import StatusPill from './StatusPill'
import SubmissionPanel from './SubmissionPanel'

export default function ProjectDetail({ project: p, now, progress, startClock, submit, reset, jumpTo }) {
  const entry = progress[p.id]
  const status = getStatus(p, entry, now)
  // Pending download waiting for the student to confirm the clock start.
  const [pending, setPending] = useState(null)

  const runDownload = (target) => {
    startClock(p.id)
    if (target === 'all') downloadAll(p)
    else downloadAsset(p, target)
  }

  const requestDownload = (target) => {
    if (status.state === 'open') setPending(target)
    else runDownload(target)
  }

  const confirmStart = () => {
    runDownload(pending)
    setPending(null)
  }

  return (
    <article className="detail">
      <a href="#" className="back">← All projects</a>

      <header className="detail__head">
        <div className="detail__tags">
          <CategoryTag id={p.category} />
          <StatusPill status={status} />
        </div>
        <h1>{p.title}</h1>
        <p className="detail__company">
          {p.company} <span aria-hidden="true">·</span> {p.location}
        </p>
        <dl className="facts">
          <div>
            <dt>Submission window</dt>
            <dd>{windowLabel(p.windowHours)}</dd>
          </div>
          <div>
            <dt>Expected effort</dt>
            <dd>{p.effort}</dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd>{p.level}</dd>
          </div>
          <div>
            <dt>Last day to start</dt>
            <dd>{formatDate(p.closesOn)}</dd>
          </div>
        </dl>
      </header>

      <div className="detail__body">
        <div className="brief">
          <section>
            <h2>Background</h2>
            <p>{p.context}</p>
          </section>
          <section>
            <h2>Your task</h2>
            <ol className="steps">
              {p.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </section>
          <section>
            <h2>What to submit</h2>
            <ul>
              {p.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>How it’s assessed</h2>
            <ul>
              {p.criteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Skills you’ll use</h2>
            <ul className="skills">
              {p.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section className="reward">
            <h2>Reward</h2>
            <p>{p.reward}</p>
          </section>
        </div>

        <aside className="side">
          <section className="panel">
            <h2>Problem pack</h2>
            <ul className="assets">
              {p.assets.map((a) => (
                <li key={a.file}>
                  <span className="asset__icon" aria-hidden="true">
                    {a.file.split('.').pop()}
                  </span>
                  <span className="asset__info">
                    <span className="asset__name">{a.file}</span>
                    <span className="asset__meta">
                      {a.kind} · {a.size}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="btn btn--small btn--ghost"
                    onClick={() => requestDownload(a)}
                    aria-label={`Download ${a.file}`}
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn--primary btn--block" onClick={() => requestDownload('all')}>
              Download all files (.zip)
            </button>

            {pending && (
              <div className="confirm" role="alertdialog" aria-labelledby="confirm-title">
                <p id="confirm-title">
                  <strong>This starts your {windowLabel(p.windowHours).replace(' window', '')} clock.</strong>
                </p>
                <p>
                  You’ll have until the end of the window to submit. The clock keeps running if
                  you download the files again, and it can’t be paused.
                </p>
                <div className="confirm__actions">
                  <button type="button" className="btn btn--primary" onClick={confirmStart}>
                    Start clock and download
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => setPending(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {status.state === 'open' && !pending && (
              <p className="note">
                Your {windowLabel(p.windowHours)} starts when you download any file.
              </p>
            )}
          </section>

          <SubmissionPanel project={p} entry={entry} status={status} onSubmit={(s) => submit(p.id, s)} />

          <details className="demo">
            <summary>Prototype controls</summary>
            <p>Simulate time passing to preview each state.</p>
            <div className="demo__actions">
              <button type="button" className="btn btn--small btn--ghost" onClick={() => jumpTo(p.id, p.windowHours, 5 * 3600e3)}>
                5 hours left
              </button>
              <button type="button" className="btn btn--small btn--ghost" onClick={() => jumpTo(p.id, p.windowHours, 90e3)}>
                90 seconds left
              </button>
              <button type="button" className="btn btn--small btn--ghost" onClick={() => jumpTo(p.id, p.windowHours, -1)}>
                Expire now
              </button>
              <button type="button" className="btn btn--small btn--ghost" onClick={() => reset(p.id)}>
                Reset project
              </button>
            </div>
          </details>
        </aside>
      </div>
    </article>
  )
}
