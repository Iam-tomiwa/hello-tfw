import { createServerSupabaseClient } from "@/lib/supabase";
import { readMessagesBackup, saveMessagesBackup } from "@/lib/messagesBackup";
import { Message } from "@/lib/types";
import MainClient from "@/components/MainClient";

export default async function Home() {
  let messages: Message[] = [];

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    messages = data ?? [];
    await saveMessagesBackup(messages);
  } catch {
    // Supabase paused, down, or not configured — fall back to the last snapshot
    messages = (await readMessagesBackup()) ?? [];
  }

  return <MainClient initialMessages={messages} />;
}

export const dynamic = "force-dynamic";
