type AboutSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function AboutSection({ title, children }: AboutSectionProps) {
  return (
    <section className="mb-16 last:mb-0">
      <h2 className="mb-6 text-xl font-semibold tracking-tight text-[#EDEDED] sm:text-2xl">
        {title}
      </h2>
      <div className="space-y-4 text-[#D6D6D6]/90 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
