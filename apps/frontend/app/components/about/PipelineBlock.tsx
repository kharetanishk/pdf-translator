type PipelineBlockProps = {
  title?: string;
  steps: string[];
};

export default function PipelineBlock({ title, steps }: PipelineBlockProps) {
  return (
    <div className="my-6 rounded-xl border border-white/10 bg-[#0B0F18]/70 px-5 py-4 sm:px-6 sm:py-5">
      {title ? (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#EDEDED]/80">
          {title}
        </h3>
      ) : null}
      <div className="flex flex-col items-center gap-1 font-mono text-sm text-[#D6D6D6]/90 sm:text-base">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-center">{step}</span>
            {i < steps.length - 1 ? (
              <span className="my-1 text-[#EDEDED]/40" aria-hidden>
                ↓
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
