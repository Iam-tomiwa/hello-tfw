import { createServerSupabaseClient } from '@/lib/supabase'
import { Message } from '@/lib/types'
import MainClient from '@/components/MainClient'

export default async function Home() {
  let messages: Message[] = []

  try {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    messages = data ?? []
  } catch {
    // Supabase not configured yet — start with empty state
  }

  return <MainClient initialMessages={messages} />
}

export const dynamic = 'force-dynamic'
