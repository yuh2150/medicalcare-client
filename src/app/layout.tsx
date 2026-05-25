import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { ChatWidget } from "@/components/ui/ChatWidget";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WebMedical – Your Health, Our Priority",
    template: "%s | WebMedical"
  },
  description: "Experience world-class healthcare with our team of dedicated medical professionals. Your wellness journey starts here.",
  metadataBase: new URL("https://webmedical.com"),
  keywords: ["healthcare", "medical services", "doctors", "appointments", "hospital", "clinic"],
  authors: [{ name: "WebMedical Team" }],
  creator: "WebMedical",
  publisher: "WebMedical",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-white text-gray-900`}
      >
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
