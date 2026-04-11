import { Open_Sans, Sora } from "next/font/google";
import "../../styles/globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${sora.variable}`}
    >
      <head>
        <title>Nottingham Travels</title>
      </head>
      <body className="antialiased font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}