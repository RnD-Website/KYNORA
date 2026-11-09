import { gsap, ScrollTrigger } from '../lib/scroll';
import { labelIn, copyIn } from '../lib/reveal';
import { kineticTitle } from '../lib/kinetic';
import { onReady, isDesktop } from '../lib/app';
import { onTune, changed, setTitle, setLabel, setText, setVar } from '../lib/tune';

/**
 * <c-hero>
 * - Intro: label → title chars → copy lines, scene rises into place.
 * - Scroll (sticky 215vh): copy lifts away, sky fades in, the scene rises
 *   with per-layer parallax (background slow, foreground fast).
 * - Hotspots draw in once the scene has settled.
 * - Grass sways and birds drift continuously.
 */
class Hero extends HTMLElement {
  connectedCallback() {
    const q = <T extends Element = HTMLElement>(s: string) => this.querySelector<T>(s)!;
    const qa = (s: string) => Array.from(this.querySelectorAll<HTMLElement>(s));

    const content = q('.hero-content');
    const label = q('.label');
    const title = q('.content-title');
    const copy = q('.hero-copy');
    const sky = q('.hero-sky');
    const layers = q('.hero-layers-intro');
    const bg = q('.hero-background');
    const mid = q('.hero-midground');
    const fg = q('.hero-foreground');
    const hotspots = qa('.hotspot');

    // Tunable values (DialKit "Hero" panel); defaults match the reference.
    const cfg = { sceneRise: 0.16, layerParallax: 0, hotspotsAt: 0.55, sway: 1, speed: 1 };

    // Hidden until intro
    const kinetic = kineticTitle(title, { autoplay: false });
    gsap.set(label, { clipPath: 'inset(0 50% 0 50%)' });
    gsap.set(layers, { yPercent: 18 });
    hotspots.forEach((h) => this.hideHotspot(h));

    onReady(() => {
      const tl = gsap.timeline();
      tl.add(labelIn(label), 0);
      tl.add(() => kinetic.play(), 0.15);
      tl.add(copyIn(copy), 0.55);
      tl.to(layers, { yPercent: 0, duration: 2, ease: 'expo.out' }, 0.1);
    });

    // Scroll choreography
    const st = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: this,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const show = self.progress > cfg.hotspotsAt;
          if (show !== this.hotspotsShown) {
            this.hotspotsShown = show;
            hotspots.forEach((h, i) => (show ? this.showHotspot(h, i * 0.15) : this.hideHotspot(h, true)));
          }
        },
      },
    });
    st.to(content, { y: () => -window.innerHeight * 0.95, duration: 0.6 }, 0)
      .fromTo(sky, { opacity: 0, yPercent: 15 }, { opacity: 1, yPercent: 0, duration: 0.6 }, 0)
      .fromTo(this.querySelector('.hero-layers'), { y: () => window.innerHeight * cfg.sceneRise }, { y: 0, duration: 0.65 }, 0)
      .fromTo(bg, { y: () => -window.innerHeight * 0.08 * cfg.layerParallax }, { y: 0, duration: 0.65 }, 0)
      .fromTo(fg, { y: () => window.innerHeight * 0.14 * cfg.layerParallax }, { y: 0, duration: 0.65 }, 0)
      .to(mid, { y: 0, duration: 1 }, 0);

    // Ambient motion — grass sways from its base, birds drift and flap
    let sway: gsap.core.Tween[] = [];
    const startSway = () => {
      sway.forEach((t) => t.kill());
      sway = qa('.grass-clump').map((g, i) => {
        gsap.set(g, { transformOrigin: `${g.dataset.x}px 1000px`, rotation: 0 });
        return gsap.to(g, {
          rotation: gsap.utils.random(1.2, 2.6) * cfg.sway * (i % 2 ? 1 : -1),
          duration: gsap.utils.random(2.2, 3.6) / cfg.speed,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: gsap.utils.random(0, 2),
        });
      });
    };
    startSway();
    qa('.bird').forEach((b) => {
      gsap.to(b, { x: `+=${gsap.utils.random(60, 140)}`, y: `-=${gsap.utils.random(10, 40)}`, duration: gsap.utils.random(8, 14), ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(b.querySelector('.bird-wings'), { scaleY: 0.35, transformOrigin: '50% 50%', duration: gsap.utils.random(0.25, 0.4), ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });

    ScrollTrigger.refresh();

    // DialKit live editing
    const show = (sel: string, on: boolean) => qa(sel).forEach((el) => (el.style.visibility = on ? '' : 'hidden'));
    onTune('hero', changed((v: any) => {
      setLabel(label, v.text.label);
      setTitle(title, [v.text.titleLine1, v.text.titleLine2]);
      setText(copy, v.text.copy);
      const btns = qa('.hotspot-label-inner > span');
      if (btns[0]) btns[0].textContent = v.text.leftButton;
      if (btns[1]) btns[1].textContent = v.text.rightButton;

      setVar(this, '--title-scale', v.titleSize);
      setVar(this, '--product-scale', v.productSize);
      setVar(this, '--product-gap', v.productSpacing);
      qa('.hotspot-left').forEach((h) => (h.style.translate = `calc(${-v.productSpacing}% * 1.6) 0`));
      qa('.hotspot-right').forEach((h) => (h.style.translate = `calc(${v.productSpacing}% * 1.6) 0`));

      const swayChanged = cfg.sway !== v.grass.sway || cfg.speed !== v.grass.speed;
      Object.assign(cfg, { sceneRise: v.sceneRise, layerParallax: v.layerParallax, hotspotsAt: v.hotspotsAt, sway: v.grass.sway, speed: v.grass.speed });
      if (swayChanged) startSway();
      show('.grass-clump', v.grass.show);
      show('.bird', v.showBirds);
      sky.style.display = v.showSky ? '' : 'none';
      st.scrollTrigger?.refresh();
    }));
  }

  hotspotsShown = false;

  hideHotspot(h: HTMLElement, animate = false) {
    const d = animate ? 0.4 : 0;
    gsap.to(h.querySelector('.hotspot-icon'), { scale: 0, duration: d, ease: 'power3.in' });
    gsap.to(h.querySelector('.hotspot-dashes circle'), { strokeDashoffset: 100, duration: d });
    // The label always tucks back toward its circle; its side flips below xl.
    const left = h.classList.contains('hotspot-left');
    const dir = left === isDesktop() ? 101 : -101;
    gsap.to(h.querySelector('.hotspot-label-inner'), { xPercent: dir, duration: d, ease: 'power3.in' });
  }

  showHotspot(h: HTMLElement, delay = 0) {
    const circle = h.querySelector('.hotspot-dashes circle')!;
    gsap.set(circle, { strokeDasharray: '3 3' });
    gsap.fromTo(h.querySelector('.hotspot-icon'), { scale: 0 }, { scale: 1, duration: 0.9, ease: 'back.out(2)', delay });
    gsap.fromTo(circle, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 1.2, ease: 'expo.out', delay: delay + 0.1 });
    gsap.to(h.querySelector('.hotspot-label-inner'), { xPercent: 0, duration: 1, ease: 'expo.out', delay: delay + 0.25 });
  }
}

customElements.define('c-hero', Hero);
