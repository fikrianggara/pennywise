export function TypographyH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="scroll-m-20 pb-2 text-2xl md:text-4xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export function Paragraph({ children }: { children: string }) {
  return (
    <p className="leading-relaxed md:leading-7 [&:not(:first-child)]:mt-6 font-thin">
      {children}
    </p>
  );
}
