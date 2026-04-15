import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { passcode } = await request.json()

    const isHer = passcode === process.env.HER_PASSCODE
    const isAdmin = passcode === process.env.ADMIN_PASSCODE

    if (!isHer && !isAdmin) {
      return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    if (isAdmin) {
      // Admin can only delete within 10 seconds of creation
      const { data: message, error: fetchError } = await supabase
        .from('messages')
        .select('created_at')
        .eq('id', id)
        .single()

      if (fetchError || !message) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 })
      }

      const ageSeconds = (Date.now() - new Date(message.created_at).getTime()) / 1000
      if (ageSeconds > 10) {
        return NextResponse.json({ error: 'Delete window expired' }, { status: 403 })
      }
    }

    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
