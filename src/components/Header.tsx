import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(logoRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .from(navRef.current?.children || [], {
      y: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.4");

    // Scroll effect
    const handleScroll = () => {
      if (headerRef.current) {
        const scrolled = window.scrollY > 50;
        gsap.to(headerRef.current, {
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          duration: 0.3
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div ref={logoRef} className="text-2xl font-bold text-primary-600">
            FarmLand
          </div>
          
          <nav ref={navRef} className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary-600 transition-colors">
              Главная
            </a>
            <a href="#about" className="text-gray-700 hover:text-primary-600 transition-colors">
              О нас
            </a>
            <a href="#services" className="text-gray-700 hover:text-primary-600 transition-colors">
              Услуги
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              Контакты
            </a>
          </nav>

          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Связаться
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
