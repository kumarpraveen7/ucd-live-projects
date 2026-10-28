export default function Header() {
  return (
    <header className="site-header">
      <div className="page site-header__inner">
        <a href="#" className="brand">
          <span className="brand__mark" aria-hidden="true">UCD</span>
          <span className="brand__text">
            <strong>Live Projects</strong>
            <span>Real briefs from industry, for UCD students</span>
          </span>
        </a>
        <nav className="site-nav" aria-label="Main">
          <a href="#">Browse projects</a>
          <a href="#how-it-works">How it works</a>
        </nav>
      </div>
    </header>
  )
}
