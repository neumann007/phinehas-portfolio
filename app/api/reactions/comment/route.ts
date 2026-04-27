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

  const { comment_id, visitor_token, reaction } = body as Record<string, unknown>

  if (!comment_id || !visitor_token) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (reaction === null) {
    const { data: existing } = await supabase
      .from('comment_reactions')
      .select('reaction')
      .eq('comment_id', comment_id)
      .eq('visitor_token', visitor_token)
      .single()

    if (existing) {
      await supabase
        .from('comment_reactions')
        .delete()
        .eq('comment_id', comment_id)
        .eq('visitor_token', visitor_token)

      await supabase.rpc('decrement_comment_reaction', {
        p_comment_id: comment_id,
        p_reaction: existing.reaction,
      })
    }
    return NextResponse.json({ success: true })
  }

  const { data: existing } = await supabase
    .from('comment_reactions')
    .select('reaction')
    .eq('comment_id', comment_id)
    .eq('visitor_token', visitor_token)
    .single()

  if (existing) {
    if (existing.reaction === reaction) {
      return NextResponse.json({ success: true })
    }
    await supabase
      .from('comment_reactions')
      .update({ reaction })
      .eq('comment_id', comment_id)
      .eq('visitor_token', visitor_token)

    await supabase.rpc('switch_comment_reaction', {
      p_comment_id: comment_id,
      p_old_reaction: existing.reaction,
      p_new_reaction: reaction,
    })
  } else {
    await supabase
      .from('comment_reactions')
      .insert([{ comment_id, visitor_token, reaction }])

    await supabase.rpc('increment_comment_reaction', {
      p_comment_id: comment_id,
      p_reaction: reaction,
    })
  }

  return NextResponse.json({ success: true })
}
