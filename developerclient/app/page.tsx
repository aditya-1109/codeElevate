import Image from "next/image";
import Header from "../components/Header";
import Footer from '../components/Footer';
import Hero from '../components/home/Hero';
import OurDream from '../components/home/OurDream';
import ServicesPreview from '../components/home/ServicesPreview';
import ProjectsPreview from '../components/home/ProjectsPreview';
import Reviews from '../components/home/Reviews';

export default function Home() {
  return (

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
        <div>
              <Hero />
              <OurDream />
              <ServicesPreview />
              <ProjectsPreview />
              <Reviews />
            </div>
        </main>
        <Footer />
      </div>

  );
}
