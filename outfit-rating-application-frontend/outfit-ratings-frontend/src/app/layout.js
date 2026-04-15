// global layout
import DesktopNavBar from "@/components/molecules/DesktopNavBar";
import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <DesktopNavBar />
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
