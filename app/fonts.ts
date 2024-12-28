import { Hind, Montserrat, Permanent_Marker } from 'next/font/google';

export const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const hind = Hind({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-hind',
});

export const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-permanent-marker',
});
