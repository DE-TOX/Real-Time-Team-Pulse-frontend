import "./globals.css";
import { AuthProvider } from "../../contexts/AuthContext";

export const metadata = {
  title: "Team Pulse Dashboard",
  description: "Real-time team wellness dashboard with AI-powered insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}