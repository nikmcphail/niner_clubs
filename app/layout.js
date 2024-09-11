import localFont from "next/font/local";
import Navbar from "./components/Navbar";
import "./globals.css";
import ScrollingBackground from "./components/ScrollingBackground";
import { Provider } from "./provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Niner Clubs",
  description: "Web application for UNC Charlotte clubs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <ScrollingBackground />
        {children}
      </body>
      </Provider>
    </html>
  );
}
