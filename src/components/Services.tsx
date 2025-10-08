import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const servicesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .from(servicesRef.current, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.4");
  }, []);

  const services = [
    {
      title: "Анализ почвы",
      description: "Комплексный анализ состава почвы для определения оптимальных условий выращивания.",
      price: "от 15,000 ₽",
      features: ["Химический анализ", "Микробиологический анализ", "Рекомендации по удобрениям"]
    },
    {
      title: "Система полива",
      description: "Автоматизированные системы полива с датчиками влажности и погодными станциями.",
      price: "от 50,000 ₽",
      features: ["Капельный полив", "Датчики влажности", "Мобильное управление"]
    },
    {
      title: "Мониторинг урожая",
      description: "Спутниковый мониторинг полей и анализ состояния посевов в реальном времени.",
      price: "от 25,000 ₽",
      features: ["Спутниковые снимки", "NDVI анализ", "Прогнозирование урожая"]
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="services"
      className="py-20 bg-gray-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Наши услуги
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Полный спектр услуг для современного сельского хозяйства
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              ref={el => { if (el) servicesRef.current[index] = el; }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <div className="text-3xl font-bold text-primary-600 mb-6">
                  {service.price}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600">
                    <span className="text-primary-600 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors group-hover:scale-105 transform duration-300">
                Заказать услугу
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
