import type { Metadata } from "next";
import { Lora, Nunito_Sans } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Todoo - A Cozy Space for Your Tasks",
  description:
    "Todoo is a calm, beautiful, and private to-do app designed to help you organize your thoughts and find your flow, gently.",
  keywords: [
    "todo app",
    "task management",
    "productivity",
    "cozy",
    "minimalist",
    "organizer",
  ],
  openGraph: {
    title: "Todoo - A Cozy Space for Your Tasks",
    description: "Find your flow, gently.",

    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todoo - A Cozy Space for Your Tasks",
    description: "Find your flow, gently.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} ${nunitoSans.variable} bg-[#F6EFE6] antialiased`}
      >
        {/* uncessary wanted to try an idea but failed and didnt remove the code still now */}
        <main className="w-[100%] h-[100%] fixed flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
