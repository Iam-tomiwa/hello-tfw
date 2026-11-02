import type { Metadata } from "next";
import MeetingMinutes from "@/components/MeetingMinutes";

export const metadata: Metadata = {
  title: "Minutes of the Meeting 🌚❤",
  description:
    "A letter about listening, choosing one another, and building a relationship with love.",
};

export default function MinutesPage() {
  return <MeetingMinutes />;
}
