import { gsap, ScrollTrigger } from '../lib/scroll';
import { onTune, changed, setTitle, setText, setVar } from '../lib/tune';
import { kineticTitle } from '../lib/kinetic';

/**
 * <c-belief-section>
 * - Solid trail draws over the dashed one, scrubbed to scroll.
 * - Numbered marker rides the head of the solid line.
 * - Square photo sits tilted with inner parallax.
 * - Last section: the photo untilts and grows to fill the sticky viewport.
 * Every value marked cfg is live-editable from the DialKit "Beliefs" panel.
 */
class BeliefSection extends HTMLElement {
  connectedCallback() {
    const isLast = this.hasAttribute('data-last');
    const index = Number(this.dataset.index || 0);
    const cfg = { tilt: Number(this.dataset.tilt || 0), parallax: 25 };
    const svg = this.querySelector<SVGSVGElement>('.belief-trail')!;
    const solid = this.querySelector<SVGPathElement>('.belief-path-solid')!;
    const dash = this.querySelector<SVGPathElement>('.belief-path-dash')!;
    const dot = this.querySelector<HTMLElement>('.belief-number')!;
    const arrow = this.querySelector<HTMLElement>('.belief-arrow');

    const length = solid.getTotalLength();
    solid.setAttribute('pathLength', '1');
    gsap.set(solid, { strokeDasharray: 1, strokeDashoffset: 1 });

    const placeDot = (p: number) => {
      const pt = solid.getPointAtLength(length * p);
      const box = svg.getBoundingClientRect();
      gsap.set(dot, { x: (pt.x / 1600) * box.width, y: (pt.y / 1000) * box.height });
    };
    placeDot(0);

    gsap.to(solid, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: this,
        start: isLast ? 'top 85%' : 'top 70%',
        end: isLast ? 'top -40%' : 'bottom 55%',
        scrub: true,
        onUpdate: (self) => placeDot(self.progress),
        onToggle: (self) => gsap.to(dot, { scale: self.isActive || self.progress > 0 ? 1 : 0, duration: 0.5, ease: 'back.out(2)' }),
        onRefresh: (self) => placeDot(self.progress),
      },
    });

    if (arrow) {
      ScrollTrigger.create({
        trigger: this,
        start: 'top 75%',
        onEnter: () => gsap.to(arrow, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }),
        onLeaveBack: () => gsap.to(arrow, { opacity: 0, y: -20, duration: 0.4 }),
      });
      gsap.set(arrow, { y: -20 });
    }

    // Section title: arched letters that spring up and flex with scroll
    const ownTitle = this.querySelector<HTMLElement>('.belief-title');
    if (ownTitle) kineticTitle(ownTitle, { rotate: 6 });

    const triggers: ScrollTrigger[] = [];
    if (!isLast) {
      const image = this.querySelector<HTMLElement>('.belief-image')!;
      gsap.set(image, { rotation: cfg.tilt });
      const travel = () => cfg.parallax * (window.matchMedia('(min-width: 768px)').matches ? 1 : 0.48);
      const t1 = gsap.fromTo(image, { yPercent: () => travel() }, {
        yPercent: () => -travel(),
        ease: 'none',
        scrollTrigger: { trigger: this, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      });
      gsap.fromTo(this.querySelector('.belief-image-prlx'), { yPercent: -8 }, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: this, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      triggers.push(t1.scrollTrigger!);

      // Entrance: the photo opens from its centre like a window, the image
      // inside settles from a slow zoom, and the tilt swings into place.
      const img = this.querySelector<HTMLElement>('.belief-image-prlx img');
      const intro = gsap
        .timeline({ paused: true })
        .fromTo(image, { clipPath: 'inset(50% 50% 50% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' }, 0)
        .fromTo(image, { rotation: () => cfg.tilt - 14 }, { rotation: () => cfg.tilt, duration: 1.6, ease: 'expo.out' }, 0.1)
        .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0);
      ScrollTrigger.create({
        trigger: this,
        start: 'top 55%',
        onEnter: () => intro.play(),
        onLeaveBack: () => intro.reverse(),
      });
    } else {
      const rotate = this.querySelector<HTMLElement>('.belief-image-rotate')!;
      gsap.set(rotate, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
      const t = gsap.fromTo(
        rotate,
        { rotation: () => cfg.tilt, width: () => this.photoSize(), height: () => this.photoSize() },
        {
          rotation: 0,
          width: () => window.innerWidth * 1.08,
          height: () => window.innerHeight * 1.08,
          ease: 'power1.inOut',
          scrollTrigger: { trigger: this, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
        },
      );
      triggers.push(t.scrollTrigger!);
    }

    // DialKit "Beliefs" panel — shared settings + this section's folder
    onTune('beliefs', changed((v: any) => {
      const own = v[`belief${index + 1}`];
      if (own) {
        setTitle(this.querySelector('.content-title'), [own.titleLine1, own.titleLine2]);
        setText(this.querySelector('.belief-heading'), own.heading);
        setText(this.querySelector('.belief-body'), own.body);
        cfg.tilt = own.tilt;
        if (!isLast) gsap.set(this.querySelector('.belief-image'), { rotation: own.tilt });
      }
      setVar(this, '--title-scale', v.titleSize);
      setVar(this, '--belief-img-scale', v.photoSize);
      cfg.parallax = v.photoParallax;
      solid.style.strokeWidth = String(v.trailWidth);
      dash.style.strokeWidth = String(Math.max(0.5, v.trailWidth * 0.75));
      dash.style.opacity = String(v.trailDashOpacity);
      triggers.forEach((t) => t.refresh());
    }));
  }

  /** Current resting size of the square photo, in px. */
  photoSize() {
    const probe = document.createElement('div');
    probe.className = 'belief-size';
    probe.style.cssText = 'position:absolute;visibility:hidden';
    this.appendChild(probe);
    const w = probe.offsetWidth;
    probe.remove();
    return w;
  }
}

customElements.define('c-belief-section', BeliefSection);

// Intro block above the three sections
// Intro title: arched letters that spring up, flex with scroll, bounce on hover
const introTitle = document.querySelector<HTMLElement>('.beliefs-intro .content-title');
if (introTitle) kineticTitle(introTitle);
