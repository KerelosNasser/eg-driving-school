import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminProvider } from "@/components/admin/AdminProvider";
import AdminControls from "@/components/admin/AdminControls";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <AdminProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <AdminControls />
        </AdminProvider>
      </body>
    </html>
  );
}

