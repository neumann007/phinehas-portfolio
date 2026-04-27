import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST (req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { take_id, name, comment } = body as Record<string, unknown>

  if (
    !take_id ||
    typeof name !== 'string' ||
    typeof comment !== 'string' ||
    !name.trim() ||
    !comment.trim()
  ) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (name.trim().length > 60) {
    return NextResponse.json({ error: 'Name too long' }, { status: 400 })
  }

  if (comment.trim().length > 500) {
    return NextResponse.json({ error: 'Comment too long' }, { status: 400 })
  }

  const { error } = await supabase
    .from('take_comments')
    .insert([{ take_id, name: name.trim(), comment: comment.trim() }])

  if (error) {
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
