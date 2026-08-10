"use client";

import { EtheralShadow } from "@/components/ui/etheral-shadow";
import { useTheme } from "@/components/theme/theme-provider";
import { PortfolioEffects } from "./portfolio-effects";

export function PortfolioChrome() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <PortfolioEffects />

      <div className="atmosphere" aria-hidden="true">
        <EtheralShadow
          className="atmosphere-shader"
          color={
            isDark ? "rgba(210, 210, 210, 0.85)" : "rgba(40, 40, 40, 0.55)"
          }
          animation={{ scale: 70, speed: 55 }}
          noise={{ opacity: 0.45, scale: 1.1 }}
          sizing="fill"
        />
        <div className="atmosphere-veil" />
      </div>

      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress-bar" />
      </div>
    </>
  );
}
