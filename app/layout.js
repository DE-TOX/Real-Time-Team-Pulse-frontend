import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastContextProvider } from "../contexts/ToastContext";
import { Inter, Sora } from 'next/font/google';
import Aurora from "../components/ui/Aurora";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata = {
  title: "Team Pulse Dashboard",
  description: "Real-time team wellness dashboard with AI-powered insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className={inter.className}>
        {/* Aurora Background - Global */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none'
        }}>
          <Aurora
            colorStops={["#C1BBD8", "#9580DB", "#5636D9"]}
            blend={1.0}
            amplitude={1.0}
            speed={0.4}
          />
        </div>
        <AuthProvider>
          <ToastContextProvider>
            {children}
          </ToastContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}