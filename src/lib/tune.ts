// Optional live-tuning bridge. A dev control panel can publish values here and
// the section scripts apply them. Nothing publishes by default, so every
// section keeps its built-in values.

import { gsap } from './scroll';

type Listener = (values: any) => void;
const state: Record<string, any> = {};
const subs: Record<string, Set<Listener>> = {};

export function setTune(panel: string, values: any) {
  state[panel] = values;
  subs[panel]?.forEach((fn) => fn(values));
}

export function onTune<T = any>(panel: string, fn: (values: T) => void) {
  (subs[panel] ??= new Set()).add(fn);
  if (state[panel]) fn(state[panel]);
  return () => subs[panel].delete(fn);
}

/** Runs fn only when the selected slice of values actually changed. */
export function changed<T>(fn: (v: T) => void) {
  let last = '';
  return (v: T) => {
    const key = JSON.stringify(v);
    if (key === last) return;
    last = key;
    fn(v);
  };
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Rebuilds a split title (line > word > char) and leaves it visible. */
export function setTitle(el: HTMLElement | null, lines: string[]) {
  if (!el) return false;
  const clean = lines.map((l) => l.trim()).filter(Boolean);
  // Unchanged text: keep the original nodes so intro animations still run.
  if (el.querySelector('.sr-only')?.textContent?.trim() === clean.join(' ')) return false;
  el.innerHTML =
    clean
      .map(
        (line) =>
          `<span class="line" aria-hidden="true">${line
            .split(/\s+/)
            .map((w) => `<span class="word">${[...w].map((c) => `<span class="char">${esc(c)}</span>`).join('')}</span>`)
            .join(' ')}</span>`,
      )
      .join('') + `<span class="sr-only">${esc(clean.join(' '))}</span>`;
  return true;
}

/** Rebuilds a label pill's words and leaves them visible. */
export function setLabel(el: HTMLElement | null, text: string) {
  if (!el) return false;
  if (el.querySelector('.sr-only')?.textContent?.trim() === text.trim()) return false;
  const words = text.trim().split(/\s+/);
  el.innerHTML =
    words.map((w) => `<span class="word" aria-hidden="true"><span class="word-inner">${esc(w)}</span></span>`).join(' ') +
    `<span class="sr-only">${esc(text)}</span>`;
  gsap.set(el, { clipPath: 'none' });
  return true;
}

/** Replaces plain text (body copy, headings, buttons) and leaves it visible. */
export function setText(el: HTMLElement | null, text: string) {
  if (!el) return false;
  const current = (el.dataset.text ?? el.textContent ?? '').trim();
  if (current === text.trim()) return false;
  el.dataset.text = text;
  el.textContent = text;
  el.removeAttribute('aria-label');
  gsap.set(el, { clearProps: 'opacity,visibility,transform' });
  return true;
}

export function setVar(el: HTMLElement, name: string, value: string | number) {
  el.style.setProperty(name, String(value));
}

/** "#E66A32" → "230 106 50" for rgb(var(--rgb-x) / alpha) tokens. */
export function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6);
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Updates both the resting label and the hover panel of a Button. */
export function setButton(root: ParentNode, text: string) {
  root.querySelectorAll<HTMLElement>('.button').forEach((b) => {
    const panel = b.querySelector<HTMLElement>('.button-panel-inner');
    const label = b.querySelector<HTMLElement>(':scope > span:last-child');
    if (panel) panel.textContent = text;
    if (label) label.textContent = text;
  });
}
