"use client";

import { Starfield } from "@/components/ui/starfield";

export function HeroStarfield() {
  return (
    <div className="hero-starfield" aria-hidden="true">
      <Starfield
        starCount={10000}
        waveFrequency={15}
        starEscapeWidth={400}
        voidWidth={80}
        starColor={{ r: 61, g: 80, b: 144 }}
        maxOpacity={140}
        rotationSpeed={0.0002}
        waveSpeed={0.005}
      />
    </div>
  );
}
