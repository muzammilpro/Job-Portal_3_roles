
import Providers from "./providers";
import Navbar from "@/app/components/Navbar";
import "./globals.css";
import Footer from "./components/Footer";


export const metadata = {
  title: "Job Portal",
  description: "Job Portal with User, Company, Admin roles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {/* {children} */}

          <main className="pt-[4%] md:pt-20">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
