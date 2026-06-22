import "./globals.css";

export const metadata = {
  title: "Signal Desk — Crypto Technical Signals",
  description: "A technical-signal terminal for crypto. Multi-indicator BUY / SELL / HOLD calls.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
