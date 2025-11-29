import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Driving Education Rules - Video Library - EG Driving School",
  description:
    "Watch our comprehensive collection of driving tutorials and learn essential driving skills. From basic vehicle control to advanced techniques.",
  openGraph: {
    title: "Driving Education Rules - Video Library - EG Driving School",
    description:
      "Watch our comprehensive collection of driving tutorials and learn essential driving skills.",
  },
};

export default function DrivingEducationRulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
