import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAP = () => {
  const elementRef = useRef<HTMLElement>(null);

  const fadeInUp = (delay = 0, duration = 0.8) => {
    return gsap.from(elementRef.current, {
      y: 50,
      opacity: 0,
      duration,
      delay,
      ease: "power3.out"
    });
  };

  const fadeInLeft = (delay = 0, duration = 0.8) => {
    return gsap.from(elementRef.current, {
      x: -50,
      opacity: 0,
      duration,
      delay,
      ease: "power3.out"
    });
  };

  const fadeInRight = (delay = 0, duration = 0.8) => {
    return gsap.from(elementRef.current, {
      x: 50,
      opacity: 0,
      duration,
      delay,
      ease: "power3.out"
    });
  };

  const scaleIn = (delay = 0, duration = 0.8) => {
    return gsap.from(elementRef.current, {
      scale: 0.8,
      opacity: 0,
      duration,
      delay,
      ease: "back.out(1.7)"
    });
  };

  const staggerChildren = (children: HTMLElement[], delay = 0.1) => {
    return gsap.from(children, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: delay,
      ease: "power3.out"
    });
  };

  const scrollTrigger = (options: ScrollTrigger.Vars) => {
    return ScrollTrigger.create({
      trigger: elementRef.current,
      ...options
    });
  };

  return {
    elementRef,
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    staggerChildren,
    scrollTrigger
  };
};
