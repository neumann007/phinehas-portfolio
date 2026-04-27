import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import TakeDetail from '@/components/TakeDetail'

export const revalidate = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function TakePage ({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [{ data: take }, { data: comments }] = await Promise.all([
    supabase
      .from('takes')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single(),
    supabase
      .from('take_comments')
      .select('*')
      .eq('take_id', id)
      .eq('approved', true)
      .order('created_at', { ascending: true }),
  ])

  if (!take) notFound()

  return (
    <main style={{ paddingTop: '72px' }}>
      <TakeDetail take={take} comments={comments ?? []} />
    </main>
  )
}
