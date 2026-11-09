import { gsap, ScrollTrigger } from './scroll';

/**
 * Bouncy arched type for a split title (.line > .word > .char).
 *
 * - Every letter sits in its own masked slot (.clip). Slots are tilted and
 *   offset so each line bends into a smile-shaped arc.
 * - On enter, letters spring up out of their slots, edges first.
 * - While scrolling, the arc flexes: curved as the title arrives, flat when it
 *   reaches the middle of the screen, bending the other way as it leaves.
 * - Hovering a letter gives it a squash-and-stretch bounce.
 */
export function kineticTitle(
  title: HTMLElement,
  opts: { rotate?: number; curve?: number; leave?: number; autoplay?: boolean } = {},
): { play: () => void } {
  const maxRot = opts.rotate ?? 8; // degrees at the line ends
  const curve = opts.curve ?? 0.09; // em the middle sits below the ends
  const leave = opts.leave ?? 0.6; // how far the arc inverts on the way out
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  title.classList.add('kinetic');

  // Wrap each letter in its own masked slot
  title.querySelectorAll<HTMLElement>('.char').forEach((c) => {
    if (c.parentElement?.classList.contains('clip')) return;
    const slot = document.createElement('span');
    slot.className = 'clip';
    c.replaceWith(slot);
    slot.appendChild(c);
  });

  // Group slots by the row they actually render on, so wrapped lines each get
  // their own arc. Re-grouped on resize because wrapping changes with width.
  let lines: HTMLElement[][] = [];
  const group = () => {
    const rows = new Map<number, HTMLElement[]>();
    title.querySelectorAll<HTMLElement>('.clip').forEach((slot) => {
      const top = Math.round(slot.offsetTop / 4) * 4;
      if (!rows.has(top)) rows.set(top, []);
      rows.get(top)!.push(slot);
    });
    lines = [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, r]) => r);
  };
  group();
  const chars = Array.from(title.querySelectorAll<HTMLElement>('.char'));
  const state = { arc: 1 };

  const render = () => {
    lines.forEach((slots) => {
      const n = slots.length;
      slots.forEach((slot, i) => {
        const t = n > 1 ? (i / (n - 1)) * 2 - 1 : 0; // -1 … 1 across the line
        const rot = -t * maxRot * state.arc;
        const y = (1 - t * t) * curve * state.arc;
        slot.style.transform = `translateY(${y.toFixed(4)}em) rotate(${rot.toFixed(2)}deg)`;
      });
    });
  };
  render();
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    group();
    render();
  });
  document.fonts?.ready.then(() => {
    group();
    render();
  });

  if (reduce) return { play: () => {} };

  // Reveal: letters spring up out of their slots, edges first.
  // autoplay:false lets a section start it itself (e.g. after the loader).
  gsap.set(chars, { yPercent: 110, transformOrigin: '50% 100%' });
  let played = false;
  const play = () => {
    if (played) return;
    played = true;
    gsap.to(chars, {
      yPercent: 0,
      duration: 1.1,
      ease: 'back.out(1.8)',
      stagger: { each: 0.035, from: 'edges' },
    });
  };
  if (opts.autoplay !== false) {
    ScrollTrigger.create({ trigger: title, start: 'top 85%', once: true, onEnter: play });
  }

  // Scroll: arc flexes curved → flat → inverted
  gsap
    .timeline({
      scrollTrigger: { trigger: title, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      onUpdate: render,
    })
    .fromTo(state, { arc: 1 }, { arc: 0, ease: 'power1.out', duration: 1 })
    .to(state, { arc: -leave, ease: 'power1.in', duration: 1 });

  // Hover: squash-and-stretch bounce
  title.addEventListener('pointerover', (e) => {
    const c = (e.target as HTMLElement).closest('.char') as HTMLElement | null;
    if (!c || gsap.isTweening(c)) return;
    gsap.fromTo(
      c,
      { scaleX: 1.18, scaleY: 0.72 },
      { scaleX: 1, scaleY: 1, duration: 0.9, ease: 'elastic.out(1, 0.35)' },
    );
  });

  return { play };
}
