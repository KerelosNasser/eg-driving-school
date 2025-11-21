import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home - Best Driving Lesson Package - EG Driving School",
  description: "Expert driving instruction for all ages and skill levels. Serving North Brisbane, Moreton Bay, and Redcliffe. Auto transmission specialist since 2015.",
  keywords: ["driving school", "driving lessons", "Brisbane", "Moreton Bay", "Redcliffe", "auto transmission", "learner driver", "driving instructor"],
  authors: [{ name: "EG Driving School" }],
  openGraph: {
    title: "EG Driving School - Expert Driving Instruction",
    description: "Expert driving instruction for all ages and skill levels",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

