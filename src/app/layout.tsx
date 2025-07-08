import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import QueryProvider from "@/components/providers/QueryProvider";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import NProgressBar from "@/components/shared/NProgressBar";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  alternates: {
    canonical: "https://henryleelab.com/",
  },
  authors: [{ name: "Henry Lee", url: "https://henryleelab.com" }],
  creator: "Henry Lee",
  description: "Henry Lee 的個人網站，展示前端開發專案與技術經驗。專精於 Next.js、React、TypeScript 開發。",
  keywords: ["Henry Lee", "前端工程師", "全端工程師", "Next.js", "React", "TypeScript", "AI", "作品集", "技術部落格"],
  openGraph: {
    description:
      "全端工程師 Henry Lee 的個人網站，專注於 AI、Web、技術分享與作品集。Front-end engineer portfolio, AI, web, and tech sharing.",
    images: [
      {
        alt: "Henry Lee 頭像 Henry Lee Portrait",
        height: 512,
        url: "https://henryleelab.com/images/my-photo.jpeg",
        width: 512,
      },
    ],
    title: "Henry Lee - 前端工程師 | Henry Lee's Personal Website",
    type: "website",
    url: "https://henryleelab.com/",
  },
  publisher: "Henry Lee",
  robots: "index, follow",
  title: "Henry Lee - 前端工程師",
  twitter: {
    card: "summary",
    description:
      "全端工程師 Henry Lee 的個人網站，專注於 AI、Web、技術分享與作品集。Front-end engineer portfolio, AI, web, and tech sharing.",
    images: ["https://henryleelab.com/images/my-photo.jpeg"],
    title: "Henry Lee - 前端工程師 | Henry Lee's Personal Website",
  },
};

export const Head = () => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `{
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Henry Lee",
            "url": "https://henryleelab.com",
            "image": "https://henryleelab.com/images/my-photo.jpeg",
            "sameAs": [
              "https://github.com/henryleelab"
            ],
            "jobTitle": "前端工程師",
            "worksFor": {
              "@type": "Organization",
              "name": "Henry Lee Lab"
            }
          }`,
        }}
        type="application/ld+json"
      />
    </>
  );
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html data-theme="corporate" lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <Navbar />
          <NProgressBar />
          <main className="flex-1 overflow-x-hidden pt-16">{children}</main>
          <Footer />
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
