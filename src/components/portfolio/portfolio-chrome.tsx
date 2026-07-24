import { PortfolioEffects } from "./portfolio-effects";

export function PortfolioChrome() {
  return (
    <>
      <PortfolioEffects />

      <div className="atmosphere" aria-hidden="true">
        <div className="atmosphere-spotlight" />
        <div className="atmosphere-layer">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
          <span className="ring ring-1" />
          <span className="ring ring-2" />
        </div>
      </div>

      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress-bar" />
      </div>

      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
    </>
  );
}
