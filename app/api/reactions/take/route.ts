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

  const { take_id, visitor_token, reaction } = body as Record<string, unknown>

  if (!take_id || !visitor_token) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (reaction === null) {
    const { data: existing } = await supabase
      .from('take_reactions')
      .select('reaction')
      .eq('take_id', take_id)
      .eq('visitor_token', visitor_token)
      .single()

    if (existing) {
      await supabase
        .from('take_reactions')
        .delete()
        .eq('take_id', take_id)
        .eq('visitor_token', visitor_token)

      await supabase.rpc('decrement_take_reaction', {
        p_take_id: take_id,
        p_reaction: existing.reaction,
      })
    }
    return NextResponse.json({ success: true })
  }

  const { data: existing } = await supabase
    .from('take_reactions')
    .select('reaction')
    .eq('take_id', take_id)
    .eq('visitor_token', visitor_token)
    .single()

  if (existing) {
    if (existing.reaction === reaction) {
      return NextResponse.json({ success: true })
    }
    await supabase
      .from('take_reactions')
      .update({ reaction })
      .eq('take_id', take_id)
      .eq('visitor_token', visitor_token)

    await supabase.rpc('switch_take_reaction', {
      p_take_id: take_id,
      p_old_reaction: existing.reaction,
      p_new_reaction: reaction,
    })
  } else {
    await supabase
      .from('take_reactions')
      .insert([{ take_id, visitor_token, reaction }])

    await supabase.rpc('increment_take_reaction', {
      p_take_id: take_id,
      p_reaction: reaction,
    })
  }

  return NextResponse.json({ success: true })
}
