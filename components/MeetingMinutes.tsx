"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Petals from "@/components/Petals";
import { useMusic } from "@/components/MusicContext";

type Phase = "sealed" | "opening" | "reading";

const MEETING_NOTES = [
  "The prosecutor stated that for small issues, she’ll let the defendant know immediately that she’s pissed and won’t give him the silent treatment (na she talk am oo).",
  "For bigger issues, however, she’ll take some time to process things and make the defendant “gboju kuro.”, while still staying accountable. But that doesn’t stop the defendant from passing along information, asking for help, or occasionally throwing in the “Will you be my heaven baby?” question.",
  "The defendant agreed and stated that he’ll ask questions directly to clarify his thoughts. If anything comes up or he needs support, he’ll ask rather than assume everything is on pause. If she doesn’t respond immediately, no wamm, nothing spoil.",
  "The defendant then proceeded to “absorb sense” from the prosecutor by kissing her forehead 🌚 before saying his goodbye.",
  "In summary, the defendant is genuinely sorry for everything he said on Monday. He said things, that he would take back if he could. He wants the prosecutor to know that he loves her so much and knows she loves him too. ❤️",
];

const REASONS = [
  {
    title: "Jumoke is evidently God’s daughter.",
    body: "A child of God. I don’t think I need to go any further.",
  },
  {
    title: "Jumoke is smart, beautiful, and effortlessly funny.",
    body: "Like, really smart. It’s not every day you come across that combination in a woman. God willing, our children will benefit a lot from that combo. ❤️",
  },
  {
    title: "Jumoke is a good friend and a good person.",
    body: "I cannot overemphasize this enough if I wanted to. I’ve seen how much you’ve shown up for Bisola when you were not even close at the beginning, for Eunice, and for me (I’ll always refer to the parfait situation last year - btw sugar mummy, come and buy parfait for me 🌚). I love that I can easily vibe with you, laugh with you, and talk about things without any of it feeling forced.",
  },
  {
    title: "Jumoke is not always nice, but she’s kind at heart.",
    body: "She's a wannabe hard-girl. You’d ask, “Can I use your air fryer?” and she’d say no, in her mafejopami tone, only to go ahead and help you air-fry your plantain (multiple attempts, even!) when you’ve already told her not to worry.",
  },
  {
    title: "Jumoke is reliable.",
    body: "I remember our conversation about our wedding and how you told me it wasn’t something I had to do alone.",
  },
  {
    title: "Jumoke is not tardy",
    body: "She’s a very organised somebody, always on time, blunt and straight to the point.",
  },
  {
    title: "Jumoke is hardworking.",
    body: "Broooo, hustler (baller) lomo mehn, making money for 3.",
  },
  {
    title: "Jumoke is confident.",
    body: "She fights for what she believes in.",
  },
  {
    title: "Jumoke is my happy baby.",
    body: "The one who brings light into the rooms she enters. This is particularly important to me because I do get unnecessarily gloomy sometimes.",
  },
  {
    title: "Jumoke is proactive and plans ahead.",
    body: "You don’t like to be caught unaware; for someone like me, who usually just adapts to the flow of things (a strength of mine)... that provides a balance. I believe this balance will make decisions in our home easier to navigate, depending on which of our strengths is needed.",
  },
];

function SectionHeading({
  number,
  children,
}: {
  number: string;
  children: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span
        className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-sans text-xs font-semibold"
        style={{ color: "#9b3a5e", background: "#fce7ec" }}
        aria-hidden="true"
      >
        {number}
      </span>
      <h2
        className="font-serif text-2xl leading-snug sm:text-3xl"
        style={{ color: "#9b3a5e" }}
      >
        {children}
      </h2>
    </div>
  );
}

function BodyCopy({ children }: { children: ReactNode }) {
  return (
    <p className="font-serif text-base leading-8 sm:text-lg">{children}</p>
  );
}

