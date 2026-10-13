import { useEffect, useRef, useState } from "react"

export default function StandardizedPageCTA() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || !("IntersectionObserver" in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Connect Your Operations"
      className="relative w-full overflow-hidden bg-[#0B1F3B] py-20 text-white lg:py-24"
    >
      {/* Established FieldOps subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"
        aria-hidden="true"
      />

      {/* Restrained subtle ambient illumination */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[360px] sm:size-[480px] rounded-full bg-[#F5C451]/[0.035] blur-3xl"
        aria-hidden="true"
      />

      <div
        className={`relative mx-auto max-w-4xl px-5 text-center transition-all duration-700 ease-out lg:px-8 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-5xl">
          Ready to Connect Your Operations?
        </h2>

        {/* Restrained gold accent divider */}
        <div
          className="mx-auto my-5 flex items-center justify-center gap-2"
          aria-hidden="true"
        >
          <span className="h-[2px] w-10 sm:w-16 rounded-full bg-gradient-to-r from-transparent via-[#F5C451] to-[#F5C451]" />
          <span className="size-1.5 rounded-full bg-[#F5C451]" />
          <span className="h-[2px] w-10 sm:w-16 rounded-full bg-gradient-to-l from-transparent via-[#F5C451] to-[#F5C451]" />
        </div>

        <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-[#F8FAFC]/75 sm:text-lg">
          Bring your assets, service requests, work orders, inventory, and operational workflows together with FieldOps Nexus.
        </p>
      </div>
    </section>
  )
}
