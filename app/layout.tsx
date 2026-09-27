import type { Metadata } from 'next';
import SessionWrapper from './SessionWrapper';
import { hind, montserrat, permanentMarker } from './fonts';
import './globals.css';

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
    <html
      lang="en"
      className={`${montserrat.variable} ${hind.variable} ${permanentMarker.variable} h-screen overflow-hidden`}
    >
      <head>
        <link rel="icon" type="image/png" href="icon.png" />
      </head>
      <body className="h-screen overflow-hidden">
        <div className="w-full h-full overflow-hidden">{children}</div>
      </body>
    </html>
  </SessionWrapper>
);

export default RootLayout;
