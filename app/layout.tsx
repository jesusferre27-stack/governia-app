import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Governia - Staff Login",
  description: "Portal de gestión municipal",
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
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}