import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AdminProvider } from "@/components/admin/AdminProvider";
import AdminControls from "@/components/admin/AdminControls";
import { AuthProvider } from "@/components/providers/AuthProvider";

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
  metadataBase: new URL("https://egdrivingschool.com.au"), // Replace with actual domain if different
  title: {
    default: "EG Driving School - Best Driving Lessons in North Brisbane",
    template: "%s | EG Driving School",
  },
  description:
    "Expert driving instruction in North Brisbane, Moreton Bay, and Redcliffe. Auto transmission specialist. Book your driving lessons today with our experienced instructors.",
  keywords: [
    "driving school",
    "driving lessons",
    "Brisbane",
    "Moreton Bay",
    "Redcliffe",
    "auto transmission",
    "learner driver",
    "driving instructor",
    "driving test preparation",
    "logbook hours",
  ],
  authors: [{ name: "EG Driving School" }],
  creator: "EG Driving School",
  publisher: "EG Driving School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EG Driving School - Expert Driving Instruction",
    description:
      "Expert driving instruction for all ages and skill levels. Serving North Brisbane, Moreton Bay, and Redcliffe.",
    url: "https://egdrivingschool.com.au",
    siteName: "EG Driving School",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "EG Driving School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EG Driving School - Best Driving Lessons in North Brisbane",
    description:
      "Expert driving instruction in North Brisbane, Moreton Bay, and Redcliffe. Book your lessons today!",
    images: ["/og-image.jpg"], // Ensure this image exists
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
    "geo.position": "-27.4698;153.0251", // Approximate Brisbane coordinates
    ICBM: "-27.4698, 153.0251",
  },
};

import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <LocalBusinessJsonLd />
        <AuthProvider>
          <AdminProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <AdminControls />
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
