import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { EB_Garamond, Geist, Geist_Mono, Merriweather } from 'next/font/google';
import './globals.css';

const merriweatherHeading = Merriweather({ subsets: ['latin'], variable: '--font-heading' });

const ebGaramond = EB_Garamond({ subsets: ['latin'], variable: '--font-serif' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Daily Focus',
  description:
    'Plan your day and track your deep work sessions. A Pomodoro planner built for the developer you are becoming.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-serif',
        ebGaramond.variable,
        merriweatherHeading.variable,
      )}
    >
      <body className='flex min-h-full flex-col'>{children}</body>
    </html>
  );
}
