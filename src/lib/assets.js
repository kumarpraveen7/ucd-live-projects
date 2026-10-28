import JSZip from 'jszip'
import { categoryById } from '../data/projects'
import { windowLabel } from './format'

// The prototype has no real company files, so it generates stand-ins:
// a full problem statement, small sample datasets and placeholders.

function problemStatement(p) {
  const list = (items) => items.map((i) => `- ${i}`).join('\n')
  return `# ${p.title}

**Company:** ${p.company} (${p.location})
**Discipline:** ${categoryById[p.category].label}
**Level:** ${p.level} · **Expected effort:** ${p.effort}
**Submission window:** ${windowLabel(p.windowHours)}, starting from your first download

## Background
${p.context}

## Your task
${list(p.tasks)}

## What to submit
${list(p.deliverables)}

## How it will be assessed
${list(p.criteria)}

## Reward
${p.reward}
`
}

function sampleRows(p) {
  const header = 'record_id,date,value_a,value_b,label'
  const rows = Array.from({ length: 25 }, (_, i) => {
    const d = new Date(2026, 0, 1 + i * 7).toISOString().slice(0, 10)
    return `${p.id.slice(0, 3).toUpperCase()}-${1000 + i},${d},${(37 * i) % 101},${((i * 13) % 17) / 10},${i % 4 === 0 ? 1 : 0}`
  })
  return [header, ...rows].join('\n')
}

function assetContent(p, asset) {
  const ext = asset.file.split('.').pop()
  if (asset.kind === 'Brief') return { name: asset.file.replace(/\.\w+$/, '.md'), body: problemStatement(p) }
  if (ext === 'csv') return { name: asset.file, body: sampleRows(p) }
  if (ext === 'tsv') return { name: asset.file, body: sampleRows(p).replaceAll(',', '\t') }
  if (ext === 'md') return { name: asset.file, body: `# Data dictionary\n\n| Column | Meaning |\n|---|---|\n| record_id | Unique row id |\n| date | Event date |\n| value_a | Primary measure |\n| value_b | Secondary measure |\n| label | Target (1 = positive) |\n` }
  return {
    name: `${asset.file}.txt`,
    body: `Placeholder for ${asset.file} (${asset.size}).\nIn the live site this is the real file supplied by ${p.company}.\n`,
  }
}

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadAsset(p, asset) {
  const { name, body } = assetContent(p, asset)
  saveBlob(new Blob([body], { type: 'text/plain' }), name)
}

export async function downloadAll(p) {
  const zip = new JSZip()
  const folder = zip.folder(p.id)
  for (const asset of p.assets) {
    const { name, body } = assetContent(p, asset)
    folder.file(name, body)
  }
  saveBlob(await zip.generateAsync({ type: 'blob' }), `${p.id}-assets.zip`)
}
