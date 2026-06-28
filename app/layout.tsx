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
      className={`${montserrat.variable} ${hind.variable} ${permanentMarker.variable}`}
    >
      <head>
        <link rel="icon" type="image/png" href="icon.png" />
      </head>
      <body>
        <div className="mx-auto w-full shadow-2xl shadow-slate-900/10 rounded-[2rem] backdrop-blur-lg">
          {children}
        </div>
      </body>
    </html>
  </SessionWrapper>
);

export default RootLayout;
