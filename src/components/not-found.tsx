import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Mark } from "@/components/logo";

export function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="wrap relative flex flex-1 flex-col items-center justify-center py-24 text-center">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <Mark className="relative size-16 opacity-90" />
        <p className="eyebrow relative mt-8">Error 404</p>
        <h1 className="h-display relative mt-3 text-4xl sm:text-5xl">This facet does not exist.</h1>
        <p className="relative mt-4 max-w-md text-muted">The page you were looking for moved or never existed. Your allocation is one click away.</p>
        <div className="relative mt-8 flex gap-3">
          <Link to="/check" className="btn-volt">Check allocation</Link>
          <Link to="/" className="btn-ghost">Home</Link>
        </div>
      </main>
    </div>
  );
}
