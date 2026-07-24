"use client";

import { useEffect, useRef } from "react";

export interface StarColor {
  r: number;
  g: number;
  b: number;
}

export interface StarfieldProps {
  starCount?: number;
  waveFrequency?: number;
  starEscapeWidth?: number;
  voidWidth?: number;
  starColor?: StarColor;
  maxOpacity?: number;
  rotationSpeed?: number;
  waveSpeed?: number;
}

interface Star {
  orbital: number;
  opacity: number;
  position: { x: number; y: number };
  originPosition: { x: number; y: number };
  rotation: number;
  realPosition: { x: number; y: number };
  rSpeed: number;
  waveSpeed1: number;
  waveSpeed2: number;
  wave1: number;
  wave2: number;
  id: number;
}

const Starfield = ({
  starCount = 25000,
  waveFrequency = 20,
  starEscapeWidth = 255,
  voidWidth: _voidWidth = 100,
  starColor = { r: 168, g: 85, b: 247 },
  maxOpacity = 255,
  rotationSpeed = 0.0005,
  waveSpeed = 0.01,
}: StarfieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let size = { x: 0, y: 0 };
    let imagedata: ImageData;
    let data: Uint32Array;
    const startTime = Date.now();
    let currentTime = 0;

    const setSize = () => {
      size.x = container.clientWidth;
      size.y = container.clientHeight;
      canvas.width = size.x;
      canvas.height = size.y;

      imagedata = context.createImageData(size.x, size.y);
      data = new Uint32Array(imagedata.data.buffer);
      starsRef.current = [];
    };

    const rotate = (
      cx: number,
      cy: number,
      x: number,
      y: number,
      radians: number
    ) => {
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      return {
        x: cos * (x - cx) + sin * (y - cy) + cx,
        y: cos * (y - cy) - sin * (x - cx) + cy,
      };
    };

    const createStar = () => {
      const rands = [
        Math.random() * (starEscapeWidth / 2) + 1,
        Math.random() * (starEscapeWidth / 2) + starEscapeWidth,
      ];
      const orbital = rands.reduce((p, c) => p + c, 0) / rands.length;
      const opacity = Math.floor(
        (1 - orbital / starEscapeWidth) * maxOpacity + Math.random() * 80
      );
      const position = {
        x: size.x / 2,
        y: size.y / 2 + orbital,
      };
      const rotation = Math.PI * (Math.random() * 2);
      const rotated = rotate(
        size.x / 2,
        size.y / 2,
        position.x,
        position.y,
        rotation
      );

      starsRef.current.push({
        orbital,
        opacity,
        position: rotated,
        originPosition: { ...position },
        rotation,
        realPosition: { ...rotated },
        rSpeed: Math.random() * rotationSpeed + opacity / 20000,
        waveSpeed1: Math.random() * waveSpeed,
        waveSpeed2: Math.random() * waveSpeed,
        wave1: Math.sin(currentTime * (Math.random() * waveSpeed)) * waveFrequency,
        wave2: Math.sin(currentTime * (Math.random() * waveSpeed)) * waveFrequency,
        id: starsRef.current.length,
      });
    };

    const drawStar = (star: Star) => {
      const prevIndex =
        Math.floor(star.realPosition.y + star.wave1) * size.x +
        Math.floor(star.realPosition.x + star.wave2);
      if (prevIndex >= 0 && prevIndex < data.length) {
        data[prevIndex] = 0;
      }

      star.wave1 = Math.sin(currentTime * star.waveSpeed1) * waveFrequency;
      star.wave2 = Math.sin(currentTime * star.waveSpeed2) * waveFrequency;
      star.realPosition = rotate(
        size.x / 2,
        size.y / 2,
        star.position.x,
        star.position.y,
        star.rSpeed * currentTime
      );
      star.opacity = Math.floor(
        (1 - star.orbital / starEscapeWidth) * maxOpacity + Math.random() * 80
      );

      const index =
        Math.floor(star.realPosition.y + star.wave1) * size.x +
        Math.floor(star.realPosition.x + star.wave2);
      if (index >= 0 && index < data.length) {
        data[index] =
          (star.opacity << 24) |
          (starColor.b << 16) |
          (starColor.g << 8) |
          starColor.r;
      }
    };

    const render = () => {
      currentTime = (Date.now() - startTime) / 10;

      context.fillRect(0, 0, size.x, size.y);

      if (starsRef.current.length < starCount) {
        const batch = Math.min(100, starCount - starsRef.current.length);
        for (let i = 0; i < batch; i++) {
          createStar();
        }
      }

      for (const star of starsRef.current) {
        drawStar(star);
      }

      context.putImageData(imagedata, 0, 0);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    setSize();
    render();

    const resizeHandler = () => setSize();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    starCount,
    waveFrequency,
    starEscapeWidth,
    starColor.r,
    starColor.g,
    starColor.b,
    maxOpacity,
    rotationSpeed,
    waveSpeed,
  ]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

export { Starfield };
