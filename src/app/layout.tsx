import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { SwRegister } from "@/components/SwRegister";

export const metadata: Metadata = {
  title: "AZ-500 Training Arena",
  description: "Gamified study app for Microsoft Azure Security Engineer certification",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "AZ-500" },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SwRegister />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
