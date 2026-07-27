"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Petals from "./Petals";
import PhotoPops from "./PhotoPops";
import PhotoFrame from "./PhotoFrame";
import PhotoPreloader from "./PhotoPreloader";
import { useMusic } from "./MusicContext";
import type { Photo } from "@/lib/types";

type LineKind = "greeting" | "para" | "shoutout" | "finale";

interface Line {
  kind: LineKind;
  text: string;
  action?: {
    url: string;
    label: string;
  };
}

const LETTER: Line[] = [
  { kind: "greeting", text: "Dear Soft babe," },
  {
    kind: "para",
    text: "The day you said yes to walking on this journey, I made a promise to make life a little easier for you, as God will help me (go and listen to that VN again 🌚).",
  },
  {
    kind: "para",
    text: "I said this because I realize life can be a little crazy at times. I truly believe one of the most beautiful things God gave us humans is finding someone who helps us appreciate His love, someone to value and cultivate “Agape” with.",
  },
  {
    kind: "para",
    text: "Someone to hold our hands when we get overwhelmed (or maybe even just whelmed).",
  },
  { kind: "para", text: "Someone we feel safe with when life gets scary." },
  { kind: "para", text: "Someone to pray with and pray over us." },
  {
    kind: "para",
    text: "This is my reminder that, as God helps us, I will be that someone for you, holding your hands just as you hold mine, as we become true friends and a big part of each other's support system.",
  },
  {
    kind: "para",
    text: "It's Girlfriends Day, so here’s a shout-out to a girlfriend who has added so much color to this nerdy boy’s life:",
  },
  {
    kind: "shoutout",
    text: "A shout-out to a soft babe whose happiness is sooo contagious.",
  },
  {
    kind: "shoutout",
    text: "A shout-out to a soft babe who works really hard (omo ti mo trainnnn - sooo proud of you every time).",
  },
  {
    kind: "shoutout",
    text: "A shout-out to a soft babe who would become truly soft, amen?",
  },
  {
    kind: "shoutout",
    text: "A shout-out to a woman so fine and sweet, like a well-aged wine 🙂‍↔️.",
  },
  {
    kind: "shoutout",
    text: "A shout-out to the best girlfriend I ever had (I can’t even compare, baby girl 🌚).",
  },
  {
    kind: "para",
    text: "Here’s a little reminder that whenever you feel down, remember that you have someone in your corner who lights up whenever you smile.",
  },
  {
    kind: "para",
    text: "So in celebration of a girlfriend's day, I want you to book a spa session using the link below (all expense paid) to make you a bit softer  🌚 cus e be like you don dey kanra a little too much",
    action: {
      url: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0YcH653sLVVkJW2rTh3HcPgowy6gfsdeu8yLwZKCHFvu-imH-_48xhRshrTiEJkxhpp3b5Uijk",
      label: "Book Your Spa Appointment 💆‍♀️✨",
    },
  },
  {
    kind: "para",
    text: "Oh I also got you a basic skincare routine for your breakout... The soft babe agenda must agendddd. Happy girlfriend's day to those who celebrate 🙂‍↔️",
  },
  { kind: "finale", text: "I love you 3000 ❤️." },
];

/** Slightly slower speed per char & pause for a more relaxed, handwritten reading pace. */
const CHAR_MS = 65;
const LINE_PAUSE_MS = 700;

/** Split on grapheme clusters so emoji are never torn mid-reveal. */
function toGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

interface Props {
  /** Pictures from public/our-pictures. Empty means petals only. */
  photos: Photo[];
}

