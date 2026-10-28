import { useMemo, useState } from 'react'
import { CATEGORIES } from '../data/projects'
import { getStatus } from '../lib/progress'
import { formatDate, shortRemaining, windowLabel } from '../lib/format'
import CategoryTag from './CategoryTag'
import StatusPill from './StatusPill'

const LEVELS = ['Introductory', 'Intermediate', 'Advanced']
const STATUS_FILTERS = [
  { id: 'all', label: 'All projects' },
  { id: 'open', label: 'Not started' },
  { id: 'active', label: 'Started' },
  { id: 'submitted', label: 'Submitted' },
]
const SORTS = {
  newest: { label: 'Newest first', fn: (a, b) => b.postedOn.localeCompare(a.postedOn) },
  closing: { label: 'Closing soonest', fn: (a, b) => a.closesOn.localeCompare(b.closesOn) },
  window: { label: 'Shortest window', fn: (a, b) => a.windowHours - b.windowHours },
}

export default function ProjectList({ projects, progress, now }) {
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [level, setLevel] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  const withStatus = useMemo(
    () => projects.map((p) => ({ ...p, status: getStatus(p, progress[p.id], now) })),
    [projects, progress, now],
  )

  const counts = useMemo(() => {
    const c = {}
    for (const p of projects) c[p.category] = (c[p.category] || 0) + 1
    return c
  }, [projects])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return withStatus
      .filter((p) => !categories.length || categories.includes(p.category))
      .filter((p) => !level || p.level === level)
      .filter((p) => {
        if (statusFilter === 'all') return true
        if (statusFilter === 'active') return p.status.state === 'active' || p.status.state === 'expired'
        return p.status.state === statusFilter
      })
      .filter(
        (p) =>
          !q ||
          [p.title, p.company, p.summary, ...p.skills].some((s) => s.toLowerCase().includes(q)),
      )
      .sort(SORTS[sort].fn)
  }, [withStatus, categories, level, statusFilter, query, sort])

  const inProgress = withStatus
    .filter((p) => p.status.state === 'active')
    .sort((a, b) => a.status.msLeft - b.status.msLeft)

  const toggleCategory = (id) =>
    setCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))

  const clearFilters = () => {
    setQuery('')
    setCategories([])
    setLevel('')
    setStatusFilter('all')
  }

  const companies = new Set(projects.map((p) => p.company)).size

  return (
    <>
      <section className="intro">
        <div className="intro__text">
          <p className="eyebrow">Autumn trimester 2026</p>
          <h1>Work on a real problem from an Irish employer</h1>
          <p className="lede">
            Pick a brief in your field, download the problem pack and submit your solution before
            the clock runs out. Strong submissions go straight to the company’s hiring team.
          </p>
        </div>
        <dl className="intro__stats">
          <div>
            <dt>Live projects</dt>
            <dd>{projects.length}</dd>
          </div>
          <div>
            <dt>Companies</dt>
            <dd>{companies}</dd>
          </div>
          <div>
            <dt>Disciplines</dt>
            <dd>{Object.keys(counts).length}</dd>
          </div>
        </dl>
      </section>

      {inProgress.length > 0 && (
        <section className="reminder" aria-label="Your projects in progress">
          <strong>
            {inProgress.length === 1
              ? 'You have 1 project in progress.'
              : `You have ${inProgress.length} projects in progress.`}
          </strong>{' '}
          Next deadline:{' '}
          <a href={`#project-${inProgress[0].id}`}>{inProgress[0].title}</a>,{' '}
          {shortRemaining(inProgress[0].status.msLeft)}.
        </section>
      )}

      <section className="browse">
        <aside className="filters" aria-label="Filters">
          <div className="field">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="search"
              placeholder="Title, company or skill"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <fieldset className="field">
            <legend>Discipline</legend>
            <div className="chips">
              {CATEGORIES.filter((c) => counts[c.id]).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="chip"
                  style={{ '--hue': c.hue }}
                  aria-pressed={categories.includes(c.id)}
                  onClick={() => toggleCategory(c.id)}
                >
                  {c.label}
                  <span className="chip__count">{counts[c.id]}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="level">Level</label>
            <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Any level</option>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <fieldset className="field">
            <legend>My progress</legend>
            <div className="segmented">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={statusFilter === s.id}
                  onClick={() => setStatusFilter(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
        </aside>

        <div className="results">
          <div className="results__bar">
            <p>
              <strong>{visible.length}</strong> {visible.length === 1 ? 'project' : 'projects'}
            </p>
            <label className="sort">
              Sort by
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([id, s]) => (
                  <option key={id} value={id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {visible.length ? (
            <ul className="cards">
              {visible.map((p) => (
                <li key={p.id}>
                  <a className="card" href={`#project-${p.id}`}>
                    <div className="card__top">
                      <CategoryTag id={p.category} />
                      <StatusPill status={p.status} />
                    </div>
                    <h2 className="card__title">{p.title}</h2>
                    <p className="card__company">{p.company}</p>
                    <p className="card__summary">{p.summary}</p>
                    <dl className="card__meta">
                      <div>
                        <dt>Window</dt>
                        <dd>{windowLabel(p.windowHours)}</dd>
                      </div>
                      <div>
                        <dt>Level</dt>
                        <dd>{p.level}</dd>
                      </div>
                      <div>
                        <dt>Closes</dt>
                        <dd>{formatDate(p.closesOn)}</dd>
                      </div>
                    </dl>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <p>No projects match these filters.</p>
              <button type="button" className="btn btn--ghost" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="how">
        <h2>How it works</h2>
        <ol>
          <li>
            <strong>Choose a brief.</strong> Filter by discipline and read the full problem
            statement before you commit.
          </li>
          <li>
            <strong>Download the problem pack.</strong> Your submission window starts the moment
            you download. Each project sets its own window, from 2 to 5 days.
          </li>
          <li>
            <strong>Submit before the deadline.</strong> Upload your files from the project page.
            Submissions close automatically when the window ends.
          </li>
        </ol>
      </section>
    </>
  )
}
