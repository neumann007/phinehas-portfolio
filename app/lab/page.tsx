import TheLab from '@/components/TheLab'

export const metadata = {
  title: 'The Lab — Phinehas Newman',
  description: 'Real engineering decisions. Naive code vs expert code, with annotations.',
}

export default function LabPage() {
  return (
    <main className="page">
      <section className="lab-page-header container">
        <p className="mono lab-page-header__label">The Lab</p>
        <h1 className="heading-xl">
          Naive vs expert.
          <br />
          <span className="teal">Annotated.</span>
        </h1>
        <p className="text-body" style={{ maxWidth: '520px', marginTop: '1rem' }}>
          Ten real engineering problems. Watch the naive solution first,
          then see how an expert rewrites it — and why every change matters.
        </p>
      </section>

      <div className="divider" />

      <div className="lab-page-body">
        <TheLab />
      </div>

      <div className="divider" />

      <footer className="footer container">
        <span className="mono">Phinehas Newman · 2026</span>
        <span className="mono">Accra, Ghana</span>
      </footer>
    </main>
  )
}
