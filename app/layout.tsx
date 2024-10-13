import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionWrapper from './components/SessionWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Happy Bank',
  description: 'Your daily happy memories',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <SessionWrapper>
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="icon.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  </SessionWrapper>
);

export default RootLayout;
