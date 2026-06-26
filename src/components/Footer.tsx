import Link from "next/link";
import { FlowXLogo } from "@/components/FlowXLogo";

export function Footer() {
  return (
    <footer className="border-t border-flow-border bg-flow-black pb-12">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
          <div>
            <FlowXLogo height={24} href="#top" />
            <p className="mt-3 max-w-sm text-sm text-flow-muted">
              Crypto growth intelligence for teams that move first.
            </p>
          </div>
          <div className="flex flex-wrap gap-8">
            <Link href="#platform" className="nav-mm-link">Platform</Link>
            <Link href="#influencer-intelligence" className="nav-mm-link">Intelligence</Link>
            <Link href="#contact" className="nav-mm-link">Contact</Link>
          </div>
        </div>
        <p className="mt-12 border-t border-flow-border pt-8 text-xs text-flow-muted">
          © {new Date().getFullYear()} ScalpX. Not financial advice.
        </p>
      </div>
    </footer>
  );
}