export default function GirlfriendLetter({ photos }: Props) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "reading">(
    "sealed",
  );
  const [flapBehind, setFlapBehind] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const reduceMotion = useReducedMotion();
  const activeRef = useRef<HTMLDivElement | null>(null);
  const { play: playMusic } = useMusic();

  const graphemes = useMemo(() => LETTER.map((l) => toGraphemes(l.text)), []);
  const finished = lineIndex >= LETTER.length;

  const handleOpen = useCallback(() => {
    if (phase !== "sealed") return;
    // This click is the user gesture browsers require before audio may start
    playMusic();
    setPhase("opening");
    setTimeout(() => setFlapBehind(true), 380);
    setTimeout(() => setPhase("reading"), 1500);
  }, [phase, playMusic]);

  // Type out the current line one grapheme at a time, then pause and advance.
  useEffect(() => {
    if (phase !== "reading" || finished) return;

    const chars = graphemes[lineIndex];
    if (charIndex < chars.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), CHAR_MS);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, LINE_PAUSE_MS);
    return () => clearTimeout(t);
  }, [phase, finished, graphemes, lineIndex, charIndex]);

  // Keep the line being written in view.
  useEffect(() => {
    if (phase !== "reading") return;
    activeRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  }, [phase, lineIndex, reduceMotion]);

  /** Tapping while a line is writing completes that line instantly. */
  const completeLine = useCallback(() => {
    if (phase !== "reading" || finished) return;
    setCharIndex(graphemes[lineIndex].length);
  }, [phase, finished, graphemes, lineIndex]);

  const replay = useCallback(() => {
    setLineIndex(0);
    setCharIndex(0);
    setFlapBehind(false);
    setPhase("sealed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const opening = phase !== "sealed";

  // One more picture every few lines, spread evenly across the whole letter.
  const photosBy = useCallback(
    (line: number) =>
      line < 0
        ? 0
        : Math.min(
            photos.length,
            Math.ceil(((line + 1) / LETTER.length) * photos.length),
          ),
    [photos.length],
  );

  const photosRevealed = phase === "reading" ? photosBy(lineIndex) : 0;

  return (
    <div className="relative flex-1 w-full overflow-x-hidden font-sans flex flex-col">
      {/* Fixed so the wash sits behind the layout header too, with no seam */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, #fce7ec 0%, #fdf6f0 55%, #fdf6f0 100%)",
        }}
      />

      <Petals />
      <PhotoPreloader photos={photos} />
      <PhotoPops photos={photos} revealed={photosRevealed} />

      {/* The whole letter, always available to screen readers */}
      <p className="sr-only">{LETTER.map((l) => l.text).join(" ")}</p>

      <AnimatePresence mode="wait">
        {phase !== "reading" ? (
          <motion.div
            key="envelope"
            className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.button
              type="button"
              onClick={handleOpen}
              aria-label="Open your letter"
              className="relative outline-none focus-visible:ring-4 focus-visible:ring-[#edadc0] rounded-2xl"
              animate={
                opening || reduceMotion
                  ? { rotate: 0, y: 0 }
                  : { rotate: [-2.4, 2.4, -2.4], y: [0, -6, 0] }
              }
              transition={{
                duration: 2.2,
                repeat: opening || reduceMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
              whileHover={opening ? undefined : { scale: 1.04 }}
              whileTap={opening ? undefined : { scale: 0.96 }}
            >
              <div
                className="relative"
                style={{
                  width: "min(80vw, 330px)",
                  aspectRatio: "1.45 / 1",
                  perspective: 1400,
                }}
              >
                {/* Envelope back */}
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #f9d3dc, #ecbcce)",
                    boxShadow: "0 22px 50px rgba(155,58,94,0.24)",
                  }}
                />

                {/* The letter inside, rising as the envelope opens */}
                <motion.div
                  className="absolute rounded-lg px-4 py-4 flex flex-col gap-2"
                  style={{
                    left: "9%",
                    right: "9%",
                    top: "9%",
                    height: "76%",
                    zIndex: 10,
                    background: "#fffaf8",
                    boxShadow: "0 8px 20px rgba(45,27,46,0.14)",
                  }}
                  animate={
                    opening ? { y: "-56%", scale: 1.05 } : { y: "0%", scale: 1 }
                  }
                  transition={{
                    duration: 0.85,
                    delay: opening ? 0.45 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {[80, 96, 64].map((w, i) => (
                    <span
                      key={i}
                      className="block h-[3px] rounded-full"
                      style={{
                        width: `${w}%`,
                        background: "rgba(196,160,184,0.5)",
                      }}
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

                {/* Front pocket */}
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    zIndex: 20,
                    background: "linear-gradient(135deg, #f4bccb, #e0a7c5)",
                    clipPath:
                      "polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)",
                  }}
                />

                {/* Flap */}
                <motion.div
                  className="absolute"
                  style={{
                    left: 0,
                    right: 0,
                    top: 0,
                    height: "54%",
                    zIndex: flapBehind ? 5 : 30,
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background: "linear-gradient(160deg, #eeabc0, #cd92b6)",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                  animate={{ rotateX: opening ? -174 : 0 }}
                  transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
                />

                {/* Wax seal */}
                <motion.div
                  className="absolute flex items-center justify-center rounded-full text-white"
                  style={{
                    left: "50%",
                    top: "46%",
                    width: 46,
                    height: 46,
                    marginLeft: -23,
                    marginTop: -23,
                    zIndex: 40,
                    background:
                      "radial-gradient(circle at 35% 30%, #b8496f, #8d3355)",
                    boxShadow: "0 4px 12px rgba(141,51,85,0.45)",
                  }}
                  animate={
                    opening
                      ? { scale: 0, opacity: 0, rotate: 45 }
                      : { scale: 1, opacity: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.35, ease: "easeIn" }}
                  aria-hidden="true"
                >
                  <span className="font-serif text-lg leading-none">♡</span>
                </motion.div>
              </div>
            </motion.button>

            {/* Caption */}
            <AnimatePresence>
              {!opening && (
                <motion.div
                  className="mt-12 text-center"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <motion.p
                    className="font-serif text-xl sm:text-2xl italic"
                    style={{ color: "#9b3a5e" }}
                    animate={
                      reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }
                    }
                    transition={{ duration: 2.4, repeat: Infinity }}
                  >
                    You have mail, click me
                  </motion.p>
                  <p
                    className="mt-2 text-[11px] tracking-[0.28em] uppercase font-sans font-semibold"
                    style={{ color: "#c4a0b8" }}
                  >
                    Girlfriend Day
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.main
            key="letter"
            onClick={completeLine}
            className="relative z-10 px-5 sm:px-8 py-12 sm:py-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="rounded-3xl px-6 sm:px-10 py-10 sm:py-14"
              style={{
                background: "#fffaf8",
                boxShadow: "0 10px 46px rgba(45,27,46,0.10)",
              }}
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="text-center mb-10">
                <p
                  className="text-[11px] tracking-[0.3em] uppercase font-sans font-semibold"
                  style={{ color: "#c2587a" }}
                >
                  A letter for you
                </p>
                <div
                  className="mx-auto mt-4 h-px w-16"
                  style={{ background: "rgba(194,88,122,0.3)" }}
                />
              </div>

              <div className="space-y-6">
                {LETTER.slice(0, Math.min(lineIndex + 1, LETTER.length)).map(
                  (line, i) => {
                    const isActive = i === lineIndex;
                    const text = isActive
                      ? graphemes[i].slice(0, charIndex).join("")
                      : line.text;

                    return (
                      <motion.div
                        key={i}
                        ref={isActive ? activeRef : undefined}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        {line.kind === "greeting" && (
                          <p
                            className="font-serif italic text-2xl sm:text-3xl"
                            style={{ color: "#9b3a5e" }}
                          >
                            {text}
                            {isActive && <Caret />}
                          </p>
                        )}

                        {line.kind === "para" && (
                          <div className="space-y-3">
                            <p
                              className="font-serif text-lg sm:text-xl leading-relaxed"
                              style={{ color: "#2d1b2e" }}
                            >
                              {text}
                              {isActive && <Caret />}
                            </p>

                            {line.action &&
                              (i < lineIndex ||
                                (isActive &&
                                  charIndex >= graphemes[i].length)) && (
                                <motion.div
                                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{
                                    duration: 0.5,
                                    ease: "easeOut",
                                  }}
                                  className="pt-2 pb-1 flex justify-start sm:justify-center"
                                >
                                  <motion.a
                                    href={line.action.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full font-sans text-sm sm:text-base font-semibold text-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, #e0527b 0%, #b83b68 100%)",
                                      boxShadow:
                                        "0 8px 24px rgba(224, 82, 123, 0.35)",
                                    }}
                                  >
                                    <span className="text-lg">💆‍♀️</span>
                                    <span>{line.action.label}</span>
                                    <svg
                                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2.5}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                      />
                                    </svg>
                                  </motion.a>
                                </motion.div>
                              )}
                          </div>
                        )}

                        {line.kind === "shoutout" && (
                          <div
                            className="flex gap-3 pl-4 py-1"
                            style={{
                              borderLeft: "2px solid rgba(232,149,109,0.45)",
                            }}
                          >
                            <span
                              className="font-serif text-lg shrink-0 leading-relaxed"
                              style={{ color: "#e8956d" }}
                              aria-hidden="true"
                            >
                              ✦
                            </span>
                            <p
                              className="font-serif text-lg sm:text-xl leading-relaxed"
                              style={{ color: "#7d5a6e" }}
                            >
                              {text}
                              {isActive && <Caret />}
                            </p>
                          </div>
                        )}

                        {line.kind === "finale" && (
                          <motion.p
                            className="font-serif font-bold text-center text-3xl sm:text-4xl pt-6"
                            style={{ color: "#c2587a" }}
                            animate={
                              !isActive && !reduceMotion
                                ? { scale: [1, 1.04, 1] }
                                : undefined
                            }
                            transition={{ duration: 2.2, repeat: Infinity }}
                          >
                            {text}
                            {isActive && <Caret />}
                          </motion.p>
                        )}

                        {/* On phones the pictures live in the letter itself,
                            between paragraphs, so nothing is ever covered. */}
                        {photos
                          .slice(photosBy(i - 1), photosBy(i))
                          .map((photo) => (
                            <motion.div
                              key={photo.src}
                              className="sm:hidden flex justify-center pt-7"
                              initial={
                                reduceMotion
                                  ? { opacity: 0 }
                                  : { opacity: 0, y: 60, scale: 0.85 }
                              }
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={
                                reduceMotion
                                  ? { duration: 0.5 }
                                  : {
                                      type: "spring",
                                      stiffness: 90,
                                      damping: 15,
                                    }
                              }
                            >
                              <motion.div
                                initial={{ rotate: -2.5 }}
                                animate={
                                  reduceMotion
                                    ? undefined
                                    : {
                                        y: [0, -9, 0],
                                        rotate: [-2.5, 2.5, -2.5],
                                      }
                                }
                                transition={{
                                  duration: 6,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              >
                                <PhotoFrame
                                  photo={photo}
                                  width="min(62vw, 260px)"
                                />
                              </motion.div>
                            </motion.div>
                          ))}
                      </motion.div>
                    );
                  },
                )}
              </div>

              <AnimatePresence>
                {finished && (
                  <motion.div
                    className="mt-12 flex flex-col items-center gap-5"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="flex gap-2" aria-hidden="true">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="font-serif text-lg"
                          style={{ color: "#edadc0" }}
                          animate={
                            reduceMotion
                              ? undefined
                              : { y: [0, -7, 0], opacity: [0.5, 1, 0.5] }
                          }
                          transition={{
                            duration: 1.8,
                            delay: i * 0.25,
                            repeat: Infinity,
                          }}
                        >
                          ♡
                        </motion.span>
                      ))}
                    </div>
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        replay();
                      }}
                      className="text-[11px] tracking-[0.24em] uppercase font-sans font-semibold px-5 py-2.5 rounded-full"
                      style={{
                        color: "#c2587a",
                        background: "#fff0f5",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Read again
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

function Caret() {
  return (
    <motion.span
      className="inline-block align-middle ml-0.5"
      style={{
        width: 2,
        height: "1em",
        background: "#c2587a",
        borderRadius: 1,
      }}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.9, repeat: Infinity }}
      aria-hidden="true"
    />
  );
}
