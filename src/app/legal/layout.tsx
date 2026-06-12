import Link from "next/link";

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-accent hover:underline">
        ← Volver al inicio
      </Link>
      <article className="mt-6 space-y-6 text-sm leading-relaxed text-foreground [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:font-medium [&_p]:text-muted [&_li]:text-muted [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-accent [&_a:hover]:underline [&_strong]:text-foreground">
        {children}
      </article>
    </div>
  );
}
