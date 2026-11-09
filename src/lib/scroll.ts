import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

let lenis: Lenis | null = null;

/** Locks a stable 1vh unit on touch devices (reference: --vh-initial). */
function setViewportUnit() {
  document.documentElement.style.setProperty('--vh-initial', `${window.innerHeight / 100}px`);
}

/** Lenis smooth scroll driven by the GSAP ticker — same options as reference (lerp 0.1). */
export function initScroll() {
  if (lenis) return lenis;
  setViewportUnit();
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastW) {
      lastW = window.innerWidth;
      setViewportUnit();
    }
  });

  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as any).lenis = lenis;
  return lenis;
}

export function getLenis() {
  return lenis;
}

export { gsap, ScrollTrigger };
