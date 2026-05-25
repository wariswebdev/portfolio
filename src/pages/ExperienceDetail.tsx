import React from 'react'
import { useParams, Link } from 'react-router-dom'

const contentMap: Record<string, { title: string; challenge: string; techDecision: string; outcome: string }> = {
  'innova-360': {
    title: 'Innova 360 — AccuRack Inventory & Forecasting',
    challenge:
      'Faced with incomplete telemetry and complex demand signals, the AccuRack forecasting feature needed reliable short-term inventory predictions under tight latency and resource constraints.',
    techDecision:
      'I chose a pragmatic microservice approach: a Node.js/Express forecasting service that consumed preprocessed events from a message queue, backed by a lightweight PostgreSQL time-series schema. The frontend used React to fetch REST endpoints with optimistic UI updates. This balanced low operational overhead with the ability to iterate the model without disrupting core order flows.',
    outcome:
      'Achieved a 22% reduction in stockouts by deploying a focused forecasting microservice (Z) as measured by a 22% drop in out-of-stock incidents over three months (Y) through improved short-term demand predictions and tighter API-driven replenishment flows (X).'
  },
  'freelance-work': {
    title: 'Freelance Product Engineering — Diverse Client Projects',
    challenge:
      'Clients required rapid, production-ready features across different domains (LMS, e-commerce, barcode integrations) often with ambiguous requirements and constrained budgets.',
    techDecision:
      'I standardized on a small, composable stack (React + Node/Express + PostgreSQL/Firebase) with clear API contracts and CI-driven deployments. For integrations like barcode scanning and PDF generation I used focused libraries and serverless functions to keep costs low while ensuring maintainability.',
    outcome:
      'Achieved faster time-to-market by 50% (X) by adopting reusable templates and serverless integrations (Z), measured by a 50% reduction in MVP delivery time across engagements (Y).'
  }
}

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>()
  const data = id ? contentMap[id] : undefined

  if (!data) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Experience not found</h2>
        <p>The requested experience page could not be located.</p>
        <Link to="/" className="btn btn-primary">Back</Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1rem' }}>Back to Home</Link>
      <h1 style={{ marginBottom: '1rem' }}>{data.title}</h1>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Challenge</h3>
        <p>{data.challenge}</p>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Technical Decision</h3>
        <p>{data.techDecision}</p>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>The Outcome</h3>
        <p>{data.outcome}</p>
      </section>

    </div>
  )
}
