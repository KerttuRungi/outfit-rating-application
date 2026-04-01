// src/app/layout.js
import DesktopNavBar from '@/components/DesktopNavBar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}