type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description
}: SectionTitleProps) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">{description}</p>
    </div>
  );
}
