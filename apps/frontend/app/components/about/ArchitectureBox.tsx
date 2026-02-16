type ArchitectureBoxProps = {
  title?: string;
  items: string[];
};

export default function ArchitectureBox({ title, items }: ArchitectureBoxProps) {
  return (
    <div className="my-6 rounded-xl border border-white/10 bg-[#070A10]/90 px-5 py-4 sm:px-6 sm:py-5">
      {title ? (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#EDEDED]/80">
          {title}
        </h3>
      ) : null}
      <div className="space-y-2 font-mono text-sm text-[#D6D6D6]/90 sm:text-base">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[#EDEDED]/50 select-none">›</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
