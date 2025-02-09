export const SchemaMarkup_v2414 = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "QUAi",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web browser",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "GBP",
      "lowPrice": "0",
      "highPrice": "999",
      "offerCount": "3",
      "offers": [
        {
          "@type": "Offer",
          "name": "Free Tier",
          "price": "0",
          "priceCurrency": "GBP"
        },
        {
          "@type": "Offer",
          "name": "Professional",
          "price": "29",
          "priceCurrency": "GBP"
        },
        {
          "@type": "Offer",
          "name": "Enterprise",
          "price": "Custom",
          "priceCurrency": "GBP"
        }
      ]
    },
    "description": "AI-powered learning and assessment platform for schools, corporations, and individual learners",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "featureList": [
      "AI-powered question generation",
      "Learning management system",
      "Assessment tools",
      "Progress tracking",
      "Analytics dashboard",
      "Custom branding",
      "Integration capabilities"
    ],
    "keywords": [
      "AI learning platform",
      "educational technology",
      "assessment tools",
      "quiz generator",
      "learning management system",
      "corporate training",
      "school assessment"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
