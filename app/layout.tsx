import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "sonner";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://bgremoval.in'),
  title: {
    default: 'BGRemoval.in | Free AI Background Remover',
    template: '%s | BGRemoval.in'
  },
  description: 'Remove backgrounds instantly with our free AI tool. Perfect for product photos, portraits, and design work. No signup required.',
  keywords: ['background remover', 'remove background', 'free background removal', 'AI background eraser', 'transparent background maker'],
  authors: [{ name: 'BGRemoval.in' }],
  creator: 'BGRemoval.in',
  openGraph: {
    title: 'BGRemoval.in | Free AI Background Remover',
    description: 'Remove backgrounds instantly with our free AI tool.',
    url: 'https://bgremoval.in',
    siteName: 'BGRemoval.in',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BGRemoval.in - Free Background Removal Tool',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BGRemoval.in | Free AI Background Remover',
    description: 'Remove backgrounds instantly with our free AI tool.',
    images: ['/twitter-image.jpg'],
    creator: '@bgremoval',
  },
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
  alternates: {
    canonical: 'https://bgremoval.in',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}