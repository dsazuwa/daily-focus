import type { Metadata } from 'next';import { ThemeProvider } from 'next-themes'

import AppBar from '@/components/ui/layout/app-bar';
import Footer from '@/components/ui/layout/footer';
import { ebGaramond, geistMono, geistSans, merriweatherHeading } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import './globals.css';

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
        'h-full font-serif antialiased',
        geistSans.variable,
        geistMono.variable,
        ebGaramond.variable,
        merriweatherHeading.variable,
      )}
    >
      <body className='flex min-h-full flex-col'>
        <AppBar />

       <ThemeProvider>{children}</ThemeProvider>

        <Footer />
      </body>
    </html>
  );
}
