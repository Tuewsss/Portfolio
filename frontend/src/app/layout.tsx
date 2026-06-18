import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WelcomeSplash } from "@/components/WelcomeSplash";
import { VisitorProvider } from "@/components/providers/VisitorProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { WeatherProvider } from "@/components/providers/WeatherProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Portfólio pessoal — projetos, sobre e contato.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <WeatherProvider>
            <ThemeProvider>
              <VisitorProvider>
                <WelcomeSplash />
                {children}
              </VisitorProvider>
            </ThemeProvider>
          </WeatherProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
