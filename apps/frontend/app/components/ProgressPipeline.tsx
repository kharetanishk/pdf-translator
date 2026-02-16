"use client";

export type PipelineStep =
  | "idle"
  | "extracting"
  | "translating"
  | "generating"
  | "done";

const STEPS: { id: PipelineStep; label: string }[] = [
  { id: "extracting", label: "Extracting Text" },
  { id: "translating", label: "Translating Text" },
  { id: "generating", label: "Generating PDF" },
  { id: "done", label: "Download Ready" },
];

const STEP_ORDER: PipelineStep[] = [
  "extracting",
  "translating",
  "generating",
  "done",
];

function getStepIndex(step: PipelineStep): number {
  const i = STEP_ORDER.indexOf(step);
  return i >= 0 ? i : -1;
}

type StepState = "idle" | "active" | "completed";

function getStepState(stepId: PipelineStep, currentStep: PipelineStep): StepState {
  const currentIdx = getStepIndex(currentStep);
  const stepIdx = getStepIndex(stepId);
  if (currentIdx < 0) return "idle";
  if (stepIdx < currentIdx) return "completed";
  if (stepIdx === currentIdx) return "active";
  return "idle";
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 8l3 3 7-7" />
    </svg>
  );
}

export default function ProgressPipeline({
  currentStep,
}: {
  currentStep: PipelineStep;
}) {
  if (currentStep === "idle") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Pipeline: ${currentStep}`}
      className="mt-8 w-full"
    >
      <div className="flex items-center justify-between gap-1">
        {STEPS.map((step, i) => {
          const state = getStepState(step.id, currentStep);
          const isLast = i === STEPS.length - 1;

          return (
            <div key={step.id} className="flex flex-1 min-w-0 items-center">
              <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
                <div
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                    state === "idle" &&
                      "border-white/20 bg-white/5 text-[#EDEDED]/40",
                    state === "active" &&
                      "border-[#EDEDED] bg-[#EDEDED]/15 text-[#EDEDED] animate-pulse motion-reduce:animate-none",
                    state === "completed" &&
                      "border-emerald-500/60 bg-emerald-500/20 text-emerald-400",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {state === "completed" ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : null}
                </div>
                <span
                  className={[
                    "text-center text-xs font-medium truncate w-full px-1",
                    state === "idle" && "text-[#EDEDED]/45",
                    state === "active" && "text-[#EDEDED]",
                    state === "completed" && "text-emerald-400/90",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={[
                    "mx-1 h-0.5 flex-1 min-w-[12px] transition-all duration-500 ease-out",
                    state === "completed" ? "bg-[#EDEDED]/60" : "bg-white/15",
                  ].join(" ")}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
