import { gsap, ScrollTrigger } from './scroll';
import { autoSplit } from './split';

const EASE = 'expo.out';

/** Label pill: border draws in, words slide up. */
export function labelIn(el: HTMLElement, delay = 0) {
  const words = el.querySelectorAll('.word-inner');
  const tl = gsap.timeline({ delay });
  tl.fromTo(el, { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 1, ease: 'expo.inOut' });
  tl.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: EASE }, 0.35);
  return tl;
}

/** Big title: chars rise from their line masks with a stagger. */
export function titleIn(el: HTMLElement, delay = 0) {
  const chars = el.querySelectorAll('.char');
  return gsap.fromTo(
    chars,
    { yPercent: 105 },
    { yPercent: 0, duration: 1.4, stagger: 0.025, ease: EASE, delay },
  );
}

/** Body copy: real lines rise one after another. */
export function copyIn(el: HTMLElement, delay = 0) {
  let lines: HTMLElement[] = [];
  autoSplit(el, (l) => (lines = l));
  return gsap.fromTo(lines, { yPercent: 105 }, { yPercent: 0, duration: 1.2, stagger: 0.08, ease: EASE, delay });
}

export function fadeUp(el: HTMLElement, delay = 0) {
  return gsap.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE, delay });
}

const runners: Record<string, (el: HTMLElement, d?: number) => gsap.core.Animation> = {
  label: labelIn,
  title: titleIn,
  copy: copyIn,
  fade: fadeUp,
};

/**
 * Wires every [data-reveal] element that is not hand-driven by a section
 * (data-reveal-manual) to play once when it enters the viewport.
 */
export function initReveals(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-manual])').forEach((el) => {
    const run = runners[el.dataset.reveal || ''];
    if (!run) return;
    const anim = run(el, Number(el.dataset.revealDelay || 0));
    anim.pause(0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => anim.play(),
    });
  });
}
