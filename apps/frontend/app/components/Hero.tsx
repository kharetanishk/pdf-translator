"use client";

export default function Hero() {
  return (
    <section
      aria-label="GlobalPDF hero"
      className="relative min-h-screen w-full overflow-hidden bg-[#070A10]"
    >
      {/* Background video(s) */}
      <div className="absolute inset-0 z-0">
        {/* Desktop video (>= 768px) */}
        <video
          className="hidden md:block h-full w-full object-cover brightness-[1.12] contrast-[1.05]"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/hero-video-desktop.mp4" type="video/mp4" />
        </video>

        {/* Mobile video (< 768px) */}
        <video
          className="block md:hidden h-full w-full object-cover object-center brightness-[1.12] contrast-[1.05]"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          {/* NOTE: You asked for hero-video-mobile.mp4. Right now the repo has hero-video.mp4, so we use it. */}
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Readability overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hero-overlay z-10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hero-vignette z-10"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="hero-fade-up text-[clamp(2rem,6vw,4.25rem)] font-semibold tracking-tight text-[#EDEDED] leading-[1.08]">
            One Document. Two Languages. Zero Barriers.
          </h1>
          <p className="hero-fade-up hero-fade-up--delay mt-5 text-[clamp(1rem,2.2vw,1.4rem)] leading-relaxed text-[#D6D6D6]/80 max-w-3xl mx-auto">
            Seamlessly translate PDFs while preserving meaning, structure, and intent.
          </p>
        </div>
      </div>
    </section>
  );
}

