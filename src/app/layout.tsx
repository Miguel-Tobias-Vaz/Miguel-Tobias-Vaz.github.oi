import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getSiteContent } from "@/lib/content";
import "./globals.css";
import "@/styles/portfolio.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.meta.siteTitle,
    description: content.meta.siteDescription,
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
}

const themeBootScript = `
(function(){
  try {
    var t = localStorage.getItem('portfolio-theme');
    var theme = t === 'light' ? 'light' : 'dark';
    var root = document.documentElement;
    root.classList.add(theme);
    root.dataset.theme = theme;
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.dataset.theme = 'dark';
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className={`${plexSans.variable} ${sourceSerif.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
