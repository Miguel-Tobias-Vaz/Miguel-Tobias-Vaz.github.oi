import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import "@/styles/portfolio.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfólio — Miguel Tobias",
  description: "Portfólio de Miguel Tobias Vaz Furtado — Desenvolvedor júnior",
  icons: {
    icon: [
      { url: "/Imagens/favicon/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/Imagens/favicon/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/Imagens/favicon/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/Imagens/favicon/icon-192.png",
    shortcut: "/Imagens/favicon/icon-48.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
