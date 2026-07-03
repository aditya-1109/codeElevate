import Projects from "../../pages/projects";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ProjectsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
        <div>


            <Projects />
        </div>
            </main>
            <Footer />
        </div>
    )
} 