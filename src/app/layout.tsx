import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], display: "swap", variable: "--font-lora" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nombre} · ${SITE.nombreLargo}`,
    template: `%s · ${SITE.nombre}`,
  },
  description: SITE.descripcion,
  openGraph: {
    title: `${SITE.nombre} · ${SITE.nombreLargo}`,
    description: SITE.descripcion,
    type: "website",
    locale: "es_CO",
    url: SITE.url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${lora.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}