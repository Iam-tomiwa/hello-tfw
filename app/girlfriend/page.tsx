import type { Metadata } from "next";
import GirlfriendLetter from "@/components/GirlfriendLetter";

export const metadata: Metadata = {
  title: "You have mail 💌",
  description: "A letter for my soft babe",
};

export default function GirlfriendPage() {
  return <GirlfriendLetter />;
}
