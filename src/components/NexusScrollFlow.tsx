import { memo, useEffect, useRef, useState } from "react"

interface OperationalStage {
  id: string
  label: string
}

const GLOBAL_STAGES: OperationalStage[] = [
  { id: "init", label: "SIGNAL INITIATED" },
  { id: "ops", label: "CONNECTED OPERATIONS" },
  { id: "modules", label: "MODULE ECOSYSTEM" },
  { id: "intel", label: "INTELLIGENCE & CONTROL" },
  { id: "sync", label: "NETWORK SYNCHRONIZED" },
]

const TRACK_HEIGHT = 220

export interface NexusScrollFlowProps {
  workflowProgress?: number
  activeWorkflowStep?: number
  isInWorkflow?: boolean
}

function NexusScrollFlow(_props?: NexusScrollFlowProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const progressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const activeStageRef = useRef(0)
  const isScrollingRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Direct GPU DOM elements
  const railGlowRef = useRef<HTMLDivElement>(null)
  const signalHeadRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    if (typeof window === "undefined") return

    // Reduced motion check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotion = (matches: boolean) => {
      reducedMotionRef.current = matches
      setReducedMotion(matches)
    }
    updateMotion(mediaQuery.matches)
    const motionHandler = (e: MediaQueryListEvent) => updateMotion(e.matches)
    mediaQuery.addEventListener?.("change", motionHandler)

    const calculateProgress = (): number => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        0
      )
      const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0
      const maxScroll = scrollHeight - clientHeight
      if (maxScroll <= 0) return 0
      return Math.min(Math.max(scrollY / maxScroll, 0), 1)
    }

    const applyStyles = (p: number) => {
      const y = p * TRACK_HEIGHT
      if (progressLineRef.current) {
        progressLineRef.current.style.transform = `scaleY(${p})`
      }
      if (signalHeadRef.current) {
        signalHeadRef.current.style.transform = `translate(-50%, -50%) translateY(${y}px)`
      }
      if (railGlowRef.current) {
        railGlowRef.current.style.opacity = `${0.3 + p * 0.5}`
      }
      const navSignal = document.getElementById("nexus-nav-scroll-signal")
      if (navSignal) {
        navSignal.style.transform = `scaleX(${p})`
      }
    }

    const animate = () => {
      const target = targetProgressRef.current
      let current = progressRef.current
      const diff = target - current

      if (reducedMotionRef.current || Math.abs(diff) < 0.0003) {
        current = target
      } else {
        // Direction-independent, buttery smooth interpolation
        current += diff * 0.22
      }

      // Snap firmly to endpoints to prevent overshooting or hanging
      if (target === 0 && current < 0.0008) current = 0
      if (target === 1 && current > 0.9992) current = 1

      progressRef.current = current
      applyStyles(current)

      // Symmetric stage activation based on equidistant dot thresholds
      const stageIdx = Math.min(
        Math.max(Math.round(current * (GLOBAL_STAGES.length - 1)), 0),
        GLOBAL_STAGES.length - 1
      )
      if (stageIdx !== activeStageRef.current) {
        activeStageRef.current = stageIdx
        setActiveStageIndex(stageIdx)
      }

      if (Math.abs(target - current) > 0.0003) {
        rafIdRef.current = requestAnimationFrame(animate)
      } else {
        rafIdRef.current = null
      }
    }

    const startAnimation = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(animate)
      }
    }

    const handleScrollOrResize = () => {
      targetProgressRef.current = calculateProgress()
      startAnimation()

      if (!isScrollingRef.current) {
        isScrollingRef.current = true
        setIsScrolling(true)
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
        setIsScrolling(false)
      }, 900)
    }

    // Set initial position immediately
    const initialProgress = calculateProgress()
    targetProgressRef.current = initialProgress
    progressRef.current = initialProgress
    applyStyles(initialProgress)

    const initialStage = Math.min(
      Math.max(Math.round(initialProgress * (GLOBAL_STAGES.length - 1)), 0),
      GLOBAL_STAGES.length - 1
    )
    activeStageRef.current = initialStage
    setActiveStageIndex(initialStage)

    window.addEventListener("scroll", handleScrollOrResize, { passive: true })
    window.addEventListener("resize", handleScrollOrResize, { passive: true })

    // Observe document height changes (dynamic images, fonts, accordion expansion)
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        targetProgressRef.current = calculateProgress()
        startAnimation()
      })
      resizeObserver.observe(document.documentElement)
    }

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize)
      window.removeEventListener("resize", handleScrollOrResize)
      mediaQuery.removeEventListener?.("change", motionHandler)
      resizeObserver?.disconnect()
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }
    }
  }, [])

  if (!mounted) return null

  const currentStage = GLOBAL_STAGES[activeStageIndex] || GLOBAL_STAGES[0]

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

        {/* Floating Telemetry Stage Label */}
        <div
          className={`absolute right-7 top-1/2 -translate-y-1/2 hidden min-[1600px]:flex items-center gap-2 rounded-full border border-[#0B1F3B]/10 bg-white/90 px-3 py-1 text-[9.5px] font-bold tracking-[0.14em] uppercase text-[#0B1F3B] shadow-[0_4px_16px_rgba(11,31,59,0.08)] backdrop-blur-md transition-all duration-300 ${
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
            className="absolute top-0 w-[2px] h-full origin-top rounded-full bg-gradient-to-b from-[#F5C451]/60 via-[#F5C451] to-[#F5C451] will-change-transform"
            style={{ transform: "scaleY(0)" }}
          />

          {/* Operational Stage Node Pips */}
          {GLOBAL_STAGES.map((stage, idx) => {
            const isReached = idx <= activeStageIndex
            const isCurrent = idx === activeStageIndex
            const nodeTop = (idx / (GLOBAL_STAGES.length - 1)) * TRACK_HEIGHT

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
              className="absolute top-0 left-1/2 pointer-events-none will-change-transform"
              style={{ transform: "translate(-50%, -50%) translateY(0px)" }}
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

export default memo(NexusScrollFlow)
