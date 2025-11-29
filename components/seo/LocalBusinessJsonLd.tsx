import React from "react";

export default function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    name: "EG Driving School",
    image: "https://egdrivingschool.com.au/og-image.jpg",
    "@id": "https://egdrivingschool.com.au",
    url: "https://egdrivingschool.com.au",
    telephone: "+61431512095",
    email: "info@egdrivingschool.com.au",
    address: {
      "@type": "PostalAddress",
      streetAddress: "36 South st",
      addressLocality: "Burpengary East",
      addressRegion: "QLD",
      postalCode: "4505",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -27.155, // Approximate coordinates for Burpengary East
      longitude: 152.965,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
    sameAs: [
      "https://www.facebook.com/egdrivingschool",
      "https://www.instagram.com/egdrivingschool",
    ],
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
