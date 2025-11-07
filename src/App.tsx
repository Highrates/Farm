import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function App() {
  const navbarRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const aboutSignatureRef = useRef<HTMLDivElement>(null);
  const heroCardsRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Проверка размера экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Функция плавного скролла
  const smoothScrollTo = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const targetPosition = section.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1500; // 1.5 секунды
      let start: number | null = null;
      let animationId: number | null = null;
      let isScrolling = true;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      // Прерываем анимацию при попытке пользователя скроллить
      const cancelScroll = () => {
        isScrolling = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        window.removeEventListener('wheel', cancelScroll);
        window.removeEventListener('touchmove', cancelScroll);
      };

      window.addEventListener('wheel', cancelScroll, { passive: true });
      window.addEventListener('touchmove', cancelScroll, { passive: true });

      const animation = (currentTime: number) => {
        if (!isScrolling) return;
        
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration && isScrolling) {
          animationId = requestAnimationFrame(animation);
        } else {
          window.removeEventListener('wheel', cancelScroll);
          window.removeEventListener('touchmove', cancelScroll);
        }
      };

      animationId = requestAnimationFrame(animation);
    }
    // Закрываем мобильное меню если открыто
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

    // Анимация navbar
  useEffect(() => {
    if (navbarRef.current) {
      gsap.set(navbarRef.current, {
        opacity: 0,
        y: '-1rem'
      });

      gsap.to(navbarRef.current, {
        opacity: 1,
        y: '0',
        duration: 0.6,
        delay: 0.5,
        ease: "power2.out"
      });
    }
  }, []);

  // Анимация мобильного меню
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
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


  // Анимация заголовка героя
  useEffect(() => {
    if (heroTitleRef.current) {
      const letters = heroTitleRef.current.querySelectorAll('.letter');
      
      gsap.set(letters, {
        opacity: 0,
        y: 20
      });

      gsap.to(letters, {
                  opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.03,
        delay: 1,
        ease: "power2.out"
      });
    }
  }, []);

  // Анимация подписи
  useEffect(() => {
    if (signatureRef.current) {
      const letters = signatureRef.current.querySelectorAll('.letter');
      
      gsap.set(letters, {
        opacity: 0,
        y: 20
      });

      gsap.to(letters, {
                    opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.03,
        delay: 1.5,
        ease: "power2.out"
      });
    }
  }, []);

  // Анимация подписи в About секции при скролле
  useEffect(() => {
    if (aboutSignatureRef.current) {
      const letters = aboutSignatureRef.current.querySelectorAll('.letter');
      
      gsap.set(letters, {
        opacity: 0,
        y: 20
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(letters, {
                    opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.03,
                ease: "power2.out"
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(aboutSignatureRef.current);

      return () => observer.disconnect();
    }
  }, []);

  // Анимация карточек в grid на мобильной версии
  useEffect(() => {
    if (heroCardsRef.current && isMobile) {
      const cards = heroCardsRef.current.querySelectorAll('.hero-card');
      
      gsap.set(cards, {
        opacity: 0,
        y: 30
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out"
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(heroCardsRef.current);

      return () => observer.disconnect();
    }
  }, [isMobile]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="main-wrapper">
        {/* Navbar */}
        <nav 
          ref={navbarRef}
          className="navbar"
          role="navigation"
          aria-label="Главная навигация"
          style={{
            zIndex: 10000,
            backgroundColor: 'transparent',
            width: '100%',
            paddingTop: isMobile ? '0.5rem' : '2.5rem',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
        <div className="padding-global">
          <div className="container-large">
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
                    src="/Logo.svg" 
                  alt="Logo" 
                  style={{
                      width: isMobile ? '100%' : '192px',
                      height: isMobile ? '48px' : '70px',
                      objectFit: 'contain',
                      filter: isMobileMenuOpen ? 'brightness(0) invert(1)' : 'none',
                      transition: isMobileMenuOpen 
                        ? 'filter 0.3s ease 0.3s' 
                        : 'filter 0.3s ease 0s'
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
                        backgroundColor: 'var(--color-black)',
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
                          backgroundColor: 'var(--color-black)',
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
                          backgroundColor: 'var(--color-black)',
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
                        backgroundColor: isMobileMenuOpen ? 'var(--color-bg)' : 'var(--color-black)',
                        transform: 'rotate(45deg)',
                        position: 'relative',
                        transition: isMobileMenuOpen 
                          ? 'background-color 0.3s ease 0.3s' 
                          : 'background-color 0.3s ease 0s'
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '2px',
                          backgroundColor: isMobileMenuOpen ? 'var(--color-bg)' : 'var(--color-black)',
                          transform: 'rotate(-90deg)',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          transition: isMobileMenuOpen 
                            ? 'background-color 0.3s ease 0.3s' 
                            : 'background-color 0.3s ease 0s'
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
                    justifyContent: 'flex-end',
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <div 
                  className="nav-menu_wrap"
                  style={{
                      justifyContent: 'flex-end',
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <div 
                    className="nav-left"
                    style={{
                      gap: '1rem',
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
                        color: 'var(--color-bg)'
                      }}
                    ></div>

                    <div 
                      className="nav_link"
                      onClick={() => smoothScrollTo('about-section')}
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
                        className="nav-button_text small-text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          color: 'var(--color-black)'
                        }}
                      >
                        О нас
                      </div>
                      <div 
                        className="nav-button_text is-absolute small-text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          color: 'var(--color-black)'
                        }}
                      >
                        О нас
                      </div>
                    </div>

                    <div 
                      className="nav_link"
                      onClick={() => smoothScrollTo('products')}
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
                        className="nav-button_text small-text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          color: 'var(--color-black)'
                        }}
                      >
                        Наш продукт
                      </div>
                      <div 
                        className="nav-button_text is-absolute small-text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          color: 'var(--color-black)'
                        }}
                      >
                        Наш продукт
                      </div>
                    </div>

                    <div 
                      className="nav_link"
                      onClick={() => smoothScrollTo('section-place')}
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
                        className="nav-button_text small-text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          color: 'var(--color-black)'
                        }}
                      >
                        Наше место
                      </div>
                      <div 
                        className="nav-button_text is-absolute small-text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          color: 'var(--color-black)'
                        }}
                      >
                        Наше место
                      </div>
                    </div>

                    <div 
                      className="nav_link"
                      onClick={() => smoothScrollTo('partners-section')}
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
                        className="nav-button_text small-text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          color: 'var(--color-black)'
                        }}
                      >
                        Партнерам
                      </div>
                      <div 
                        className="nav-button_text is-absolute small-text"
                        style={{
                          fontFamily: 'Geologica, sans-serif',
                          fontSize: '1rem',
                          color: 'var(--color-black)'
                        }}
                      >
                        Партнерам
                      </div>
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
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(38, 45, 38, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 9999,
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '120px',
          overflow: 'hidden'
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
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
            onClick={() => smoothScrollTo('about-section')}
            style={{
              fontFamily: 'Lora, serif',
              color: 'var(--color-bg)',
              fontSize: '2rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            О нас
          </div>
          <div 
            className="mobile-nav-link"
            onClick={() => smoothScrollTo('products')}
            style={{
              fontFamily: 'Lora, serif',
              color: 'var(--color-bg)',
              fontSize: '2rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Наш продукт
          </div>
          <div 
            className="mobile-nav-link"
            onClick={() => smoothScrollTo('section-place')}
            style={{
              fontFamily: 'Lora, serif',
              color: 'var(--color-bg)',
              fontSize: '2rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Наше место
          </div>
          <div 
            className="mobile-nav-link"
            onClick={() => smoothScrollTo('partners-section')}
            style={{
              fontFamily: 'Lora, serif',
              color: 'var(--color-bg)',
              fontSize: '2rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Партнерам
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section 
          className="hero"
        style={{ 
            backgroundImage: 'url(/hero-img.png)',
            backgroundPosition: '50% 100%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh'
          }}
        >
          <div className="padding-global">
            <div className="container-large">
              {/* Hero Content - Flex Container */}
              <div
                style={{
                  flexFlow: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: isMobile ? '70vh' : '100vh',
                  display: 'flex'
                }}
              >
                <h1 
                  ref={heroTitleRef}
            style={{
              fontFamily: 'Lora, serif',
                    fontSize: isMobile ? '9vw' : '6vw',
                    lineHeight: '100%',
              fontWeight: '500',
                    color: 'var(--color-black)',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  {['Ферма, которой', 'можно доверять'].map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line.split('').map((char, charIndex) => (
                        <span 
                          key={`${lineIndex}-${charIndex}`}
                          className="letter"
                          style={{ display: 'inline-block' }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                      {lineIndex === 0 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
                <div 
                  ref={signatureRef}
                  className="text-signature"
                  style={{
                    marginLeft: !isMobile ? '400px' : undefined,
                    fontSize: !isMobile ? '4vw' : undefined
                  }}
                >
                  {'Мы храним традиции'.split('').map((char, index) => (
                    <span 
                      key={index}
                      className="letter"
                      style={{ display: 'inline-block' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
        </div>
      </div>

              {/* Grid Container */}
        <div 
            id="products"
            className="products"
            ref={heroCardsRef}
        style={{ 
                  gap: '2rem',
                  gridTemplateRows: 'auto',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                gridAutoColumns: '1fr',
                  alignItems: 'stretch',
                  paddingBottom: isMobile ? '120px' : '400px',
                display: 'grid'
                }}
              >
                {/* Grid Item 1 */}
                <div 
                  className="hero-card"
            style={{
                    minHeight: '440px',
                    padding: '2.5rem 2rem',
                      position: 'relative',
                    backgroundColor: 'rgba(228, 228, 228, 0.1)',
                    borderRadius: '1rem',
                    backdropFilter: 'blur(16px)',
                display: 'flex',
                    flexDirection: 'column',
                  alignItems: 'center',
                    textAlign: 'center'
                }}
              >
                <h3 
              style={{
                      fontFamily: 'Lora, serif',
                      fontSize: isMobile ? '1.85rem' : '2rem',
                      color: 'var(--color-black)',
                      margin: 0
                    }}
                  >
                    Абердин-Ангус
                </h3>
                <div
                    className="catalog-description"
              style={{
                      paddingTop: '2.5rem'
                    }}
                  >
                    <p 
                      className="text-medium"
                style={{
                        fontFamily: 'Geologica, sans-serif',
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        fontWeight: '300',
                        color: 'var(--color-black)',
                        lineHeight: '1.5',
                        margin: 0
                      }}
                    >
                      Мраморная порода, которую ценят за структуру, сочный и{'\u00A0'}нежный вкус.
                      <br /><br />
                      Мы{'\u00A0'}окружаем наших коров и{'\u00A0'}бычков любовью и{'\u00A0'}заботой. Они свободно пасутся на{'\u00A0'}пастбищах, получают простой и{'\u00A0'}натуральный рацион без заменителей и{'\u00A0'}искусственных стимуляторов.
                    </p>
          </div>
        </div>

                {/* Grid Item 2 */}
          <div 
                  className="hero-card"
                style={{
                    height: '100%',
                    minHeight: '420px',
                    padding: '2.5rem 2rem',
                    position: 'relative',
                    backgroundColor: 'rgba(210, 210, 210, 0.1)',
                    borderRadius: '1rem',
                    backdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                  alignItems: 'center',
                textAlign: 'center'
                }}
              >
                <h3 
                  style={{
                    fontFamily: 'Lora, serif',
                      fontSize: isMobile ? '1.85rem' : '2rem',
                      color: 'var(--color-black)',
                    margin: 0
                  }}
                >
                    Овцы-Дропер
                </h3>
                <div 
                    className="catalog-description"
                  style={{
                      paddingTop: '2.5rem'
                    }}
                  >
                    <p 
                      className="text-medium"
                  style={{
                    fontFamily: 'Geologica, sans-serif',
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        fontWeight: '300',
                        color: 'var(--color-black)',
                        lineHeight: '1.5',
                    margin: 0
                      }}
                    >
                      Наши овцы круглый год проводят время на{'\u00A0'}чистых лугах, питаясь свежими травами и{'\u00A0'}злаками. Зимой их{'\u00A0'}рацион дополняют качественное сено и{'\u00A0'}зерновые корма. Мы{'\u00A0'}заботимся о{'\u00A0'}здоровье стада, используем только необходимый минимум ветеринарных препаратов и{'\u00A0'}следим за{'\u00A0'}естественными условиями содержания. Благодаря такому подходу мясо и{'\u00A0'}шерсть овец получаются нежными, ароматными и{'\u00A0'}по-настоящему натуральными{'\u00A0'}—{'\u00A0'}результат уважения к{'\u00A0'}природе и{'\u00A0'}кропотливой работы.
                  </p>
          </div>
        </div>
        
                {/* Grid Item 3 */}
        <div 
                  className="hero-card"
          style={{
            height: '100%',
                    minHeight: '440px',
                    padding: '2.5rem 2rem',
                      position: 'relative',
                    backgroundColor: 'rgba(210, 210, 210, 0.1)',
                    borderRadius: '1rem',
                    backdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <h3 
            style={{
                    fontFamily: 'Lora, serif',
                      fontSize: isMobile ? '1.85rem' : '2rem',
                      color: 'var(--color-black)',
                    margin: 0
                    }}
                  >
                    Птица
                  </h3>
                  <div 
                    className="catalog-description"
              style={{
                      paddingTop: '2.5rem'
                    }}
                  >
                    <p 
                      className="text-medium"
              style={{
                    fontFamily: 'Geologica, sans-serif',
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        fontWeight: '300',
                        color: 'var(--color-black)',
                        lineHeight: '1.5',
                    margin: 0
                      }}
                    >
                      Наша птица растёт на{'\u00A0'}свободном выгуле, дышит свежим воздухом и{'\u00A0'}получает сбалансированное натуральное питание без лишних добавок. Мы{'\u00A0'}создаём для неё условия, максимально близкие к{'\u00A0'}естественным, чтобы каждая курица чувствовала себя спокойно и{'\u00A0'}свободно. Такой уход делает мясо особенно сочным и{'\u00A0'}вкусным, а{'\u00A0'}каждое яйцо{'\u00A0'}—{'\u00A0'}питательным и{'\u00A0'}насыщенным природной пользой.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about-section"
        className="about-section"
            style={{
          backgroundColor: 'var(--color-dark-green)'
            }}
          >
        <div className="padding-global">
          <div className="container-medium"
              style={{
              width: isMobile ? '90vw' : '75vw',
              marginLeft: 'auto',
              marginRight: 'auto'
              }}
            >
              <div 
              className="about-content"
                style={{
                gridColumnGap: '2rem',
                gridRowGap: '2rem',
                  flexFlow: 'column',
                  alignItems: 'center',
                paddingTop: isMobile ? '100px' : '180px',
                paddingBottom: isMobile ? '100px' : '180px',
                paddingRight: 0,
                  display: 'flex'
                }}
              >
              <p 
                className="large-text"
                  style={{
                    fontFamily: 'Lora, serif',
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                  color: 'var(--color-bg)',
                  lineHeight: '1.5',
                  textAlign: isMobile ? 'center' : 'left',
                  margin: 0
                }}
              >
                Мы{'\u00A0'}— семья, которая решила сохранить родовую землю и{'\u00A0'}вдохнуть жизнь в{'\u00A0'}традиции предков. В{'\u00A0'}самом сердце Воронежской области, там, где жили наши бабушки и{'\u00A0'}дедушки, мы{'\u00A0'}создали ферму{'\u00A0'}— и{'\u00A0'}вместе с{'\u00A0'}ней будущее для наших детей. Здесь каждое животное{'\u00A0'}— часть большой истории, а{'\u00A0'}каждый день наполнен трудом, любовью и{'\u00A0'}вниманием к{'\u00A0'}природе. Мы{'\u00A0'}верим: ферма{'\u00A0'}— это не{'\u00A0'}просто хозяйство, а{'\u00A0'}особый образ жизни и{'\u00A0'}ответственность. Это место, где традиции встречаются с{'\u00A0'}современными технологиями, а{'\u00A0'}качество становится главным смыслом.
              </p>

              <div 
                ref={aboutSignatureRef}
                className="text-signature"
                  style={{
                  color: 'rgb(181, 154, 127)',
                  fontSize: isMobile ? '2rem' : '3vw',
                  marginTop: '2rem'
                }}
              >
                {'Ферма, которой можно доверять'.split('').map((char, index) => (
                  <span 
                    key={index}
                    className="letter"
                    style={{ display: 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
              
              <div 
                style={{
                  marginTop: '-100px',
                  marginRight: isMobile ? '-200px' : '-400px',
                  opacity: 0.2,
                    display: 'flex',
                  justifyContent: 'center'
                  }}
                >
                  <img
                        src="/logo-R.svg" 
                        alt="Logo" 
                    style={{
                    width: isMobile ? '80px' : '133px',
                      height: 'auto',
                    transform: 'rotate(18deg)',
                    filter: 'brightness(0) saturate(100%) invert(96%) sepia(9%) saturate(407%) hue-rotate(327deg) brightness(98%) contrast(92%)'
                        }}
                      />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section 
        className="values-section"
                    style={{
                    position: 'relative',
          backgroundImage: 'url(/value-img.png)',
          backgroundPosition: '50% 50%',
                    backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
                  }}
                >
        {/* Gradient Overlay */}
        <div 
                    style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
            pointerEvents: 'none'
          }}
        />
        
        <div className="padding-global" style={{ position: 'relative', zIndex: 1 }}>
          <div className="container-medium"
                    style={{
              width: isMobile ? '90vw' : '75vw',
            marginLeft: 'auto',
            marginRight: 'auto'
                    }}
                  >
                    <div 
              className="values-content"
              style={{
                gap: isMobile ? '2rem' : '3rem',
              flexFlow: 'column',
                alignItems: isMobile ? 'center' : 'flex-start',
                justifyContent: 'space-between',
                paddingTop: isMobile ? '100px' : '180px',
                paddingBottom: isMobile ? '100px' : '180px',
                paddingRight: '0px',
                height: '100vh',
              display: 'flex'
              }}
            >
              <div
                style={{
                display: 'flex',
                flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}
              >
                <div
                  style={{
                    width: isMobile ? '100%' : '50vw',
                    textAlign: isMobile ? 'center' : 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isMobile ? '2rem' : '3rem'
                  }}
                >
                  <h3 
                  style={{
                    fontFamily: 'Lora, serif',
                      fontSize: isMobile ? '2rem' : '2.5rem',
                      fontWeight: '500',
                      color: 'var(--color-bg)',
                      textAlign: isMobile ? 'center' : 'left',
                    margin: 0
                    }}
                  >
                    Наши ценности
                </h3>

                  <div
                    style={{
                      width: '100%',
                      textAlign: isMobile ? 'center' : 'left'
                    }}
                  >
                    <p 
                      className="large-text"
                      style={{
                    fontFamily: 'Lora, serif',
                        fontSize: isMobile ? '1.25rem' : '1.5rem',
                        color: 'var(--color-bg)',
                        lineHeight: '1.5',
                    margin: 0
                      }}
                    >
                      Мы{'\u00A0'}верим в{'\u00A0'}мир, в{'\u00A0'}котором еда дарит здоровье и{'\u00A0'}означает честное, уважительное отношение к{'\u00A0'}природе и{'\u00A0'}людям. Мир, где вы{'\u00A0'}точно знаете, что продукты выращены в{'\u00A0'}гармонии с{'\u00A0'}землёй и{'\u00A0'}вековыми традициями.
                      <br /><br />
                      Наша миссия{'\u00A0'}— сохранять и{'\u00A0'}развивать деревню, уважать землю, передавать опыт предков и{'\u00A0'}кормить людей продуктом, которому можно доверять.
                  </p>
                </div>
              </div>

                <div 
                  className="button-nav"
                  onClick={() => smoothScrollTo('footer')}
                    style={{
                    gap: '0.7rem',
                    backgroundColor: 'var(--color-dark-green)',
                    color: 'var(--color-bg)',
                    borderRadius: '0.4rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '0.75rem 1.5rem',
                    display: 'flex',
                      width: 'auto',
                    alignSelf: isMobile ? 'center' : 'flex-start',
                    position: 'relative',
                    overflow: 'hidden',
                      cursor: 'pointer',
                      marginTop: isMobile ? '10px' : '1rem'
                  }}
                >
                  <div 
                    className="button-text"
                    style={{
                    fontFamily: 'Geologica, sans-serif',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      color: 'var(--color-bg)',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      lineHeight: '1.3',
                      position: 'relative',
                      textTransform: 'uppercase'
                    }}
                  >
                      СВЯЗАТЬСЯ
                  </div>
                  <div 
                    className="button-text is-absolute"
                    style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      color: 'var(--color-bg)',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      lineHeight: '1.3',
                      position: 'absolute',
                      bottom: '-1.2rem',
                      whiteSpace: 'nowrap',
                      textTransform: 'uppercase'
                    }}
                  >
                      СВЯЗАТЬСЯ
      </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section 
        id="partners-section"
        className="partners-section"
                style={{
          backgroundColor: 'var(--color-dark-green)'
        }}
      >
        <div className="padding-global">
          <div 
            className="container-medium"
              style={{
              width: isMobile ? '90vw' : '75vw',
            marginLeft: 'auto',
            marginRight: 'auto'
            }}
          >
            <div 
              className="partners-content"
              style={{
                gap: isMobile ? '3rem' : '4rem',
                flexFlow: isMobile ? 'column' : 'row',
                alignItems: 'center',
                paddingTop: isMobile ? '100px' : '180px',
                paddingBottom: isMobile ? '100px' : '180px',
                paddingRight: '0px',
                  display: 'flex'
              }}
            >
              {/* Left - Image and Logo Container */}
              <div
                    style={{
                    display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  alignItems: 'center'
                }}
              >
                {/* Image */}
                <div
                        style={{
                    width: isMobile ? '100%' : '580px',
                    aspectRatio: '1 / 1',
                  borderRadius: '1rem',
                  overflow: 'hidden'
                  }}
                >
                  <img 
                    src="/partner-img.jpg" 
                    alt="Партнеры" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
              </div>

                {/* Logo */}
                <img 
                  src="/Logo with illustration_dark green.png" 
                  alt="Логотип" 
                    style={{
                    width: isMobile ? '168px' : '240px',
                      height: 'auto',
                    objectFit: 'contain',
                    marginTop: isMobile ? '-100px' : '-120px',
                    marginRight: isMobile ? '-260px' : '-400px',
                    transform: 'rotate(8deg)'
                    }}
                  />
                </div>

              {/* Right - Content */}
              <div
                    style={{
                      display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '2rem' : '3rem',
                  alignItems: isMobile ? 'center' : 'flex-start'
                }}
              >
                <h3 
                      style={{
                    fontFamily: 'Lora, serif',
                    fontSize: isMobile ? '2rem' : '2.5rem',
                    fontWeight: '500',
                    color: 'var(--color-bg)',
                    textAlign: isMobile ? 'center' : 'left',
                    margin: 0
                  }}
                >
                  Мы предлагаем
                </h3>
                
                <ul
                  className="large-text"
                    style={{
                    fontFamily: 'Lora, serif',
                    fontSize: isMobile ? '1.25rem' : '1.5rem',
                    color: 'var(--color-bg)',
                    lineHeight: '1.5',
                    margin: 0,
                    paddingLeft: '1.5rem',
                    listStyleType: 'disc',
                    textAlign: 'left'
                  }}
                >
                  <li>Гибкие условия поставки (объёмы, тестовые партии);</li>
                  <li>Индивидуальные решения для ресторанов и магазинов;</li>
                  <li>Гарантию качества (лично отвечаем за каждую поставленную партию, предоставляем сертификаты);</li>
                  <li>Своевременную поставку (тщательно контролируем логистику и температурные режимы).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="cta-section"
        style={{
              position: 'relative',
          height: '100vh',
              overflow: 'hidden'
        }}
      >
        {/* Video Background */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{
                width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none',
            WebkitUserSelect: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
                  }}
                >
                  <source src="/CTA-video.mp4" type="video/mp4" />
                </video>
                
        {/* Video Overlay */}
        <div 
          className="video-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.38)',
            zIndex: 2
          }}
        />

        {/* Logo Content */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
                display: 'flex',
                justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
                alignItems: 'center',
              gap: '2rem'
            }}
          >
                  <img 
                    src="/Horizontal logo__beige.svg" 
                    alt="Romanovy Prostory Logo"
                    style={{
                width: isMobile ? '80vw' : '50vw',
                      height: 'auto',
                maxWidth: '600px',
                filter: 'brightness(0) saturate(100%) invert(96%) sepia(9%) saturate(407%) hue-rotate(327deg) brightness(98%) contrast(92%)'
                    }}
                  />

            {/* Button */}
                <div 
                  className="button-nav"
                  onClick={() => smoothScrollTo('footer')}
                  style={{
                gap: '0.7rem',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-black)',
                    borderRadius: '0.4rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '0.75rem 1.5rem',
                    display: 'flex',
                width: 'auto',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  <div 
                    className="button-text"
                    style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                  color: 'var(--color-black)',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      lineHeight: '1.3',
                      position: 'relative',
                  textTransform: 'uppercase'
                    }}
                  >
                СВЯЗАТЬСЯ
                  </div>
                  <div 
                    className="button-text is-absolute"
                    style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                  color: 'var(--color-black)',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      lineHeight: '1.3',
                      position: 'absolute',
                      bottom: '-1.2rem',
                      whiteSpace: 'nowrap',
                  textTransform: 'uppercase'
                    }}
                  >
                СВЯЗАТЬСЯ
                  </div>
                </div>
              </div>
        </div>
      </section>

      {/* Articles Section */}
      <section 
        className="section-articles"
                  style={{
          backgroundColor: 'var(--color-bg)'
        }}
      >
        <div className="padding-global">
          <div className="container-large">
            <div 
              className="articles-content article_grid"
              style={{
                gap: '2rem',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gridTemplateRows: isMobile ? '1fr 1fr' : '1fr',
                  width: '100%',
                paddingTop: isMobile ? '100px' : '180px',
                paddingBottom: isMobile ? '100px' : '180px',
                display: 'grid'
              }}
            >
              {/* First Link Block */}
                <a 
                className="link-block"
                  href="https://incrussia.ru/share/uvelichit-vyruchku-agrokompanii/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                  gap: '1rem',
                  color: 'var(--color-black)',
                  borderRadius: '1rem',
                    flexFlow: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                  minHeight: 'calc(70vh)',
                  padding: isMobile ? '2rem' : '2rem 8rem 2rem 2rem',
                    display: 'flex',
                    overflow: 'hidden',
                    position: 'relative',
                  zIndex: 2,
                    backgroundImage: 'url(/location-card-left.jpg)',
                    backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                {/* Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1
                  }}
                />
                
                {/* Content with z-index above overlay */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '100%'
                  }}
                >
                  {/* Icon */}
                  <img 
                    className="location_icon"
                        src="/logo-R.svg" 
                    alt="Icon" 
                        style={{
                      width: '3rem',
                      height: '3rem',
                      filter: 'brightness(0) saturate(100%) invert(96%) sepia(9%) saturate(407%) hue-rotate(327deg) brightness(98%) contrast(92%)'
                    }}
                  />
                  
                  {/* Title */}
                  <h3 
                    className="large-text"
                    style={{
                      fontFamily: 'Lora, serif',
                      fontSize: isMobile ? '1.25rem' : '1.5rem',
                      fontWeight: '400',
                      color: 'var(--color-bg)',
                      lineHeight: '1.5',
                      margin: 0
                    }}
                  >
                      Как увеличить выручку агрокомпании в 4 раза: советы от владелицы эко-фермы
                  </h3>
                  
                  {/* Description */}
                  <p 
                    className="text-small"
                    style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      fontWeight: '300',
                      color: 'var(--color-bg)',
                      lineHeight: '1.5',
                      margin: 0
                    }}
                  >
                    Сократить расходы, удвоить выручку и выйти из зависимости от посредников — не теория, а реальные цели, которых можно достичь, если действовать правильно. Разбираю пять рабочих стратегий, которые помогали мне и моим клиентам из агросектора даже в кризис.
                    </p>
                  </div>
                </a>
                
              {/* Second Link Block */}
                <a 
                className="link-block"
                  href="https://станьбрендом.рф/pr-instrumenty-dlya-ekologichnoj-fermy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                  gap: '1rem',
                  color: 'var(--color-black)',
                  borderRadius: '1rem',
                    flexFlow: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                  minHeight: 'calc(70vh)',
                  padding: isMobile ? '2rem' : '2rem 8rem 2rem 2rem',
                    display: 'flex',
                    overflow: 'hidden',
                    position: 'relative',
                  zIndex: 2,
                    backgroundImage: 'url(/location-card-right.jpg)',
                    backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                {/* Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1
                  }}
                />
                
                {/* Content with z-index above overlay */}
                <div
                    style={{
                      position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '100%'
                  }}
                >
                  {/* Icon */}
                  <img 
                    className="location_icon"
                        src="/logo-R.svg" 
                    alt="Icon" 
                        style={{
                      width: '3rem',
                      height: '3rem',
                      filter: 'brightness(0) saturate(100%) invert(96%) sepia(9%) saturate(407%) hue-rotate(327deg) brightness(98%) contrast(92%)'
                    }}
                  />
                  
                  {/* Title */}
                  <h3 
                    className="large-text"
              style={{
                      fontFamily: 'Lora, serif',
                      fontSize: isMobile ? '1.25rem' : '1.5rem',
                      fontWeight: '400',
                      color: 'var(--color-bg)',
                      lineHeight: '1.5',
                      margin: 0
                    }}
                  >
                      PR-инструменты для экологичной фермы: как привлечь внимание без агрессивной рекламы
                  </h3>
                  
                  {/* Description */}
                  <p 
                    className="text-small"
                    style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      fontWeight: '300',
                      color: 'var(--color-bg)',
                      lineHeight: '1.5',
                      margin: 0
                    }}
                  >
                    Как рассказать о ферме, если не хочется кричать «Купи!» и тратить сотни тысяч на рекламу? Этот вопрос встает перед каждым, кто делает ставку на экологичный продукт. Ответ: в инструментах PR, которые работают через доверие.
        </p>
      </div>
        </a>
            </div>
          </div>
        </div>
      </section>

      {/* Place Section */}
      <section 
        id="section-place"
        className="section-place"
                    style={{
          backgroundColor: 'var(--color-bg)'
        }}
      >
        <div className="padding-global">
          <div 
            className="container-medium"
                    style={{
              width: isMobile ? '90vw' : '75vw',
            marginLeft: 'auto',
            marginRight: 'auto'
            }}
          >
            <div 
              className="place-content"
              style={{
                gap: isMobile ? '3rem' : '4rem',
                flexFlow: isMobile ? 'column' : 'row',
              alignItems: 'center',
                paddingTop: isMobile ? '100px' : '180px',
                paddingBottom: isMobile ? '32px' : '180px',
                paddingRight: '0px',
              display: 'flex'
              }}
            >
              {/* Left - Content */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '2rem' : '3rem',
                  alignItems: isMobile ? 'center' : 'flex-start'
                }}
              >
                <h3 
                  style={{
                    fontFamily: 'Lora, serif',
                    fontSize: isMobile ? '2rem' : '2.5rem',
                    fontWeight: '500',
                    color: 'var(--color-black)',
                    textAlign: isMobile ? 'center' : 'left',
                  margin: 0
                  }}
                >
                  Наше место
                </h3>

                <p 
                  className="large-text"
                  style={{
                    fontFamily: 'Lora, serif',
                    fontSize: isMobile ? '1.25rem' : '1.5rem',
                    color: 'var(--color-black)',
                    lineHeight: '1.5',
                    textAlign: isMobile ? 'center' : 'left',
                    margin: 0
                  }}
                >
                  Родная земля{'\u00A0'}— источник силы и{'\u00A0'}вдохновения. Наша ферма находится в{'\u00A0'}Воронежской области, в{'\u00A0'}Лискинском районе, селе Аношкино. Это земля наших предков, которая хранит память поколений. Здесь{'\u00A0'}— простор, тишина и{'\u00A0'}настоящая деревенская жизнь. Мы{'\u00A0'}создали ферму, где к{'\u00A0'}животным относятся с{'\u00A0'}уважением, а{'\u00A0'}чистая среда и{'\u00A0'}натуральные корма стали основой вкуса, который невозможно подменить.
                </p>
              </div>

              {/* Right - Map Image */}
              <div
                style={{
                  width: isMobile ? '100%' : '580px',
                  height: isMobile ? 'auto' : '420px',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img 
                  src="/map.png" 
                  alt="Карта расположения фермы" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
            </div>
                    </div>
                    </div>
      </section>

      {/* Footer */}
      <footer 
        id="footer"
        className="footer"
        style={{
          backgroundColor: 'var(--color-bg)'
        }}
      >
        <div className="padding-global">
          <div 
            className="container-medium"
            style={{
              width: isMobile ? '90vw' : '75vw',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            {/* Footer Content */}
            <div 
              className="footer_content"
              style={{
                gap: isMobile ? '2rem' : '4rem',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                gridTemplateRows: isMobile ? 'auto auto auto' : 'auto',
                paddingTop: '40px',
                paddingBottom: isMobile ? '24px' : '40px'
              }}
            >
              {/* Footer Left */}
              <div 
                className="footer_left"
                style={{
                  gap: '2rem',
                  flexFlow: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  maxWidth: '74ch',
                  display: 'flex',
                  order: isMobile ? 3 : 1
                }}
              >
                {/* Large Text */}
                 <p 
                  className="large-text"
                  style={{
                    fontFamily: 'Lora, serif',
                    fontSize: isMobile ? '1.25rem' : '1.5rem',
                    color: 'var(--color-black)',
                    lineHeight: '1.5',
                    margin: 0
                  }}
                >
                  Развиваем этичное фермерство, основанное на{'\u00A0'}прозрачности и{'\u00A0'}экологичности. Качество, рожденное природой, а{'\u00A0'}не{'\u00A0'}технологиями.
                </p>

                {/* Credits */}
                <div 
                  className="credits"
                    style={{
                    gap: '1rem',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <p 
                    className="text-small"
                      style={{
                        fontFamily: 'Geologica, sans-serif',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                      fontWeight: '300',
                      color: 'var(--color-black)',
                      margin: 0
                    }}
                  >
                    Romanovy Prostory ©
                  </p>
                  <p 
                      style={{
                        fontFamily: 'Geologica, sans-serif',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                      fontWeight: '300',
                      color: 'var(--color-black)',
                      margin: 0
                    }}
                  >
                    2025
                  </p>
                    </div>
                  </div>

              {/* Footer Mid */}
              <div 
                className="footer_mid"
                style={{
          display: 'flex',
            justifyContent: 'center',
                  alignItems: 'flex-end',
                  order: isMobile ? 1 : 2
                }}
              >
                <img 
                  src="/Frame 2.png" 
                  alt="QR Code" 
                style={{
                    width: '360px',
                  height: '100%',
                  objectFit: 'contain',
                    marginBottom: isMobile ? '0' : '-42px'
                }}
              />
            </div>

              {/* Footer Right */}
              <div 
                className="footer_right"
              style={{
                  gap: '2.5rem',
                  flexFlow: 'column',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'flex-end',
                  display: 'flex',
                  order: isMobile ? 2 : 3
                }}
              >
                {/* Footer Right Wrap 1 - Address */}
                <div 
                  className="footer_right-wrap"
              style={{
                    gap: '1rem',
                    flexFlow: 'column',
                    justifyContent: 'flex-start',
                    alignItems: isMobile ? 'flex-start' : 'flex-end',
                    display: 'flex'
                  }}
                >
                  <p 
                    className="text-small"
                    style={{
              fontFamily: 'Geologica, sans-serif',
              fontSize: isMobile ? '0.875rem' : '1rem',
                      fontWeight: '300',
                      color: 'var(--color-black)',
                textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                margin: 0,
                      textAlign: 'left'
                    }}
                  >
                    Адрес
                  </p>
                  <p 
                    className="text-medium"
              style={{
              fontFamily: 'Geologica, sans-serif',
                      fontSize: isMobile ? '1rem' : '1.25rem',
                      fontWeight: '300',
                      color: 'var(--color-black)',
                      lineHeight: '1.5',
              margin: 0,
                      textAlign: isMobile ? 'left' : 'right'
                    }}
                  >
                    Воронежская область,<br />
                    Лискинский район,<br />
                    село Аношкино, Россия
            </p>
          </div>

                {/* Footer Right Wrap 2 - Contacts */}
        <div 
                  className="footer_right-wrap"
              style={{
                    gap: '1rem',
                    flexFlow: 'column',
                    justifyContent: 'flex-start',
                    alignItems: isMobile ? 'flex-start' : 'flex-end',
                    display: 'flex'
                  }}
                >
                  <p 
                    className="text-small"
          style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      fontWeight: '300',
                      color: 'var(--color-black)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      margin: 0,
                      textAlign: 'left'
                    }}
                  >
                    Контакты
                  </p>
                  <p 
                    className="text-medium"
                    style={{
                      fontFamily: 'Geologica, sans-serif',
                      fontSize: isMobile ? '1rem' : '1.25rem',
                      fontWeight: '300',
                      color: 'var(--color-black)',
                      lineHeight: '1.5',
                      margin: 0,
                      textAlign: isMobile ? 'left' : 'right'
                    }}
                  >
                      +79611877007<br />
                      +79011939905
                  </p>
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
