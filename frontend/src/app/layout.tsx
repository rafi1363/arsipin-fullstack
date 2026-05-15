import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arsipin",
  description: "Aplikasi manajemen arsip dan dokumen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
