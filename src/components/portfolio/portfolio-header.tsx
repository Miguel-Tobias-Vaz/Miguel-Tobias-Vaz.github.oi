"use client";

import { Header2, type Header2Link } from "@/components/ui/header-2";

export type PortfolioNavItem = Header2Link;

interface PortfolioHeaderProps {
  navItems: PortfolioNavItem[];
  activeHref?: string;
}

export function PortfolioHeader({ navItems, activeHref }: PortfolioHeaderProps) {
  return (
    <div
      id="portfolio-header"
      className="portfolio-header-shell pointer-events-none fixed inset-x-0 top-0 z-[999] flex justify-center px-3 pt-[max(10px,env(safe-area-inset-top,0px))] md:px-4 md:pt-[max(14px,env(safe-area-inset-top,0px))]"
    >
      <div className="pointer-events-auto w-full max-w-6xl">
        <Header2 links={navItems} activeHref={activeHref} ctaHref={undefined} />
      </div>
    </div>
  );
}
