import Contact from "../../pages/contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
        <div>

            <Contact />
        </div>
            </main>
            <Footer />
        </div>
    )
} 