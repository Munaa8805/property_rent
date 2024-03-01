import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { GlobalProvider } from "@/context/GlobalContext";

import { ToastContainer } from "react-toastify";
import { Fira_Sans } from "next/font/google";
import "../assets/styles/globals.css";
import "photoswipe/dist/photoswipe.css";
import "react-toastify/dist/ReactToastify.css";

const roboto_init = Fira_Sans({
    weight: ["400", "700", "600"],
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata = {
    title: "Property Rent | Find the best property for you",
    description: "Find your dream property",
    keywords: "property, rent, best, property for rent",
};
const MainLayout = ({ children }) => {
    return (
        <html lang="en">
            <AuthProvider>
                <GlobalProvider>
                    <body className={roboto_init.className}>
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                        <ToastContainer />
                    </body>
                </GlobalProvider>
            </AuthProvider>
        </html>
    );
};

export default MainLayout;
