import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

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
    .from(cardsRef.current, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.4");
  }, []);

  const features = [
    {
      icon: "🚀",
      title: "Инновации",
      description: "Используем последние технологии в сельском хозяйстве для максимальной эффективности."
    },
    {
      icon: "🌱",
      title: "Экологичность",
      description: "Устойчивые методы ведения хозяйства, заботящиеся об окружающей среде."
    },
    {
      icon: "📈",
      title: "Результат",
      description: "Доказанное увеличение урожайности и прибыльности вашего хозяйства."
    },
    {
      icon: "🤝",
      title: "Поддержка",
      description: "Круглосуточная техническая поддержка и консультации экспертов."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="about"
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Почему выбирают нас
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы объединяем традиционные знания с современными технологиями, 
            чтобы помочь вам достичь максимальных результатов в сельском хозяйстве.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => { if (el) cardsRef.current[index] = el; }}
              className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-all duration-300 group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
