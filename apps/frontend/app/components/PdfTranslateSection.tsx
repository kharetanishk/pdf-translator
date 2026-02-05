"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LanguageOption = { code: string; name: string };

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

// 20 most spoken languages worldwide (curated list from prompt), alphabetized by name
const LANGUAGES: LanguageOption[] = [
  { code: "ar", name: "Arabic" },
  { code: "bn", name: "Bengali" },
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "id", name: "Indonesian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "mr", name: "Marathi" },
  { code: "zh", name: "Mandarin Chinese" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "es", name: "Spanish" },
  { code: "sw", name: "Swahili" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "tr", name: "Turkish" },
  { code: "ur", name: "Urdu" },
  { code: "vi", name: "Vietnamese" },
].sort((a, b) => a.name.localeCompare(b.name));

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)}MB`;
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <path
        d="M14 3v4a1 1 0 0 0 1 1h4"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <path
        d="M8 15.2c0-1.2.7-1.9 2-1.9s2 .7 2 1.9-.7 1.9-2 1.9-2-.7-2-1.9Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.65"
      />
      <path
        d="M13.7 17.1v-3.7h1.2c1.2 0 1.9.7 1.9 1.8 0 1.2-.7 1.9-1.9 1.9h-1.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.65"
      />
    </svg>
  );
}

function Dropdown({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: LanguageOption[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => options.find((o) => o.code === value),
    [options, value]
  );

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="w-full">
      <label className="block text-sm font-medium text-[#EDEDED]/80 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          "w-full rounded-xl border border-white/10 bg-[#0B0F18]/70",
          "px-4 py-3 text-left text-[#EDEDED] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
          "transition duration-200",
          "hover:border-white/20 hover:bg-[#0B0F18]/85",
          "focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-white/25",
          "flex items-center justify-between gap-3",
        ].join(" ")}
      >
        <span className={selected ? "text-[#EDEDED]" : "text-[#EDEDED]/55"}>
          {selected ? selected.name : placeholder}
        </span>
        <span
          className={[
            "text-[#EDEDED]/60 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      <div
        className={[
          "relative",
          open ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        <div
          role="listbox"
          className={[
            "absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10",
            "bg-[#070A10] shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
            "transition duration-200 origin-top",
            open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] -translate-y-1",
          ].join(" ")}
        >
          <div className="max-h-64 overflow-auto">
            {options.map((opt) => {
              const active = opt.code === value;
              return (
                <button
                  key={opt.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.code);
                    setOpen(false);
                  }}
                  className={[
                    "w-full px-4 py-3 text-left text-sm transition",
                    active
                      ? "bg-white/8 text-[#EDEDED]"
                      : "text-[#EDEDED]/80 hover:bg-white/6 hover:text-[#EDEDED]",
                    "focus:outline-none focus:bg-white/8",
                  ].join(" ")}
                >
                  {opt.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PdfTranslateSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fromLang, setFromLang] = useState("");
  const [toLang, setToLang] = useState("");
  const [error, setError] = useState<string>("");
  const [inactiveLabelIndex, setInactiveLabelIndex] = useState(0);

  const canTranslate = Boolean(file && fromLang && toLang);

  const inactiveLabels = useMemo(
    () => ["Translate PDF", "PDF का अनुवाद करें", "PDFを翻訳する", "翻譯 PDF"],
    []
  );

  // Multilingual text animation when inactive only
  useEffect(() => {
    if (canTranslate) return; // stop + lock to English when ready
    const id = setInterval(() => {
      setInactiveLabelIndex((i) => (i + 1) % inactiveLabels.length);
    }, 1800);
    return () => clearInterval(id);
  }, [canTranslate, inactiveLabels.length]);

  const validateAndSet = (f: File) => {
    setError("");
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Unsupported file type. Please upload a PDF file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("File is larger than 10MB. Please upload a smaller PDF.");
      return;
    }
    setFile(f);
  };

  const onPick = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    validateAndSet(files[0]); // one file only; replace existing
  };

  const onTranslate = () => {
    // UI-only for now. Hook your API call here.
    setError("");
    if (!canTranslate) return;
    // eslint-disable-next-line no-alert
    alert(`Translate: ${file?.name} (${fromLang} → ${toLang})`);
  };

  return (
    <section
      aria-label="Upload and translate PDF"
      className="night-sky relative w-full bg-black py-16 sm:py-20"
    >
      {/* Stars/glow handled by `.night-sky` pseudo-elements */}
      <div aria-hidden="true" className="jumping-stars" />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-[#EDEDED] font-semibold tracking-tight text-[clamp(1.6rem,3.2vw,2.4rem)]">
            Upload & Translate
          </h2>
          <p className="mt-3 text-[#EDEDED]/65 text-[clamp(0.95rem,1.4vw,1.05rem)]">
            Upload a PDF, choose languages, and translate—one file at a time.
          </p>
        </div>

        {/* Upload card / preview */}
        <div className="rounded-2xl border border-white/10 bg-[#070A10]/70 shadow-[0_30px_80px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="p-6 sm:p-8">
            {error ? (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100/90">
                {error}
              </div>
            ) : null}

            {!file ? (
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload PDF. Click or drag and drop."
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  onPick(e.dataTransfer.files);
                }}
                className={[
                  "group relative flex flex-col items-center justify-center",
                  "min-h-[320px] sm:min-h-[360px]",
                  "rounded-2xl border-2 border-dashed",
                  dragOver ? "border-white/35 bg-white/[0.06]" : "border-white/15 bg-white/[0.02]",
                  "transition duration-300 cursor-pointer outline-none",
                  "hover:border-white/30 hover:bg-white/[0.05]",
                  "focus-visible:ring-2 focus-visible:ring-white/20",
                ].join(" ")}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => onPick(e.target.files)}
                />

                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
                </div>

                <PdfIcon className="h-16 w-16 sm:h-20 sm:w-20 text-[#EDEDED]/80" />
                <div className="mt-5 text-center">
                  <div className="text-[#EDEDED] font-semibold text-xl sm:text-2xl">
                    Upload PDF
                  </div>
                  <div className="mt-2 text-[#EDEDED]/60 text-sm sm:text-base">
                    Max file size: 10MB
                  </div>
                </div>

                <div className="mt-7 text-[#EDEDED]/55 text-sm">
                  Click to browse or drag & drop
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-6 transition">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04]">
                    <PdfIcon className="h-8 w-8 sm:h-9 sm:w-9 text-[#EDEDED]/80" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[#EDEDED] font-medium truncate">{file.name}</div>
                    <div className="text-[#EDEDED]/60 text-sm mt-0.5">
                      {formatBytes(file.size)} • PDF
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setError("");
                    }}
                    className="rounded-xl border border-white/12 bg-white/[0.02] px-3 py-2 text-sm text-[#EDEDED]/80 transition hover:bg-white/[0.06] hover:border-white/20"
                  >
                    Replace
                  </button>
                </div>
              </div>
            )}

            {/* Language selection */}
            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <Dropdown
                label="From Language"
                value={fromLang}
                onChange={setFromLang}
                options={LANGUAGES}
                placeholder="Select source language"
              />
              <Dropdown
                label="To Language"
                value={toLang}
                onChange={setToLang}
                options={LANGUAGES}
                placeholder="Select target language"
              />
            </div>

            {/* CTA */}
            <div className="mt-9 sm:mt-10 flex justify-center">
              <button
                type="button"
                onClick={onTranslate}
                disabled={!canTranslate}
                aria-disabled={!canTranslate}
                className={[
                  "w-full sm:w-[min(520px,100%)]",
                  "rounded-2xl px-6 py-4 sm:py-5",
                  "font-semibold",
                  "transition duration-300",
                  canTranslate
                    ? "bg-[#EDEDED] text-[#0B0F18] hover:bg-white shadow-[0_10px_40px_rgba(255,255,255,0.10)] premium-cta-pulse"
                    : "bg-[#0B0F18]/70 text-[#EDEDED] cursor-not-allowed border border-white/12 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:border-white/18",
                  "focus:outline-none focus:ring-2 focus:ring-white/20 hover:brightness-[1.06]",
                ].join(" ")}
              >
                <span className="relative block w-full">
                  {/* Fixed-height label slot to prevent layout shift */}
                  <span className="btn-label-slot">
                    {canTranslate ? (
                      <span className="btn-label-static">Translate PDF</span>
                    ) : (
                      <span
                        // key forces the enter animation each cycle
                        key={inactiveLabelIndex}
                        className="btn-label-anim"
                      >
                        {inactiveLabels[inactiveLabelIndex]}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </div>

            {!canTranslate ? (
              <p className="mt-4 text-center text-sm text-[#EDEDED]/55">
                Upload a PDF and select both languages to enable translation.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

