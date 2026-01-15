import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#04101f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Governia - Portal Municipal",
  description: "Plataforma Digital Oficial del Municipio de Soteapan",
  applicationName: "Governia",
  appleWebApp: {
    capable: true,
    title: "Governia",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://governia.vercel.app"),
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`
          /* Custom Scrollbar Hide */
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </head>
      <body className="min-h-screen bg-gov-bg font-sans overflow-x-hidden text-white">
        {children}
      </body>
    </html>
  );
}