import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { SwRegister } from "@/components/SwRegister";

export const metadata: Metadata = {
  title: "Azure Cert Training Arena",
  description: "Gamified study app for Microsoft Azure certifications (AZ-500, AI-300)",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Cert Arena" },
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
