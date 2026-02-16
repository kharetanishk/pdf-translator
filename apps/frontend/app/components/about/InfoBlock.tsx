type InfoBlockProps = {
  title?: string;
  children: React.ReactNode;
};

export default function InfoBlock({ title, children }: InfoBlockProps) {
  return (
    <div className="my-6 rounded-xl border border-white/10 bg-[#0B0F18]/70 px-5 py-4 sm:px-6 sm:py-5">
      {title ? (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#EDEDED]/80">
          {title}
        </h3>
      ) : null}
      <div className="font-mono text-sm leading-relaxed text-[#D6D6D6]/90 sm:text-base">
        {children}
      </div>
    </div>
  );
}
