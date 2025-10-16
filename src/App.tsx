import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const locationRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Smooth scroll function
  const smoothScrollTo = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80; // Account for navbar height
      
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: offsetTop, autoKill: false },
        ease: "power2.inOut"
      });
    }
  };

  useEffect(() => {
    if (heroSectionRef.current) {
      // Начальные стили
      gsap.set(heroSectionRef.current, {
        transform: 'translate3d(0px, 0px, 0px)',
        scale: 1
      });

      // ScrollTrigger анимация
      ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        refreshPriority: -1,
        onUpdate: (self) => {
          // Интерполируем scale от 1 до 0.9
          const scale = 1 - (self.progress * 0.1); // 1 - (0 * 0.1) = 1, 1 - (1 * 0.1) = 0.9
          gsap.set(heroSectionRef.current, {
            scale: scale,
            force3D: true,
            transformOrigin: "center center"
          });
        }
      });
    }

    // Анимация заголовка
    if (headingRef.current) {
      // Разбиваем на строки
      const lines = ['РОМАНОВЫ', 'ПРОСТОРЫ'];
      
      headingRef.current.innerHTML = lines.map(line => 
        `<div class="line">${line.split('').map(char => 
          char === ' ' ? '<span>&nbsp;</span>' : `<span>${char}</span>`
        ).join('')}</div>`
      ).join('');

      const letters = headingRef.current.querySelectorAll('span');
      
      // Начальное состояние - все буквы прозрачные
      gsap.set(letters, { opacity: 0 });

      // Анимация появления букв
      gsap.to(letters, {
        opacity: 1,
        duration: 1,
        delay: 0.3,
        ease: "power3.in",
        stagger: 0.05 // 50ms между буквами
      });
    }

    // Анимация подзаголовка
    if (subtitleRef.current) {
      // Разбиваем на строки
      const lines = [
        'Семейная ферма, где уважают землю и заботятся о животных',
        'Чистая вода, натуральные корма и бережный уход, простые правила, из которых рождается вкус'
      ];
      
      // Создаем обертку для текста с анимацией
      subtitleRef.current.innerHTML = `<div class="subtitle-text-wrapper" style="max-width: 64ch; text-align: center; margin: 0 auto;">${lines.map(line => 
        `<div class="subtitle-line">${line.split(' ').map(word => 
          `<span class="word">${word}</span>`
        ).join(' ')}</div>`
      ).join('')}</div>`;

      const subtitleWords = subtitleRef.current.querySelectorAll('.word');
      
      // Начальное состояние - все слова прозрачные
      gsap.set(subtitleWords, { opacity: 0 });

      // Анимация появления слов подзаголовка
      gsap.to(subtitleWords, {
        opacity: 1,
        duration: 1,
        delay: 0.3, // Начинаем одновременно с заголовком
        ease: "power3.in",
        stagger: 0.1 // 100ms между словами
      });
    }

    // Анимация navbar
    if (navbarRef.current) {
      // Начальное состояние - navbar скрыт сверху
      gsap.set(navbarRef.current, {
        opacity: 0,
        y: '-1rem'
      });

      // Анимация появления navbar
      gsap.to(navbarRef.current, {
        opacity: 1,
        y: '0',
        duration: 0.6,
        delay: 2, // Начинаем через 2 секунды
        ease: "power2.out"
      });
    }

    // Анимация заголовков в About секции
    const pageHeadings = document.querySelector('.page-headings.text-align-center');
    if (pageHeadings) {
      // Разделяем текст на слова для анимации
      const textStyleAllcaps = pageHeadings.querySelector('.text-style-allcaps');
      const headingStyleH2 = pageHeadings.querySelector('.heading-style-h2');
      
      if (textStyleAllcaps) {
        const text = textStyleAllcaps.textContent || '';
        textStyleAllcaps.innerHTML = text.split(' ').map(word => `<span class="word">${word}</span>`).join(' ');
      }
      
      if (headingStyleH2) {
        const text = headingStyleH2.textContent || '';
        headingStyleH2.innerHTML = text.split(' ').map(word => `<span class="word">${word}</span>`).join(' ');
      }
      
      // Устанавливаем начальное состояние
      gsap.set(pageHeadings.querySelectorAll('.word'), {
        opacity: 0
      });
      
      // Анимация появления
      ScrollTrigger.create({
        trigger: pageHeadings,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          gsap.to(pageHeadings.querySelectorAll('.word'), {
            opacity: 1,
            duration: 0.25,
            stagger: 0.02,
            ease: "none"
          });
        }
      });
    }

    // Анимация CTA секции
    if (ctaRef.current) {
      // Video scale анимация (отключена на мобильных)
      const ctaVideoBackground = ctaRef.current.querySelector('.cta-video_background');
      if (ctaVideoBackground) {
        // На мобильных устройствах видео сразу нормального размера
        if (window.innerWidth <= 768) {
          gsap.set(ctaVideoBackground, {
            scale: 1,
            force3D: true
          });
        } else {
          // Десктопная анимация
          gsap.set(ctaVideoBackground, {
            scale: 0.5
          });

          // Переменная для плавной интерполяции
          let targetScale = 0.5;
          let currentScale = 0.5;
          
          ScrollTrigger.create({
            trigger: ctaRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
            onUpdate: (self) => {
              // Используем самый мягкий easing
              const easedProgress = gsap.parseEase("power1.inOut")(self.progress);
              targetScale = 0.5 + (0.5 * easedProgress);
            }
          });
          
          // Плавная интерполяция через requestAnimationFrame
          const animateScale = () => {
            const lerpFactor = 0.08;
            currentScale += (targetScale - currentScale) * lerpFactor;
            
            gsap.set(ctaVideoBackground, {
              scale: currentScale,
              force3D: true,
              transformOrigin: "center center",
              willChange: "transform"
            });
            
            requestAnimationFrame(animateScale);
          };
          
          animateScale();
        }
      }

      // SVG анимация (отключена - контент сразу виден)
      const ctaContent = ctaRef.current.querySelector('.cta-content');
      if (ctaContent) {
        gsap.set(ctaContent, {
          opacity: 1,
          y: '0rem'
        });
      }

      // Button анимация (отключена - кнопка сразу видна)
      const buttonWrap = ctaRef.current.querySelector('.button-nav');
      if (buttonWrap) {
        gsap.set(buttonWrap, {
          opacity: 1
        });
      }
    }


    // Анимация заголовков в Features секции
    if (featuresRef.current) {
      const pageHeadings = featuresRef.current.querySelector('.page-headings.text-align-center');
      if (pageHeadings) {
        // Разделяем текст на слова для анимации
        const textStyleAllcaps = pageHeadings.querySelector('.text-style-allcaps');
        const headingStyleH2 = pageHeadings.querySelector('.heading-style-h2');
        
        if (textStyleAllcaps) {
          const text = textStyleAllcaps.textContent || '';
          textStyleAllcaps.innerHTML = text.split(' ').map(word => `<span class="word">${word}</span>`).join(' ');
        }
        
        if (headingStyleH2) {
          const text = headingStyleH2.textContent || '';
          headingStyleH2.innerHTML = text.split(' ').map(word => `<span class="word">${word}</span>`).join(' ');
        }
        
        // Устанавливаем начальное состояние
        gsap.set(pageHeadings.querySelectorAll('.word'), {
          opacity: 0
        });
        
        // Анимация появления
        ScrollTrigger.create({
          trigger: pageHeadings,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => {
            gsap.to(pageHeadings.querySelectorAll('.word'), {
              opacity: 1,
              duration: 0.25,
              stagger: 0.02,
              ease: "none"
            });
          }
        });
      }
    }

    // Анимация заголовков в Location секции
    if (locationRef.current) {
      const pageHeadings = locationRef.current.querySelector('.page-headings.text-align-center');
      if (pageHeadings) {
        // Разделяем текст на слова для анимации
        const textStyleAllcaps = pageHeadings.querySelector('.text-style-allcaps');
        const headingStyleH2 = pageHeadings.querySelector('.heading-style-h2');
        
        if (textStyleAllcaps) {
          const text = textStyleAllcaps.textContent || '';
          textStyleAllcaps.innerHTML = text.split(' ').map(word => `<span class="word">${word}</span>`).join(' ');
        }
        
        if (headingStyleH2) {
          const text = headingStyleH2.textContent || '';
          headingStyleH2.innerHTML = text.split(' ').map(word => `<span class="word">${word}</span>`).join(' ');
        }
        
        // Устанавливаем начальное состояние
        gsap.set(pageHeadings.querySelectorAll('.word'), {
          opacity: 0
        });
        
        // Анимация появления
        ScrollTrigger.create({
          trigger: pageHeadings,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => {
            gsap.to(pageHeadings.querySelectorAll('.word'), {
              opacity: 1,
              duration: 0.25,
              stagger: 0.02,
              ease: "none"
            });
          }
        });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Обновляем ScrollTrigger после изменения DOM
  useEffect(() => {
    // Mobile scroll optimization
    if (window.innerWidth <= 768) {
      ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
      });
    }
    
    ScrollTrigger.refresh();
    
    // Debug: Check if Geologica font is loaded
    if (typeof window !== 'undefined') {
      const testElement = document.createElement('div');
      testElement.style.fontFamily = 'Geologica, sans-serif';
      testElement.textContent = 'Test';
      document.body.appendChild(testElement);
      const computedStyle = window.getComputedStyle(testElement);
      console.log('Geologica font loaded:', computedStyle.fontFamily);
      document.body.removeChild(testElement);
    }
  }, []);

  // Анимация мобильного меню
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        // Показываем меню и анимируем появление справа
        gsap.set(mobileMenuRef.current, {
          display: 'flex',
          x: '100%'
        });
        
        gsap.to(mobileMenuRef.current, {
          x: '0%',
          duration: 0.4,
          ease: "power2.out"
        });
      } else {
        // Анимируем закрытие вправо
        gsap.to(mobileMenuRef.current, {
          x: '100%',
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(mobileMenuRef.current, {
              display: 'none'
            });
          }
        });
      }
    }
  }, [isMobileMenuOpen]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2ECE3' }}>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Перейти к основному содержанию
      </a>
      
      <div className="main-wrapper">
        {/* Navbar */}
        <nav 
          ref={navbarRef}
          className="navbar"
          role="navigation"
          aria-label="Главная навигация"
          style={{
            zIndex: 9999,
            backgroundColor: '#ddd0',
            width: '100%',
            paddingTop: '2.5rem',
            position: 'absolute',
            inset: '0% 0% auto'
          }}
        >
        <div className="padding-global" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
          <div 
            className="container-large"
            style={{
              width: '100%',
              maxWidth: '90vw',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <div 
              className="nav-wrap"
              style={{
                gridColumnGap: '1rem',
                gridRowGap: '1rem',
                gridTemplateRows: 'auto auto',
                gridTemplateColumns: '1fr 1fr',
                gridAutoColumns: '1fr',
                justifyContent: 'space-between',
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <div 
                className="nav_brand"
                style={{
                  flexFlow: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '0.5rem',
                  transition: 'opacity 0.3s',
                  display: 'flex',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src="/logo-R.svg" 
                  alt="Logo" 
                  style={{
                    width: '46px',
                    height: '46px'
                  }}
                />
      </div>

              <div 
                className="nav_button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                role="button"
                aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={isMobileMenuOpen}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }
                }}
                style={{
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  padding: '18px',
                  fontSize: '24px',
                  display: 'block',
                  zIndex: 10001
                } as React.CSSProperties}
              >
                {!isMobileMenuOpen ? (
        <div
          className="burger-icon"
          style={{
            width: '24px',
            height: '2px',
            backgroundColor: '#F2ECE3',
            position: 'relative',
            transition: 'all 0.3s ease',
            borderRadius: '1px'
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '-6px',
              left: '0',
              width: '100%',
              height: '2px',
              backgroundColor: '#F2ECE3',
              transition: 'all 0.3s ease',
              borderRadius: '1px'
            }}
          ></span>
          <span
            style={{
              position: 'absolute',
              top: '6px',
              left: '0',
              width: '100%',
              height: '2px',
              backgroundColor: '#F2ECE3',
              transition: 'all 0.3s ease',
              borderRadius: '1px'
            }}
          ></span>
        </div>
                ) : (
                  <div 
                    className="close-icon"
                    style={{
                      width: '24px',
                      height: '24px',
                      position: 'relative',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '2px',
                        backgroundColor: '#F2ECE3',
                        transform: 'rotate(45deg)',
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '2px',
                          backgroundColor: '#F2ECE3',
                          transform: 'rotate(-90deg)',
                          position: 'absolute',
                          top: '0',
                          left: '0'
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="nav-menu"
                style={{
                  gridColumnGap: '1rem',
                  gridRowGap: '1rem',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  display: 'flex'
                }}
              >
                <div 
                  className="nav-menu_wrap"
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    display: 'flex'
                  }}
                >
                  <div 
                    className="nav-left"
                    style={{
                      gridColumnGap: '1rem',
                      gridRowGap: '1rem',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    <div 
                      className="nav_divider"
                      style={{
                        width: '1px',
                        height: '1px',
                        color: '#F2ECE3'
                      }}
                    ></div>

                    <div 
                      className="nav_link"
                      onClick={() => smoothScrollTo('section_about')}
                      style={{
                        flexFlow: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      <div 
                        className="nav-button_text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '200',
                          color: '#F2ECE3',
                          paddingLeft: '0.5rem',
                          paddingRight: '0.5rem',
                          lineHeight: '1.3',
                          position: 'relative'
                        }}
                      >
                        О нас
                      </div>
                      <div 
                        className="nav-button_text is-absolute"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '200',
                          color: '#F2ECE3',
                          paddingLeft: '0.5rem',
                          paddingRight: '0.5rem',
                          lineHeight: '1.3',
                          position: 'relative'
                        }}
                      >
                        О нас
                      </div>
                    </div>

                    <div 
                      className="nav_link"
                      onClick={() => smoothScrollTo('section_features')}
                      style={{
                        flexFlow: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      <div 
                        className="nav-button_text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '200',
                          color: '#F2ECE3'
                        }}
                      >
                        Наш продукт
                      </div>
                      <div 
                        className="nav-button_text is-absolute"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '200',
                          color: '#F2ECE3'
                        }}
                      >
                        Наш продукт
                      </div>
                    </div>

                    <div 
                      className="nav_link"
                      onClick={() => smoothScrollTo('section_location')}
                      style={{
                        flexFlow: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      <div 
                        className="nav-button_text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '200',
                          color: '#F2ECE3'
                        }}
                      >
                        Наше место
                      </div>
                      <div 
                        className="nav-button_text is-absolute"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '200',
                          color: '#F2ECE3'
                        }}
                      >
                        Наше место
                      </div>
                    </div>

                    <div 
                      className="nav_link"
                      onClick={() => smoothScrollTo('section_partners')}
                      style={{
                        flexFlow: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      <div 
                        className="nav-button_text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '200',
                          color: '#F2ECE3'
                        }}
                      >
                        Партнерам
                      </div>
                      <div 
                        className="nav-button_text is-absolute"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '200',
                          color: '#F2ECE3'
                        }}
                      >
                        Партнерам
                      </div>
                    </div>

      </div>

                  <div 
                    className="button-nav"
                    onClick={() => smoothScrollTo('footer')}
                    style={{
                      gridColumnGap: '0.7rem',
                      gridRowGap: '0.7rem',
                      backgroundColor: '#2D2D2D',
                      color: '#F2ECE3',
                      borderRadius: '0.4rem',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      padding: '0.75rem 1.5rem',
                      display: 'flex',
                      maxWidth: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    <div 
                      className="button-text"
                      style={{
                        fontFamily: 'Geologica, sans-serif',
                        fontSize: '1rem',
                        fontWeight: '200',
                        color: '#F2ECE3',
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem',
                        lineHeight: '1.3',
                        position: 'relative',
                        opacity: 1,
                        transform: 'translateY(0)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 1, 1)'
                      }}
                    >
                      Связаться
                    </div>
                    <div 
                      className="button-text is-absolute"
                      style={{
                        fontFamily: 'Geologica, sans-serif',
                        fontSize: '1rem',
                        fontWeight: '200',
                        color: '#F2ECE3',
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem',
                        lineHeight: '1.3',
                        position: 'absolute',
                        bottom: '-1.2rem',
                        whiteSpace: 'nowrap',
                        opacity: 0,
                        transform: 'translate(-50%, 100%)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 1, 1)'
                      }}
                    >
                      Связаться
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 10000,
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {/* Close button in top right corner */}
        <div
          className="mobile-close-button"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001
          }}
        >
          <div
            style={{
              width: '24px',
              height: '2px',
              backgroundColor: '#F2ECE3',
              transform: 'rotate(45deg)',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: '#F2ECE3',
                transform: 'rotate(-90deg)',
                position: 'absolute',
                top: '0',
                left: '0'
              }}
            ></div>
          </div>
        </div>
        
        <div 
          className="mobile-menu-content"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="mobile-nav-link"
            onClick={() => {
              setIsMobileMenuOpen(false);
              smoothScrollTo('section_about');
            }}
            style={{
              fontFamily: 'Lora, serif',
              color: '#F2ECE3',
              fontSize: '1.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            О нас
          </div>
          <div 
            className="mobile-nav-link"
            onClick={() => {
              setIsMobileMenuOpen(false);
              smoothScrollTo('section_features');
            }}
            style={{
              fontFamily: 'Lora, serif',
              color: '#F2ECE3',
              fontSize: '1.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Наш продукт
          </div>
          <div 
            className="mobile-nav-link"
            onClick={() => {
              setIsMobileMenuOpen(false);
              smoothScrollTo('section_location');
            }}
            style={{
              fontFamily: 'Lora, serif',
              color: '#F2ECE3',
              fontSize: '1.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Наше место
          </div>
          <div 
            className="mobile-nav-link"
            onClick={() => {
              setIsMobileMenuOpen(false);
              smoothScrollTo('section_partners');
            }}
            style={{
              fontFamily: 'Lora, serif',
              color: '#F2ECE3',
              fontSize: '1.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Партнерам
          </div>
          <div 
            className="mobile-nav-link"
            onClick={() => {
              setIsMobileMenuOpen(false);
              smoothScrollTo('footer');
            }}
            style={{
              fontFamily: 'Lora, serif',
              color: '#F2ECE3',
              fontSize: '1.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Связаться
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        id="main-content"
        ref={heroSectionRef}
        className="section hero" 
        style={{ 
          minHeight: '100svh', 
          position: 'relative',
          transform: 'translate3d(0px, 0px, 0px)',
          scale: 1
        }}
      >
        <div className="padding-global" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
          <div 
            className="container-large"
            style={{
              width: '100%',
              maxWidth: '90vw',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <div 
              className="hero-component"
              style={{
                zIndex: 3,
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100svh',
                display: 'flex',
                position: 'relative'
              }}
            >
              <div 
                className="hero_content"
                style={{
                  flexFlow: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <h1 
                  ref={headingRef}
                  className="heading-style-h1"
                  style={{
                    fontSize: '8vw',
                    lineHeight: 1,
                    color: '#F2ECE3',
                    margin: 0
                  }}
                >
                  РОМАНОВЫ ПРОСТОРЫ
                </h1>
                
                <div 
                  ref={subtitleRef}
                  className="hero-subtitle-text"
                  style={{
                    maxWidth: '64ch',
                    fontFamily: 'Geologica, sans-serif',
                    fontSize: '1rem',
                    color: '#F2ECE3',
                    marginTop: '1rem',
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  Чистая вода, натуральные корма и бережный уход — простые правила, из которых рождается вкус
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div 
          className="hero-background" 
          style={{
            zIndex: 1,
            borderRadius: '0.5rem',
            width: '100%',
            height: '100%',
            padding: '1rem',
            position: 'absolute',
            inset: '0%',
            overflow: 'hidden'
          }}
        >
          <div 
            className="background-video"
            style={{
              width: '100%',
              height: '100%',
              zIndex: 2,
              borderRadius: '0.5rem',
              position: 'relative'
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              preload="metadata"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '0.5rem'
              }}
            >
              <source src="/Hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div 
              className="video-overlay"
              style={{
                opacity: 0.46,
                backgroundImage: 'radial-gradient(circle, #17141100 32%, #000000ba)',
                zIndex: 2,
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: '0%',
                borderRadius: '0.5rem'
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="section_about" className="section_about">
        <div className="padding-global" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
          <div 
            className="container-large"
            style={{
              width: '100%',
              maxWidth: '90vw',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <div 
              ref={trackRef}
              className="track"
              style={{
                height: '100vh',
                position: 'relative'
              }}
            >
              <div 
                className="sticky"
                style={{
                  position: 'sticky',
                  top: '0'
                }}
              >
                <div 
                  className="frame"
                  style={{
                    display: 'block'
                  }}
                >
                  <div 
                    className="sticky_element"
                    style={{
                      gridColumnGap: '5rem',
                      gridRowGap: '5rem',
                      flexFlow: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100vh',
                      display: 'flex',
                      position: 'sticky',
                      top: '0'
                    }}
                  >
                    <div 
                      className="page-headings text-align-center"
                      style={{
                        gridColumnGap: '1rem',
                        gridRowGap: '1rem',
                        flexFlow: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxWidth: '100ch',
                        display: 'flex'
                      }}
                    >
                      <h3 
                        className="text-style-allcaps"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '200',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: '#1f2937',
                          margin: 0,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Возвращение к корням
                      </h3>
                      
                      <h2 
                        className="heading-style-h2"
                        style={{
                          fontFamily: 'Geologica, sans-serif !important',
                          fontSize: '1.5rem',
                          fontWeight: '200',
                          lineHeight: 1.4,
                          color: '#1f2937',
                          margin: 0,
                          textAlign: 'center'
                        }}
                      >
                        Мы — семья, которая решила сохранить родовую землю и вдохнуть жизнь в традиции предков. В самом сердце Воронежской области, там, где жили наши бабушки и дедушки, мы создали ферму — и вместе с ней будущее для наших детей.&nbsp;
                        <br /><br />
                        Мы&nbsp;верим: ферма — это не просто хозяйство, а особый образ жизни и ответственность. Это место, где традиции встречаются с современными технологиями, а качество становится главным смыслом.
                      </h2>
                    </div>
                    
                    <div 
                      className="photos-wrap"
                      style={{
                        width: '80vh',
                        height: '45vh',
                        position: 'relative'
                      }}
                    >
                      <div 
                        className="photo-wrap_first"
                        style={{
                          borderRadius: '1rem',
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          inset: '0%',
                          overflow: 'hidden'
                        }}
                      >
                        <img
                          src="/pic1.jpg"
                          alt="Ферма фото 1"
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '1rem'
                          }}
                        />
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="section_features"
        ref={featuresRef}
        className="section_features" 
        style={{
          paddingTop: '8rem',
          paddingBottom: '8rem'
        }}
      >
        <div className="padding-global" style={{
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem'
        }}>
          <div className="container-large" style={{
            width: '100%',
            maxWidth: '80rem',
            margin: '0 auto'
          }}>
            <div className="features-component" style={{
              gridColumnGap: '8rem',
              gridRowGap: '8rem',
              flexFlow: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: '12rem',
              display: 'flex'
            }}>
              {/* 1) Page headings */}
              <div className="page-headings text-align-center" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <h3 
                  className="text-style-allcaps"
                  style={{
                    fontFamily: 'Geologica, sans-serif',
                    fontSize: '1rem',
                    fontWeight: '200',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#1f2937',
                    margin: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Наши продукты
                </h3>
                
                <h2 
                  className="heading-style-h2"
                  style={{
                    fontFamily: 'Geologica, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '200',
                    lineHeight: 1.4,
                    color: '#1f2937',
                    margin: 0,
                    textAlign: 'center'
                  }}
                >
                  Рацион простой и натуральный: никаких заменителей или искусственных стимуляторов. Только чистые корма и вода из собственной скважины.
                </h2>
              </div>

              {/* 2) Features wrap */}
              <div className="features-wrap" style={{
                gridColumnGap: '5rem',
                gridRowGap: '5rem',
                gridTemplateRows: 'auto',
                gridTemplateColumns: '1fr 1fr',
                gridAutoColumns: '1fr',
                alignItems: 'center',
                display: 'grid'
              }}>
                {/* Features image */}
                <div className="features_image" style={{
                  borderRadius: '1rem',
                  width: '40vw',
                  maxWidth: '41rem',
                  height: '37rem',
                  marginLeft: 'auto',
                  overflow: 'hidden'
                }}>
                  <img 
                    src="/features_image1.jpg" 
                    alt="Features image 1" 
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Features content */}
                <div className="features_content" style={{
                  flexFlow: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  display: 'flex'
                }}>
                  {/* Heading */}
                  <h4 className="text-weight-normal text-style-allcaps heading-style-h4" style={{
                    fontFamily: 'Lora, serif',
                    fontSize: '3rem',
                    fontWeight: '200',
                    textTransform: 'uppercase',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Абердин-ангус
                  </h4>
                  
                  {/* Divider image */}
                  <img 
                    src="/divider-img.svg" 
                    alt="Divider"
                    loading="lazy"
                    style={{
                      width: 'auto',
                      height: 'auto',
                      margin: '1rem 0'
                    }}
                  />
                  
                  {/* Text */}
                  <p className="text-size-medium" style={{
                    fontFamily: 'Geologica, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: '200',
                    lineHeight: 1.6,
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Наш скот — породы Абердин Ангус. Летом он пасётся на сочных пастбищных травах, зимой — получает сено и силос. Мы используем минимум ветеринарных препаратов и верим, что вкус мяса начинается именно с питания и заботы о животных. Поэтому каждый стейк — это не просто продукт, а результат кропотливого труда и уважения к природе.
        </p>
      </div>
              </div>

              {/* 3) Features wrap is-middle */}
              <div className="features-wrap is-middle" style={{
                gridColumnGap: '5rem',
                gridRowGap: '5rem',
                gridTemplateRows: 'auto',
                gridTemplateColumns: '1fr 1fr',
                gridAutoColumns: '1fr',
                alignItems: 'center',
                display: 'grid'
              }}>
                {/* Features content - слева */}
                <div className="features_content" style={{
                  flexFlow: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  display: 'flex'
                }}>
                  {/* Heading */}
                  <h4 className="text-weight-normal text-style-allcaps heading-style-h4" style={{
                    fontFamily: 'Lora, serif',
                    fontSize: '3rem',
                    fontWeight: '200',
                    textTransform: 'uppercase',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Овцы-Дропер 
                  </h4>
                  
                  {/* Divider image */}
                  <img 
                    src="/divider-img.svg" 
                    alt="Divider"
                    loading="lazy"
                    style={{
                      width: 'auto',
                      height: 'auto',
                      margin: '1rem 0'
                    }}
                  />
                  
                  {/* Text */}
                  <p className="text-size-medium" style={{
                    fontFamily: 'Geologica, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: '200',
                    lineHeight: 1.6,
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Наши овцы круглый год проводят время на чистых лугах, питаясь свежими травами и злаками. Зимой их рацион дополняют качественное сено и зерновые корма. Мы заботимся о здоровье стада, используем только необходимый минимум ветеринарных препаратов и следим за естественными условиями содержания. Благодаря такому подходу мясо и шерсть овец получаются нежными, ароматными и по-настоящему натуральными — результат уважения к природе и кропотливой работы.
                  </p>
                </div>

                {/* Features image - справа */}
                <div className="features_image" style={{
                  borderRadius: '1rem',
                  width: '40vw',
                  maxWidth: '41rem',
                  height: '37rem',
                  marginLeft: 'auto',
                  overflow: 'hidden'
                }}>
                  <img 
                    src="/features_image2.jpg" 
                    alt="Features image 2"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>

              {/* 4) Features wrap */}
              <div className="features-wrap" style={{
                gridColumnGap: '5rem',
                gridRowGap: '5rem',
                gridTemplateRows: 'auto',
                gridTemplateColumns: '1fr 1fr',
                gridAutoColumns: '1fr',
                alignItems: 'center',
                display: 'grid'
              }}>
                {/* Features image */}
                <div className="features_image" style={{
                  borderRadius: '1rem',
                  width: '40vw',
                  maxWidth: '41rem',
                  height: '37rem',
                  marginLeft: 'auto',
                  overflow: 'hidden'
                }}>
                  <img 
                    src="/features_image3.jpg" 
                    alt="Features image 3"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Features content */}
                <div className="features_content" style={{
                  flexFlow: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  display: 'flex'
                }}>
                  {/* Heading */}
                  <h4 className="text-weight-normal text-style-allcaps heading-style-h4" style={{
                    fontFamily: 'Lora, serif',
                    fontSize: '3rem',
                    fontWeight: '200',
                    textTransform: 'uppercase',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Птица
                  </h4>
                  
                  {/* Divider image */}
                  <img 
                    src="/divider-img.svg" 
                    alt="Divider"
                    loading="lazy"
                    style={{
                      width: 'auto',
                      height: 'auto',
                      margin: '1rem 0'
                    }}
                  />
                  
                  {/* Text */}
                  <p className="text-size-medium" style={{
                    fontFamily: 'Geologica, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: '200',
                    lineHeight: 1.6,
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Наша птица растёт на свободном выгуле, дышит свежим воздухом и получает сбалансированное натуральное питание без лишних добавок. Мы создаём для неё условия, максимально близкие к естественным, чтобы каждая курица чувствовала себя спокойно и свободно. Такой уход делает мясо особенно сочным и вкусным, а каждое яйцо — питательным и насыщенным природной пользой.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA Section */}
      <section className="section_cta">
        <div className="track-cta" ref={ctaRef} style={{
          width: '100%',
          height: window.innerWidth <= 768 ? '100vh' : '300vh',
          position: 'relative'
        }}>
          <div className="sticky-cta" style={{
            height: '100vh',
            display: 'flex',
            position: 'sticky',
            top: '0'
          }}>
            <div className="cta-video_background" style={{
              backgroundColor: '#F2ECE3',
              borderRadius: '3rem',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              display: 'flex',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="cta-content" style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2
              }}>
                <div className="cta-logo-wrap" style={{ width: '50vw', marginBottom: '2rem' }}>
                  <img 
                    src="/Horizontal logo__beige.svg" 
                    alt="Romanovy Prostory Logo"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: 'auto',
                      filter: 'brightness(0) saturate(100%) invert(96%) sepia(4%) saturate(1020%) hue-rotate(315deg) brightness(95%) contrast(92%)'
                    }}
                  />
                </div>
                <div 
                  className="button-nav"
                  onClick={() => smoothScrollTo('footer')}
                  style={{
                    gridColumnGap: '0.7rem',
                    gridRowGap: '0.7rem',
                    backgroundColor: '#2D2D2D',
                    color: '#F2ECE3',
                    borderRadius: '0.4rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '0.75rem 1.5rem',
                    display: 'flex',
                    maxWidth: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  <div 
                    className="button-text"
                    style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: '1rem',
                      fontWeight: '200',
                      color: '#F2ECE3',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      lineHeight: '1.3',
                      position: 'relative',
                      opacity: 1,
                      transform: 'translateY(0)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 1, 1)'
                    }}
                  >
                    Связаться
                  </div>
                  <div 
                    className="button-text is-absolute"
                    style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: '1rem',
                      fontWeight: '200',
                      color: '#F2ECE3',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      lineHeight: '1.3',
                      position: 'absolute',
                      bottom: '-1.2rem',
                      whiteSpace: 'nowrap',
                      opacity: 0,
                      transform: 'translate(-50%, 100%)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 1, 1)'
                    }}
                  >
                    Связаться
                  </div>
                </div>
              </div>
              
              <div className="background-video absolute" style={{
                zIndex: 1,
                position: 'absolute',
                inset: '0%',
                borderRadius: '0',
                width: '100%',
                height: '100%'
              }}>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  preload="metadata"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '0'
                  }}
                >
                  <source src="/CTA-video.mp4" type="video/mp4" />
                </video>
                
                <div className="video-overlay" style={{
                  opacity: 0.46,
                  backgroundImage: 'radial-gradient(circle, #17141100 32%, #000000ba)',
                  zIndex: 2,
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  inset: '0%',
                  borderRadius: '0'
                }}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="section_location" ref={locationRef} className="section_location">
        <div className="padding-global" style={{
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem'
        }}>
          <div className="container-medium" style={{
            width: '100%',
            maxWidth: '90rem',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div className="location-wrap" style={{
              gap: '4rem',
              flexFlow: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginBottom: '5rem',
              paddingTop: '12rem',
              paddingBottom: '6rem',
              display: 'flex'
            }}>
              {/* 1) Page headings */}
              <div className="page-headings text-align-center is-location" style={{
                gap: '1rem',
                flexFlow: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '100ch',
                display: 'flex'
              }}>
                {/* 1) Text style allcaps */}
                <h3 className="text-style-allcaps" style={{
                  fontFamily: 'Geologica, sans-serif',
                  fontSize: '1rem',
                  fontWeight: '200',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#1f2937',
                  margin: 0
                }}>
                  НАШЕ МЕСТО
                </h3>
                
                {/* 2) Max width medium */}
                <div className="max-width-medium" style={{
                  width: '100%',
                  maxWidth: '72ch'
                }}>
                  <h2 className="heading-style-h2" style={{
                    fontFamily: 'Geologica, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '200',
                    lineHeight: 1.4,
                    color: '#1f2937',
                    margin: 0,
                    textAlign: 'center'
                  }}>
                    Родная земля — источник силы и вдохновения<br />
                    Наша ферма находится в Воронежской области, в Лискинском районе, селе Аношкино. Это земля наших предков, которая хранит память поколений.
                  </h2>
                </div>
              </div>
              
              {/* Location grid */}
              <div className="location_grid" style={{
                gap: '1rem',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr',
                width: '100%',
                display: 'grid'
              }}>
                {/* 1) Location card left */}
                <a 
                  href="https://incrussia.ru/share/uvelichit-vyruchku-agrokompanii/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="location_card is-left" 
                  style={{
                    gap: '0.5rem',
                    color: 'var(--text-color--text-secondary)',
                    borderRadius: '0.5rem',
                    flexFlow: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    minHeight: '70vh',
                    padding: '2rem 8rem 2rem 2rem',
                    display: 'flex',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundImage: 'url(/location-card-left.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {/* Background overlay for better text readability */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1
                  }}></div>
                  
                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    {/* 1) Location icon */}
                    <div className="location_icon" style={{
                      width: '2rem',
                      height: '2rem',
                      marginBottom: '1rem'
                    }}>
                      <img 
                        src="/logo-R.svg" 
                        alt="Logo" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          filter: 'brightness(0) invert(1)'
                        }}
                      />
                    </div>
                    
                    {/* 2) Heading style h2 */}
                    <h2 className="heading-style-h2 text-style-allcaps font-lora" style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      lineHeight: 1.3,
                      textTransform: 'uppercase',
                      margin: 0,
                      marginBottom: '1rem'
                    }}>
                      Как увеличить выручку агрокомпании в 4 раза: советы от владелицы эко-фермы
                    </h2>
                    
                    {/* 3) Small text */}
                    <p className="small-text" style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: '1rem',
                      fontWeight: '200',
                      lineHeight: 1.5,
                      color: '#F2ECE3',
                      margin: 0
                    }}>
                      Сократить расходы, удвоить выручку и выйти из зависимости от посредников — не теория, а реальные цели, которых можно достичь, если действовать правильно. Разбираю пять рабочих стратегий, которые помогали мне и моим клиентам из агросектора даже в кризис. Бонус: их можно адаптировать под любой бизнес.
                    </p>
                  </div>
                </a>
                
                {/* 2) Location card right */}
                <a 
                  href="https://станьбрендом.рф/pr-instrumenty-dlya-ekologichnoj-fermy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="location_card is-right" 
                  style={{
                    gap: '0.5rem',
                    color: 'var(--text-color--text-secondary)',
                    borderRadius: '0.5rem',
                    flexFlow: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    minHeight: '70vh',
                    padding: '2rem 8rem 2rem 2rem',
                    display: 'flex',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundImage: 'url(/location-card-right.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {/* Background overlay for better text readability */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1
                  }}></div>
                  
                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    {/* 1) Location icon */}
                    <div className="location_icon" style={{
                      width: '2rem',
                      height: '2rem',
                      marginBottom: '1rem'
                    }}>
                      <img 
                        src="/logo-R.svg" 
                        alt="Logo" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          filter: 'brightness(0) invert(1)'
                        }}
                      />
      </div>
                    
                    {/* 2) Heading style h2 */}
                    <h2 className="heading-style-h2 text-style-allcaps font-lora" style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      lineHeight: 1.3,
                      textTransform: 'uppercase',
                      margin: 0,
                      marginBottom: '1rem'
                    }}>
                      PR-инструменты для экологичной фермы: как привлечь внимание без агрессивной рекламы
                    </h2>
                    
                    {/* 3) Small text */}
                    <p className="small-text" style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: '1rem',
                      fontWeight: '200',
                      lineHeight: 1.5,
                      color: '#F2ECE3',
                      margin: 0
                    }}>
                      Как рассказать о ферме, если не хочется кричать «Купи!» и тратить сотни тысяч на рекламу? Этот вопрос встает перед каждым, кто делает ставку на экологичный продукт.
        </p>
      </div>
        </a>
      </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section_partners" className="section_partners">
        <div className="padding-global" style={{
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem'
        }}>
          <div className="container-medium" style={{
            width: '100%',
            maxWidth: '90rem',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div className="partner-wrap" style={{
              gap: '4rem',
              flexFlow: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginBottom: '5rem',
              paddingTop: '12rem',
              paddingBottom: '6rem',
              display: 'flex'
            }}>
              <div className="page-headings text-align-center is-location" style={{
                gap: '1rem',
                flexFlow: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '100ch',
                display: 'flex'
              }}>
                <h3 className="text-style-allcaps" style={{
                  fontFamily: 'Geologica, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 300,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#1f2937',
                  margin: 0
                }}>
                  ПАРТНЕРАМ
                </h3>

                <div className="max-width-medium" style={{
                  width: '100%',
                  maxWidth: '72ch'
                }}>
                  <h2 className="heading-style-h2" style={{
                    fontFamily: 'Geologica, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 200,
                    lineHeight: 1.4,
                    color: '#1f2937',
                    margin: 0,
                    textAlign: 'center'
                  }}>
                    Мы открыты к партнёрству с теми, кто разделяет наш подход,<br />
                    ценит прозрачность происхождения продукта и его качество,<br />
                    поддерживает локальных производителей и семейные фермы.<br />
                    С нами ваши гости и покупатели будут точно знать, откуда пришёл продукт, и в каких условиях он создан.<br />
                    
                  </h2>
                </div>
              </div>

              {/* Partners features wrap */}
              <div className="features-wrap" style={{
                gridColumnGap: '5rem',
                gridRowGap: '5rem',
                gridTemplateRows: 'auto',
                gridTemplateColumns: '1fr 1fr',
                gridAutoColumns: '1fr',
                alignItems: 'center',
                display: 'grid'
              }}>
                {/* Features image */}
                <div className="features_image" style={{
                  borderRadius: '1rem',
                  width: '40vw',
                  maxWidth: '41rem',
                  height: '37rem',
                  marginLeft: 'auto',
                  overflow: 'hidden'
                }}>
                  <img 
                    src="/partner-img.jpg" 
                    alt="Partner image"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Features content */}
                <div className="features_content" style={{
                  gap: '1.3rem',
                  flexFlow: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  display: 'flex'
                }}>
                  {/* Heading */}
                  <h4 className="text-weight-normal text-style-allcaps heading-style-h4" style={{
                    fontFamily: 'Lora, serif',
                    fontSize: '3rem',
                    fontWeight: '200',
                    textTransform: 'uppercase',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Мы предлагаем
                  </h4>
                  
                  {/* Divider image */}
                  <img 
                    src="/divider-img.svg" 
                    alt="Divider"
                    loading="lazy"
                    style={{
                      width: 'auto',
                      height: 'auto',
                      margin: '1rem 0'
                    }}
                  />
                  
                  {/* Text */}
                  <p className="text-size-medium" style={{
                    fontFamily: 'Geologica, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: '200',
                    lineHeight: 1.6,
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Мы предлагаем:<br />
                    гибкие условия поставки (цены, объёмы, тестовые партии);<br />
                    индивидуальные решения для ресторанов и магазинов;<br />
                    гарантию: за каждое поставленное мясо мы отвечаем лично.<br />
                    Сотрудничая с нами, вы получаете не просто продукт, а надёжного партнёра, который дорожит вашим доверием.
                  </p>

                  {/* Button */}
                  <div 
                    className="button-nav"
                    onClick={() => smoothScrollTo('footer')}
                    style={{
                      gridColumnGap: '0.7rem',
                      gridRowGap: '0.7rem',
                      backgroundColor: '#2D2D2D',
                      color: '#F2ECE3',
                      borderRadius: '0.4rem',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      padding: '0.75rem 1.5rem',
                      display: 'flex',
                      maxWidth: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      marginTop: '1rem'
                    }}
                  >
                    <div 
                      className="button-text"
                      style={{
                        fontFamily: 'Geologica, sans-serif',
                        fontSize: '1rem',
                        fontWeight: '200',
                        color: '#F2ECE3',
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem',
                        lineHeight: '1.3',
                        position: 'relative',
                        opacity: 1,
                        transform: 'translateY(0)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 1, 1)'
                      }}
                    >
                      Связаться
      </div>
                    <div 
                      className="button-text is-absolute"
                      style={{
                        fontFamily: 'Geologica, sans-serif',
                        fontSize: '1rem',
                        fontWeight: '200',
                        color: '#F2ECE3',
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem',
                        lineHeight: '1.3',
                        position: 'absolute',
                        bottom: '-1.2rem',
                        whiteSpace: 'nowrap',
                        opacity: 0,
                        transform: 'translate(-50%, 100%)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 1, 1)'
                      }}
                    >
                      Связаться
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Last CTA Section */}
      <section className="section_last-cta">
        <div className="cta_background" style={{
          backgroundColor: 'var(--background-color--background-secondary)',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          display: 'flex',
          position: 'relative'
        }}>
          {/* CTA Content */}
          <div className="cta_content" style={{
            zIndex: 4,
            gridColumnGap: '1rem',
            gridRowGap: '1rem',
            textAlign: 'center',
            flexFlow: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            position: 'relative'
          }}>
            {/* 1) Logo */}
            <div style={{
              width: '4rem',
              height: '4rem',
              marginBottom: '2rem'
            }}>
              <img 
                src="/logo-R.svg" 
                alt="Logo" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>

            {/* 2) Heading */}
            <h2 className="heading-style-h2 text-style-allcaps font-lora" style={{
              fontSize: '2.5rem',
              fontWeight: '200',
              lineHeight: 1.3,
              textTransform: 'uppercase',
              color: '#F2ECE3',
              margin: 0,
              marginBottom: '2rem'
            }}>
              Наши ценности
            </h2>

            {/* 3) Small text */}
            <p className="small-text" style={{
              fontFamily: 'Geologica, sans-serif',
              fontSize: '1rem',
              fontWeight: '200',
              lineHeight: 1.5,
              color: 'rgb(242, 236, 227)',
              margin: 0,
              maxWidth: '60ch'
            }}>
              Мы хотим, чтобы наши дети жили в мире, где еда означает здоровье, честность и уважение к природе и людям. И чтобы вы знали: на вашем столе — мясо, выращенное в согласии с землёй и традициями.
            </p>
          </div>

          {/* Video Overlay */}
          <div className="video-overlay" style={{
            zIndex: 2,
            backgroundImage: 'radial-gradient(circle, #17141100 20%, #000000ba)',
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: '0%'
          }}></div>

          {/* Background Video */}
          <div className="background-video-last" style={{
            zIndex: 1,
            position: 'absolute',
            inset: '0%'
          }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              preload="metadata"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '0.5rem'
              }}
            >
              <source src="/last-cta-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="footer">
        <div 
          className="padding-global" 
          style={{
            paddingLeft: '2.5rem',
            paddingRight: '2.5rem'
          }}
        >
          <div className="footer-wrap">
            <div className="container-large">
              <div className="footer_component">
                <div className="footer_left">
                  <h3 className="heading-style-h3 is-small">
                    Мы хотим сохранять и развивать деревню, уважать землю, передавать опыт предков и кормить людей продуктом, которому можно доверять.
                  </h3>
                  <div className="credits">
                    <div className="text-size-regular">
                      Romanovy Prostory ©
                    </div>
                    <div className="text-size-regular">
                      2025
                    </div>
                  </div>
                </div>
                <div className="footer_right">
                  <div className="footer_right-wrap">
                    <div className="text-style-allcaps text-size-small">
                      АДРЕС
                    </div>
                    <div className="text-size-large">
                      Воронежская область,<br />
                      Лискинский район,<br />
                      село Аношкино, Россия
                    </div>
                  </div>
                  <div className="footer_right-wrap">
                    <div className="text-style-allcaps text-size-small">
                      КОНТАКТЫ
                    </div>
                    <div className="text-size-large">
                      +79611877007<br />
                      +79011939905
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;