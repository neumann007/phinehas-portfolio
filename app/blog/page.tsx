import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export const revalidate = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Blog () {
  const { data: takes } = await supabase
    .from('takes')
    .select('id, take, tag, date, likes, dislikes, order_index')
    .eq('published', true)
    .order('order_index', { ascending: true })

  const { data: commentCounts } = await supabase
    .from('take_comments')
    .select('take_id')
    .eq('approved', true)

  const countMap: Record<string, number> = {}
  commentCounts?.forEach(c => {
    countMap[c.take_id] = (countMap[c.take_id] || 0) + 1
  })

  return (
    <main className='page'>
      <div className='blog-header'>
        <p className='mono' style={{ marginBottom: '1.25rem' }}>
          Takes
        </p>
        <h1
          className='heading-lg'
          style={{ maxWidth: '600px', marginBottom: '0.75rem' }}
        >
          Opinions on software, tools, and the industry.
        </h1>
        <p className='text-sm'>Short. Punchy. I mean them.</p>
      </div>

      {/* <div className='divider' /> */}

      <div className='takes-list'>
        {!takes || takes.length === 0 ? (
          <div className='takes-empty'>
            <div className='takes-empty__icon'>
              <svg
                width='40'
                height='40'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
              >
                <path d='M12 20h9' />
                <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
              </svg>
            </div>
            <h3 className='takes-empty__heading'>No takes yet.</h3>
            <p className='takes-empty__sub'>
              {"Opinions are loading. Check back soon — something's brewing."}
            </p>
          </div>
        ) : (
          takes.map(take => (
            <Link key={take.id} href={`/blog/${take.id}`} className='take-row'>
              <div className='take-row__meta'>
                <span className='take-row__tag'>{take.tag}</span>
                <span className='take-row__date'>{take.date}</span>
              </div>
              <p className='take-row__headline'>{take.take}</p>
              <div className='take-row__footer'>
                <div className='take-row__reactions'>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <svg
                      width='13'
                      height='13'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z' />
                      <path d='M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' />
                    </svg>
                    {take.likes}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <svg
                      width='13'
                      height='13'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z' />
                      <path d='M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17' />
                    </svg>
                    {take.dislikes}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <svg
                      width='13'
                      height='13'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
                    </svg>
                    {countMap[take.id] ?? 0}
                  </span>
                </div>
                <span className='take-row__arrow'>→</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* <div className='divider' /> */}

      <div className='got-a-take'>
        <p className='mono' style={{ marginBottom: '1rem' }}>
          Got a take?
        </p>
        <p
          className='text-body'
          style={{ maxWidth: '480px', marginBottom: '0.75rem' }}
        >
          Disagree with something? Have a stronger opinion? I&apos;m always up
          for the argument.
        </p>
        <a href='mailto:phinehasnewman@gmail.com' className='link-teal'>
          phinehasnewman@gmail.com →
        </a>
      </div>

      <footer className='footer container'>
        <span className='mono'>Phinehas Newman · 2026</span>
        <span className='mono'>Accra, Ghana</span>
      </footer>
    </main>
  )
}
