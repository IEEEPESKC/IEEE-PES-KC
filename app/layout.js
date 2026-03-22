import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'IEEE PES Kerala Chapter - Power & Energy Society',
  description: 'IEEE Power and Energy Society Kerala Chapter - Advancing Technology for Humanity',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Retain Bootstrap and FontAwesome for basic grid/icons if used */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

        {/* IEEE PES Template CSS */}
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans+Condensed%3A300%2C700%7COpen+Sans%3A400%2C700&#038;ver=6.9.4' type='text/css' media='all' />
        <link rel="stylesheet" href="/pes-theme/style.css" />
        <link rel="stylesheet" href="/pes-theme/css/styles.css" />
        <link rel="stylesheet" href="/pes-theme/css/green.css" />
      </head>
      <body>
        {children}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
