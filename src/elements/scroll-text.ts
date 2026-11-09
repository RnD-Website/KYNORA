import { gsap } from '../lib/scroll';
import { onTune, changed, setLabel, setVar, setButton } from '../lib/tune';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const charsHtml = (text: string) =>
  text
    .split(/\s+/)
    .map((w) => `<span class="word" aria-hidden="true">${[...w].map((c) => `<span class="char">${esc(c)}</span>`).join('')}</span>`)
    .join(' ');

/**
 * <c-scroll-text>
 * - Statement chars switch from the muted placeholder to cream, scrubbed.
 * - The photo below is sticky and drifts with a slow parallax.
 */
class ScrollText extends HTMLElement {
  connectedCallback() {
    const content = this.querySelector<HTMLElement>('.scroll-text-content')!;
    const placeholder = this.querySelector<HTMLElement>('.scroll-text-placeholder')!;
    const cfg = { revealLength: 1, photoParallax: 3 };

    let reveal: gsap.core.Tween | null = null;
    const buildReveal = () => {
      reveal?.scrollTrigger?.kill();
      reveal?.kill();
      reveal = gsap.fromTo(
        content.querySelectorAll('.char'),
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: {
            trigger: content,
            start: 'top 75%',
            end: () => `bottom ${45 - (cfg.revealLength - 1) * 30}%`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    };
    buildReveal();

    // Video: play only while on screen (saves battery), and always loop
    const video = this.querySelector<HTMLVideoElement>('.scroll-text-image video');
    if (video) {
      video.muted = true;
      const play = () => video.play().catch(() => {});
      video.addEventListener('ended', () => {
        video.currentTime = 0;
        play();
      });
      new IntersectionObserver(([e]) => (e.isIntersecting ? play() : video.pause()), { threshold: 0.15 }).observe(video);
    }

    // Photo: settles from a gentle zoom to the full, uncropped frame as it
    // scrolls in (ends at scale 1, so the whole image is visible).
    const wrapper = this.querySelector('.scroll-text-image')!;
    gsap.fromTo(
      this.querySelector('.scroll-text-image-inner'),
      { scale: 1.12 },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: wrapper, start: 'top bottom', end: 'top 25%', scrub: true } },
    );

    // DialKit "Statement" panel
    let lastText = (content.querySelector('.sr-only')?.textContent ?? '').trim();
    onTune('statement', changed((v: any) => {
      setLabel(this.querySelector('.label'), v.label);
      if (v.text.trim() !== lastText) {
        lastText = v.text.trim();
        placeholder.innerHTML = charsHtml(lastText);
        content.innerHTML = charsHtml(lastText) + `<span class="sr-only">${esc(lastText)}</span>`;
        buildReveal();
      }
      setButton(this, v.button);
      setVar(this, '--statement-scale', v.textSize);
      placeholder.style.color = v.mutedText;
      cfg.revealLength = v.revealLength;
      cfg.photoParallax = v.photoParallax;
      reveal?.scrollTrigger?.refresh();
      gsap.utils.toArray<any>(gsap.getTweensOf(this.querySelector('.scroll-text-image-inner'))).forEach((t) => t.scrollTrigger?.refresh());
    }));
  }
}

customElements.define('c-scroll-text', ScrollText);