export default function MeetingMinutes() {
  const [phase, setPhase] = useState<Phase>("sealed");
  const reduceMotion = useReducedMotion();
  const { play: playMusic } = useMusic();

  useEffect(() => {
    if (phase !== "opening") return;

    const timeout = window.setTimeout(
      () => setPhase("reading"),
      reduceMotion ? 100 : 1000,
    );
    return () => window.clearTimeout(timeout);
  }, [phase, reduceMotion]);

  const openLetter = useCallback(() => {
    if (phase !== "sealed") return;
    playMusic();
    setPhase("opening");
  }, [phase, playMusic]);

  const replay = useCallback(() => {
    setPhase("sealed");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);

  const opening = phase === "opening";

  return (
    <div className="relative isolate flex-1 overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, #fce7ec 0%, #fdf6f0 55%, #fdf6f0 100%)",
        }}
      />
      {!reduceMotion && <Petals count={11} color="rgba(194,88,122,0.14)" />}

      <AnimatePresence mode="wait">
        {phase !== "reading" ? (
          <motion.section
            key="sealed-note"
            className="relative z-10 flex min-h-[calc(100vh-76px)] flex-col items-center justify-center px-6 py-16 text-center"
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{
              duration: reduceMotion ? 0.15 : 0.4,
              ease: "easeInOut",
            }}
          >
            <h1
              className="font-serif text-4xl sm:text-5xl"
              style={{ color: "#2d1b2e" }}
            >
              A commitment to us...
            </h1>
            <p
              className="mt-4 max-w-md font-serif text-lg leading-relaxed"
              style={{ color: "#7d5a6e" }}
            >
              The one where I listen, and choose you.
            </p>

            <motion.button
              type="button"
              onClick={openLetter}
              disabled={opening}
              aria-label="Open the minutes of the meeting"
              className="mt-10 rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-[#edadc0] disabled:cursor-default"
              animate={
                opening || reduceMotion
                  ? { y: 0, rotate: 0 }
                  : { y: [0, -6, 0], rotate: [-1, 1, -1] }
              }
              transition={{
                duration: 2.8,
                repeat: opening || reduceMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
              whileHover={opening ? undefined : { scale: 1.04 }}
              whileTap={opening ? undefined : { scale: 0.97 }}
            >
              <div
                className="relative"
                style={{
                  width: "min(78vw, 320px)",
                  aspectRatio: "1.45 / 1",
                  perspective: 1200,
                }}
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #f9d3dc, #ecbcce)",
                    boxShadow: "0 22px 50px rgba(155,58,94,0.22)",
                  }}
                />
                <motion.div
                  className="absolute flex flex-col gap-2 rounded-lg bg-[#fffaf8] px-5 py-4 text-left shadow-lg"
                  style={{
                    left: "10%",
                    right: "10%",
                    top: "8%",
                    height: "77%",
                    zIndex: 10,
                  }}
                  animate={
                    opening ? { y: "-48%", scale: 1.04 } : { y: "0%", scale: 1 }
                  }
                  transition={{
                    duration: 0.75,
                    delay: opening ? 0.2 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {["82%", "100%", "72%"].map((width) => (
                    <span
                      key={width}
                      className="block h-[3px] rounded-full"
                      style={{ width, background: "rgba(196,160,184,0.55)" }}
                    />
                  ))}
                  <span
                    className="mt-auto self-end font-serif text-xl"
                    style={{ color: "#c2587a" }}
                    aria-hidden="true"
                  >
                    ♡
                  </span>
                </motion.div>
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    zIndex: 20,
                    background: "linear-gradient(135deg, #f4bccb, #e0a7c5)",
                    clipPath:
                      "polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)",
                  }}
                />
                <motion.div
                  className="absolute"
                  style={{
                    left: 0,
                    right: 0,
                    top: 0,
                    height: "54%",
                    zIndex: opening ? 5 : 30,
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background: "linear-gradient(160deg, #eeabc0, #cd92b6)",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                  animate={{ rotateX: opening ? -174 : 0 }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                />
                <motion.span
                  className="absolute z-40 flex items-center justify-center rounded-full font-serif text-xl text-white"
                  style={{
                    left: "50%",
                    top: "46%",
                    width: 46,
                    height: 46,
                    marginLeft: -23,
                    marginTop: -23,
                    background:
                      "radial-gradient(circle at 35% 30%, #b8496f, #8d3355)",
                    boxShadow: "0 4px 12px rgba(141,51,85,0.4)",
                  }}
                  animate={
                    opening
                      ? { scale: 0, opacity: 0, rotate: 45 }
                      : { scale: 1, opacity: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.3, ease: "easeIn" }}
                  aria-hidden="true"
                >
                  ♡
                </motion.span>
              </div>
            </motion.button>

            <motion.p
              className="mt-10 font-serif text-xl sm:text-2xl"
              style={{ color: "#9b3a5e" }}
              animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              {opening ? "Opening your letter…" : "Tap the envelope to open"}
            </motion.p>
          </motion.section>
        ) : (
          <motion.main
            key="letter"
            className="relative z-10 mx-auto w-full max-w-3xl sm:px-8 sm:py-16"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0.15 : 0.65,
              ease: "easeOut",
            }}
          >
            <article
              className="overflow-hidden sm:rounded-[2rem] border px-6 py-9 sm:px-12 sm:py-14"
              style={{
                background: "rgba(255,250,248,0.97)",
                borderColor: "rgba(194,88,122,0.16)",
                boxShadow: "0 16px 60px rgba(45,27,46,0.10)",
              }}
            >
              <header className="mb-10 text-center sm:mb-14">
                <p
                  className="font-sans text-[10px] font-semibold uppercase tracking-[0.32em]"
                  style={{ color: "#c2587a" }}
                >
                  Where it started
                </p>
                <h1
                  className="mt-4 font-serif text-3xl leading-tight sm:text-5xl"
                  style={{ color: "#2d1b2e" }}
                >
                  Minutes of our meeting <span aria-hidden="true">🌚</span>
                </h1>
                <div
                  className="mx-auto mt-5 h-px w-16"
                  style={{ background: "rgba(194,88,122,0.35)" }}
                />
              </header>

              <section
                className="mb-14 rounded-2xl px-5 py-6 sm:px-7 sm:py-8"
                style={{
                  background: "#fdf1f3",
                  border: "1px solid rgba(194,88,122,0.12)",
                }}
              >
                <p
                  className="mb-5 font-sans text-[10px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: "#c2587a" }}
                >
                  The meeting notes
                </p>
                <div className="space-y-4">
                  {MEETING_NOTES.map((note) => (
                    <BodyCopy key={note}>{note}</BodyCopy>
                  ))}
                </div>
              </section>

              <div className="space-y-6">
                <BodyCopy>
                  Teasing aside, I’ve been thinking about our entire
                  conversation, and I want to take accountability for my part in
                  it. So, I put a couple of my thoughts together (well, more
                  than a couple) in writing instead of just saying them in
                  passing, as a genuine commitment to us.
                </BodyCopy>
                <BodyCopy>
                  It’s a long read, and it’s the best I can summarise it into,
                  so please take your time to go through them.
                </BodyCopy>
              </div>

              <section
                className="mt-14 border-t pt-10 sm:mt-16 sm:pt-12"
                style={{ borderColor: "rgba(194,88,122,0.18)" }}
              >
                <SectionHeading number="01">
                  Learning to Love You with the Love of Christ
                </SectionHeading>
                <div className="space-y-5">
                  <BodyCopy>
                    I promised to love you with the love of Christ, and somehow,
                    along the way, that spiralled into me wanting to be the
                    perfect man for you.
                  </BodyCopy>
                  <BodyCopy>
                    I read 1 Corinthians 13 again and saw many of the ways I’ve
                    fallen short.
                  </BodyCopy>
                  <blockquote
                    className="my-7 rounded-r-2xl border-l-2 py-2 pl-5 sm:pl-7"
                    style={{
                      borderColor: "#e8956d",
                      background:
                        "linear-gradient(90deg, rgba(250,212,192,0.24), transparent)",
                    }}
                  >
                    <p
                      className="font-serif text-base leading-8 sm:text-lg"
                      style={{ color: "#7d5a6e" }}
                    >
                      “[5] It is not conceited (arrogant and inflated with
                      pride); it is not rude (unmannerly) and does not act
                      unbecomingly. Love (God’s love in us) does not insist on
                      its own rights or its own way, for it is not self-seeking;
                      it is not touchy or fretful or resentful; it takes no
                      account of the evil done to it [it pays no attention to
                      suffered wrong]. [6] It does not rejoice at injustice and
                      unrighteousness, but rejoices when right and truth
                      prevail.”
                    </p>
                    <cite
                      className="mt-3 block font-sans text-xs not-italic tracking-wide"
                      style={{ color: "#9b3a5e" }}
                    >
                      1 Corinthians 13:5–6 AMPC
                    </cite>
                  </blockquote>
                  <BodyCopy>
                    I shouldn’t be self-seeking in a bid to be right. I should
                    rejoice in truth by asking for clarification instead of
                    overanalysing, making assumptions, and jumping to
                    conclusions.
                  </BodyCopy>
                  <BodyCopy>
                    Verse 7 says love believes the best of every person. And
                    that’s something I want to be more intentional about.
                  </BodyCopy>
                </div>
              </section>

              <section
                className="mt-14 border-t pt-10 sm:mt-16 sm:pt-12"
                style={{ borderColor: "rgba(194,88,122,0.18)" }}
              >
                <SectionHeading number="02">
                  Ten Reasons Why I Chose You ❤
                </SectionHeading>
                <div className="mb-7 space-y-4">
                  <BodyCopy>
                    In view of learning to love and choose you every day, I’ve
                    put together 10 reasons why I chose you (because you’re a 10
                    out of 10 babe 🙂‍↔️) in the first place… Not to flatter you,
                    but to help me, and perhaps you too, remember who I really
                    want to do life with.
                  </BodyCopy>
                </div>
                <ol className="space-y-3">
                  {REASONS.map((reason, index) => (
                    <li
                      key={reason.title}
                      className="flex gap-4 rounded-2xl px-4 py-4 sm:px-5"
                      style={{
                        background:
                          index % 2 === 0
                            ? "rgba(252,231,236,0.55)"
                            : "rgba(250,212,192,0.22)",
                      }}
                    >
                      <span
                        className="pt-0.5 font-serif text-lg"
                        style={{ color: "#e8956d" }}
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="space-y-1.5">
                        <h3
                          className="font-serif text-lg leading-snug sm:text-xl"
                          style={{ color: "#9b3a5e" }}
                        >
                          {reason.title}
                        </h3>
                        {reason.body && (
                          <p
                            className="font-serif text-sm leading-7 sm:text-base sm:leading-8"
                            style={{ color: "#5d4556" }}
                          >
                            {reason.body}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section
                className="mt-14 border-t pt-10 sm:mt-16 sm:pt-12"
                style={{ borderColor: "rgba(194,88,122,0.18)" }}
              >
                <SectionHeading number="03">
                  Learning from Our Differences
                </SectionHeading>
                <div className="space-y-5">
                  <BodyCopy>
                    We’re very different people, and I remember when you said,
                    “I think it’s why we work because we complement each
                    other”... We might process things differently, but I’m
                    learning to pick up a couple of things from you that can
                    help me organise the many thoughts going through my head.
                  </BodyCopy>
                  <BodyCopy>
                    And I believe you can also pick up a few things from me by
                    processing things (not just disagreement - which you already
                    do) with me sometimes.
                  </BodyCopy>
                  <BodyCopy>
                    Even if everything isn’t sorted out immediately, talking
                    things through can provide direction, clarity, and
                    perspective as you assimilate information from both ends.
                  </BodyCopy>
                </div>
              </section>

              <section
                className="mt-14 border-t pt-10 sm:mt-16 sm:pt-12"
                style={{ borderColor: "rgba(194,88,122,0.18)" }}
              >
                <SectionHeading number="04">
                  What I Believe Love Should Feel Like
                </SectionHeading>
                <div className="space-y-5">
                  <BodyCopy>
                    I don’t have to be a perfect man. Christ is perfect, and
                    He’s the one we both want to become more like in this
                    relationship.
                  </BodyCopy>
                  <BodyCopy>
                    I have to be a good man, the same man you saw and chose at
                    the beginning.
                  </BodyCopy>
                  <BodyCopy>
                    A man who’s open to learning, truly listening to you,
                    compromising when the need arises, and sharing opinions he
                    believes are right, not to impose them on you, but so we can
                    come to an agreement.
                  </BodyCopy>
                  <BodyCopy>
                    A man who’s willing to be direct when he needs to be.
                  </BodyCopy>
                  <BodyCopy>
                    I’ve said this before, but I realise life can be a little
                    crazy sometimes.
                  </BodyCopy>
                  <BodyCopy>
                    And I truly believe that one of the most beautiful gifts God
                    has given us as humans is finding someone who helps us
                    appreciate His love. Someone to value and cultivate Agape
                    with. Someone to hold our hands when we get overwhelmed (or
                    maybe even just whelmed). Someone we feel safe with when
                    life gets scary.
                  </BodyCopy>
                </div>
              </section>

              <section
                className="mt-14 border-t pt-10 sm:mt-16 sm:pt-12"
                style={{ borderColor: "rgba(194,88,122,0.18)" }}
              >
                <SectionHeading number="05">
                  My Proposition to Us
                </SectionHeading>
                <div className="space-y-5">
                  <BodyCopy>My proposition is this...</BodyCopy>
                  <BodyCopy>
                    We both have expectations that sometimes lead to unnecessary
                    disappointment when they aren’t communicated properly.
                  </BodyCopy>
                  <BodyCopy>
                    And sometimes, it takes repeated reminders for us to realise
                    just how important certain things truly are to each other.
                  </BodyCopy>
                  <BodyCopy>
                    I&apos;d love for us to talk about these expectations,
                    understand them and come to an agreement on them.
                  </BodyCopy>
                </div>
                <div className="mt-12 text-right">
                  <p
                    className="font-serif text-lg"
                    style={{ color: "#7d5a6e" }}
                  >
                    Your sweet boy always,
                  </p>
                  <p
                    className="mt-2 font-serif text-3xl font-semibold"
                    style={{ color: "#c2587a" }}
                  >
                    T.A
                  </p>
                </div>
              </section>

              <footer
                className="mt-12 border-t pt-7 text-center"
                style={{ borderColor: "rgba(194,88,122,0.15)" }}
              >
                <p className="font-serif text-lg" style={{ color: "#9b3a5e" }}>
                  I love you 3,000 <span aria-hidden="true">♡</span>
                </p>
                <button
                  type="button"
                  onClick={replay}
                  className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-sm font-medium outline-none transition-colors hover:bg-[#fce7ec] focus-visible:ring-2 focus-visible:ring-[#edadc0]"
                  style={{ color: "#9b3a5e" }}
                >
                  <span aria-hidden="true">↺</span> Read again
                </button>
              </footer>
            </article>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
