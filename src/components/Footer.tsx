import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.from(footerRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="bg-gray-900 text-white py-12"
    >
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary-400">
              FarmLand
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Современные решения для сельского хозяйства. 
              Мы помогаем фермерам достигать максимальных результатов.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Анализ почвы</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Системы полива</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Мониторинг урожая</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Консультации</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Компания</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">О нас</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Команда</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Карьера</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Новости</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <div className="space-y-2 text-gray-300">
              <p>+7 (999) 123-45-67</p>
              <p>info@farmland.ru</p>
              <p>Москва, ул. Сельскохозяйственная, 123</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 FarmLand. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
