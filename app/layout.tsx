import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const title = 'Designic Milano | Workplace & interior design studio';
const description =
  'Designic Milano is an international interior and workplace design studio founded by Anya Sarks. 10 years, 200+ projects, 7 countries. Spaces that inspire. Environments that perform.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.designic.com'),
  title,
  description,
  openGraph: { title, description, type: 'website', images: [{ url: '/projects/gsp-01.webp', width: 1483, height: 835, alt: 'GSP corporate office by Designic Milano' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/projects/gsp-01.webp'] },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
