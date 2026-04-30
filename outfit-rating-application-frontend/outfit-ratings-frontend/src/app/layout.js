// global layout
import DesktopNavBar from "@/components/molecules/DesktopNavBar";
import Footer from "@/components/molecules/Footer";
import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <DesktopNavBar />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
