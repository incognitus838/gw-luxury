import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a090b",
};

export const metadata = {
  title: {
    default: "GW Luxury",
    template: "%s",
  },
  description:
    "GW Luxury — chauffeur-driven car rental in Lagos. Driver and fuel included. We come to your pickup address.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Italiana&family=Manrope:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
