import { useEffect, useRef, useState } from "react"

interface OperationalStage {
  id: string
  label: string
  threshold: number
}

const STAGES: OperationalStage[] = [
  { id: "init", label: "SIGNAL INITIATED", threshold: 0.05 },
  { id: "ops", label: "CONNECTED OPERATIONS", threshold: 0.28 },
  { id: "modules", label: "MODULE ECOSYSTEM", threshold: 0.52 },
  { id: "intel", label: "INTELLIGENCE & CONTROL", threshold: 0.78 },
  { id: "sync", label: "NETWORK SYNCHRONIZED", threshold: 0.96 },
]

export default function NexusScrollFlow() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const progressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // DOM refs for direct GPU transform manipulation (avoids React re-renders on every scroll tick)
  const railGlowRef = useRef<HTMLDivElement>(null)
  const signalHeadRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    if (typeof window === "undefined") return

    // Reduced motion check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener?.("change", motionHandler)

    const updateScrollTarget = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) {
        targetProgressRef.current = 0
        return
      }
      const rawProgress = Math.min(Math.max(window.scrollY / docHeight, 0), 1)
      targetProgressRef.current = rawProgress

      // Manage scrolling active state
      setIsScrolling(true)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 1200)

      // Determine active stage
      let currentStage = 0
      for (let i = STAGES.length - 1; i >= 0; i--) {
        if (rawProgress >= STAGES[i].threshold - 0.08) {
          currentStage = i
          break
        }
      }
      setActiveStageIndex(currentStage)
    }

    // Animation Loop with smooth physics (lerp)
    const animate = () => {
      const diff = targetProgressRef.current - progressRef.current
      if (Math.abs(diff) > 0.0002) {
        progressRef.current += diff * 0.12 // Smooth fluid easing
      } else {
        progressRef.current = targetProgressRef.current
      }

      const p = progressRef.current
      const percentage = p * 100

      // Update direct DOM styles via transform & scale for 60fps GPU performance
      if (progressLineRef.current) {
        progressLineRef.current.style.transform = `scaleY(${p})`
      }
      if (signalHeadRef.current) {
        signalHeadRef.current.style.transform = `translateY(${p * 220}px)`
      }
      if (railGlowRef.current) {
        railGlowRef.current.style.opacity = `${0.3 + p * 0.5}`
      }

      rafIdRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("scroll", updateScrollTarget, { passive: true })
    window.addEventListener("resize", updateScrollTarget, { passive: true })
    updateScrollTarget()
    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("scroll", updateScrollTarget)
      window.removeEventListener("resize", updateScrollTarget)
      mediaQuery.removeEventListener?.("change", motionHandler)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  if (!mounted) return null

  const currentStage = STAGES[activeStageIndex]

  return (
    <aside
      aria-label="Nexus Flow operational scroll signal"
      className="pointer-events-none fixed right-3 sm:right-5 lg:right-7 top-1/2 z-40 -translate-y-1/2 select-none"
    >
      {/* ── Main Vertical Telemetry Spine ── */}
      <div className="relative flex flex-col items-center">
        {/* Ambient background glow pill */}
        <div
          ref={railGlowRef}
          className="absolute -inset-x-3 -inset-y-4 rounded-full bg-[#0B1F3B]/10 dark:bg-[#F5C451]/5 blur-md transition-opacity duration-300"
        />

        {/* Floating Telemetry Stage Label (appears during active scroll or hover on desktop) */}
        <div
          className={`absolute right-7 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 rounded-full border border-[#0B1F3B]/10 bg-white/90 px-3 py-1 text-[9.5px] font-bold tracking-[0.14em] uppercase text-[#0B1F3B] shadow-[0_4px_16px_rgba(11,31,59,0.08)] backdrop-blur-md transition-all duration-300 ${

            isScrolling ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
          }`}
        >
          <span className="size-1.5 rounded-full bg-[#F5C451] animate-pulse" />
          <span>{currentStage.label}</span>
          <span className="text-[8px] font-semibold text-[#162A4B]/50">
            0{activeStageIndex + 1}
          </span>
        </div>

        {/* ── Visual Telemetry Rail (220px track) ── */}
        <div className="relative h-[220px] w-6 flex items-center justify-center">
          {/* Static background track */}
          <div className="absolute top-0 bottom-0 w-[2px] rounded-full bg-[#162A4B]/15 dark:bg-white/10" />

          {/* Active gold progress fill line */}
          <div
            ref={progressLineRef}
            className="absolute top-0 w-[2px] h-full origin-top rounded-full bg-gradient-to-b from-[#F5C451]/60 via-[#F5C451] to-[#F5C451]"
            style={{ transform: "scaleY(0)" }}
          />

          {/* Operational Stage Node Pips */}
          {STAGES.map((stage, idx) => {
            const isReached = idx <= activeStageIndex
            const isCurrent = idx === activeStageIndex
            const nodeTop = (idx / (STAGES.length - 1)) * 220

            return (
              <div
                key={stage.id}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ top: `${nodeTop}px` }}
              >
                <div
                  className={`size-2 rounded-full border transition-all duration-300 ${
                    isCurrent
                      ? "border-[#F5C451] bg-[#0B1F3B] ring-4 ring-[#F5C451]/20 scale-125"
                      : isReached
                      ? "border-[#F5C451]/70 bg-[#F5C451] scale-100"
                      : "border-[#162A4B]/20 bg-white dark:bg-[#162A4B] scale-90"
                  }`}
                />
              </div>
            )
          })}

          {/* Active Gliding Signal Head (Gold Photon Pulse) */}
          {!reducedMotion && (
            <div
              ref={signalHeadRef}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              {/* Outer pulse aura */}
              <div className="absolute -inset-2 rounded-full bg-[#F5C451]/30 blur-sm animate-ping opacity-60" />
              {/* Core beacon */}
              <div className="relative size-3 rounded-full border-2 border-white bg-[#F5C451] shadow-[0_0_12px_#F5C451]" />
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
