import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Disallow API and admin routes if they exist
    },
    sitemap: 'https://egdrivingschool.com.au/sitemap.xml',
  }
}
