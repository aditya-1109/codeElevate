"use client"
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CodeRenderer from '../codeRenderer';


export default function Hero() {



  const codeString = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeLevAte | Web App Development</title>

    <meta name="description" content="CodeLevAte builds scalable, high-performance web applications for modern businesses." />

    <link rel="stylesheet" href="styles.css" />
  </head>

  <body>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>
          Elevate Your Business With
          <span class="brand">CodeLevAte</span>
        </h1>

        <p class="hero-subtitle">
          We design, develop, and scale high-impact web applications
          that drive real business growth.
        </p>

        <div class="hero-actions">
          <a href="#contact" class="btn primary">
            Get Started
          </a>

          <a href="#services" class="btn secondary">
            View Services
          </a>
        </div>
      </div>

      <div class="hero-metrics">
        <div class="metric">
          <h3>50+</h3>
          <p>Projects Delivered</p>
        </div>

        <div class="metric">
          <h3>99%</h3>
          <p>Client Satisfaction</p>
        </div>

        <div class="metric">
          <h3>24/7</h3>
          <p>Support</p>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services">
      <div class="container">
        <h2>Our Expertise</h2>

        <div class="service-grid">
          <div class="service-card">
            <h3>Web App Development</h3>
            <p>
              Scalable, secure and performance-driven web applications
              built using modern technologies.
            </p>
          </div>

          <div class="service-card">
            <h3>UI / UX Design</h3>
            <p>
              Clean, intuitive and conversion-focused user interfaces
              that enhance user experience.
            </p>
          </div>

          <div class="service-card">
            <h3>API & Backend</h3>
            <p>
              Robust backend architectures and APIs designed to scale
              with your business.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <h2>
        Ready to Build Something Powerful?
      </h2>

      <p>
        Partner with <strong>CodeLevAte</strong> and turn your ideas
        into high-performing digital products.
      </p>

      <a href="#contact" class="btn primary large">
        Let’s Talk
      </a>
    </section>

    <footer class="footer">
      <p>
        © 2026 CodeLevAte. Building the future of web applications.
      </p>
    </footer>
  </body>
</html>
`;


  const [code, setCode] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setCode((prev) => prev + codeString[i]);
      i++;
      if (i === codeString.length) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, []);



  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-black">

      <div className='absolute w-full z-0'>

        <CodeRenderer code={code} />
        <span className="text-white animate-flicker">|</span>
      </div>

      {/* overlay */}
      <div className='h-full w-full bg-black/80 absolute' />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6">
            You Dream, We Complete
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              With Your Budget
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Transform your vision into reality with our comprehensive IT solutions.
            Quality, speed, and affordability - all in one package.
          </p>
          <div className="flex flex-col justify-start items-center sm:flex-row gap-4">
            <Link href="/contact">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black px-4 py-2 rounded-full flex flex-row justify-center items-center gap-2">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
            <Link href="/services">
              <button className="text-white flex border-white/20 hover:bg-white/10 bg-black/30 backdrop-blur-sm">
                View Services
              </button>
            </Link>
          </div>
        </div>
      </div>


    </section>
  );
}
