import About from "@/pages/about";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <div>


                    <About />
                </div>
            </main>
            <Footer />
        </div>
    )
} 