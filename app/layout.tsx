import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { CartProvider } from "@/components/CartSheet";
import Providers from "@/components/Providers";
import { Inter, Playfair_Display } from "next/font/google";

const CartSheet = dynamic(
  () => import("@/components/CartSheet").then((mod) => mod.default),
  { ssr: false }
);

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata = {
  title: "BizMenu Builder — Your Digital Menu, Your Rules",
  description:
    "Create and manage your restaurant's digital ordering experience. Fully customizable menus, branding, and ordering — all in one platform."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} bg-slate-950 text-slate-50 font-body`}
      >
        <Providers>
          <CartProvider>
            <ThemeProvider>
              <Navbar />
              {children}
              <CartSheet />
            </ThemeProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
