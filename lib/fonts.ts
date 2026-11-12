import { EB_Garamond, Geist, Geist_Mono, Merriweather } from 'next/font/google';

export const merriweatherHeading = Merriweather({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
