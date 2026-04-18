type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function PageHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: PageHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  return (
    <header className={alignClass}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
