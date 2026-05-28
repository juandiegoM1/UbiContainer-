import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UbiContainer",
  description: "Panel de administracion de contenedores urbanos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
