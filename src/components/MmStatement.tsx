import { Reveal } from "@/components/Reveal";

export function MmStatement() {
  return (
    <section className="mm-surface-light mm-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-4xl text-center">
          <h2 className="mm-stacked-title text-flow-black">
            <span>All your KOLs.</span>
            <span>All your sponsors.</span>
            <span className="text-flow-green-dim">All in one place.</span>
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
