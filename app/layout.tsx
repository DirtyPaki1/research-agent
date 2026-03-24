import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, Manrope } from 'next/font/google';
import './globals.css';

// Clean, modern fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
});

// Viewport configuration
export const viewport: Viewport = {
  themeColor: '#ff6b35',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://research-assistant-ai.vercel.app'),
  title: {
    default: 'Research Assistant AI | Intelligent Document Q&A',
    template: '%s | Research Assistant AI'
  },
  description: 'A production-ready AI application demonstrating RAG architecture. Upload documents and ask intelligent questions - the AI reads, understands, and answers based on your content.',
  keywords: ['AI Agent', 'RAG', 'Document Q&A', 'Next.js', 'TypeScript', 'OpenAI', 'Portfolio Project', 'AI Engineering'],
  authors: [{ name: 'Your Name', url: 'https://github.com/yourusername' }],
  creator: 'Your Name',
  publisher: 'Vercel',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://research-assistant-ai.vercel.app',
    title: 'Research Assistant AI | Intelligent Document Q&A',
    description: 'Upload documents and ask intelligent questions - the AI reads, understands, and answers based on your content.',
    siteName: 'Research Assistant AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Research Assistant AI - Intelligent Document Q&A Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research Assistant AI',
    description: 'AI-powered document Q&A with RAG architecture',
    images: ['/og-image.png'],
    creator: '@yourusername',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${manrope.variable}`}>
      <head>
        {/* Preconnect to fonts for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Apple specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Research AI" />
        
        {/* Windows specific */}
        <meta name="msapplication-TileColor" content="#ff6b35" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Additional meta tags */}
        <meta name="application-name" content="Research Assistant AI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Simple styles without SSR conflicts */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Smooth scrolling */
            html {
              scroll-behavior: smooth;
            }
            
            /* Custom scrollbar - will be overridden by globals.css */
            ::-webkit-scrollbar {
              width: 12px;
              height: 12px;
            }
            
            /* Ensure body doesn't have any conflicting styles */
            body {
              margin: 0;
              padding: 0;
            }
          `
        }} />
      </head>
      <body className={`
        ${inter.className}
        bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50
        dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        text-gray-900 dark:text-gray-100
        min-h-screen
        antialiased
        transition-colors duration-300
      `}>
        {/* Background elements - keep minimal to avoid conflicts */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Gradient circles */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-orange-200/20 to-purple-200/20 rounded-full blur-3xl dark:from-orange-900/10 dark:to-purple-900/10" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-teal-200/20 to-orange-200/20 rounded-full blur-3xl dark:from-teal-900/10 dark:to-orange-900/10" />
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}