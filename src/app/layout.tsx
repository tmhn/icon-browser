import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Icon Browser - Find & Browse Icons",
  description: "Find dem icons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
