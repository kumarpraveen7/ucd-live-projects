import { useEffect, useState } from 'react'
import { PROJECTS } from './data/projects'
import { useNow, useProgress } from './lib/progress'
import Header from './components/Header'
import ProjectList from './components/ProjectList'
import ProjectDetail from './components/ProjectDetail'

const projectIdFromHash = () => {
  const m = window.location.hash.match(/^#project-(.+)$/)
  return m ? m[1] : null
}

export default function App() {
  const [projectId, setProjectId] = useState(projectIdFromHash)
  const progressApi = useProgress()
  const now = useNow()

  useEffect(() => {
    const onHash = () => {
      setProjectId(projectIdFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const project = PROJECTS.find((p) => p.id === projectId)

  return (
    <>
      <Header />
      <main className="page">
        {project ? (
          <ProjectDetail project={project} now={now} {...progressApi} />
        ) : (
          <ProjectList projects={PROJECTS} progress={progressApi.progress} now={now} />
        )}
      </main>
      <footer className="footer page">
        <p>
          Prototype. Projects, companies and files are examples. Your progress is saved in this
          browser only.
        </p>
      </footer>
    </>
  )
}
