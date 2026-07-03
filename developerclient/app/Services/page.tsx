import Services from "@/pages/services";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <div>


                    <Services />
                </div>
            </main>
            <Footer />
        </div>
    )
} 