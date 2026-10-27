import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AthleteOS Training Admin",
  description: "Administration for AthleteOS Training coaches and invite codes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
