import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - EG Driving School",
  description:
    "Read our Student Enrollment Agreement. Understand the terms regarding eligibility, bookings, payments, cancellations, and student responsibilities.",
  openGraph: {
    title: "Terms and Conditions - EG Driving School",
    description:
      "Student Enrollment Agreement and Terms of Service for EG Driving School.",
  },
};

export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
