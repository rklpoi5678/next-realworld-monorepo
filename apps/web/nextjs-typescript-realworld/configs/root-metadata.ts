import type { Metadata } from 'next'

export const rootMetadata: Metadata = {
  metadataBase: new URL('https://conduit-nextjs.com'),
  title: {
    template: '%s | conduit',
    default: 'conduit - realWorldStory',
  },
  description: 'realWorld-next+typescript-project',
  keywords: ['blog', 'real-world', 'article', 'share'],
  authors: [{ name: 'conduit Team' }],
  openGraph: {
    type: 'website',
    siteName: 'conduit',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'conduit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}
