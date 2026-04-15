import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, author_name, category, passcode } = body

    const isHer = passcode === process.env.HER_PASSCODE
    const isAdmin = passcode === process.env.ADMIN_PASSCODE

    if (!isHer && !isAdmin) {
      return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 })
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const finalName = isHer ? 'Me' : author_name?.trim() || 'Anonymous'

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('messages')
      .insert({ content: content.trim(), author_name: finalName, category })
      .select()
      .single()

    if (error) throw error
    
    // Clear the home page cache so the new message shows up after refresh
    revalidatePath('/')
    
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
