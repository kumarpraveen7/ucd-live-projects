import { categoryById } from '../data/projects'

export default function CategoryTag({ id }) {
  const cat = categoryById[id]
  return (
    <span className="cat-tag" style={{ '--hue': cat.hue }}>
      {cat.label}
    </span>
  )
}
