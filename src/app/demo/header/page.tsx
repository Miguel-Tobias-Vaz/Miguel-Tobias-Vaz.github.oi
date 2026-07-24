import { Header2 } from "@/components/ui/header-2";

const demoLinks = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "About", href: "#" },
];

export default function HeaderDemoPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <div className="w-full max-w-5xl">
          <Header2 links={demoLinks} />
        </div>
      </div>

      <main className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-12 pt-28">
        <div className="mb-4 space-y-2">
          <div className="bg-accent h-6 w-4/6 rounded-md border border-border" />
          <div className="bg-accent h-6 w-1/2 rounded-md border border-border" />
        </div>
        <div className="mb-8 flex gap-2">
          <div className="bg-accent h-3 w-14 rounded-md border border-border" />
          <div className="bg-accent h-3 w-12 rounded-md border border-border" />
        </div>

        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="mb-8 space-y-2">
            <div className="bg-accent h-4 w-full rounded-md border border-border" />
            <div className="bg-accent h-4 w-full rounded-md border border-border" />
            <div className="bg-accent h-4 w-full rounded-md border border-border" />
            <div className="bg-accent h-4 w-1/2 rounded-md border border-border" />
          </div>
        ))}
      </main>
    </div>
  );
}
