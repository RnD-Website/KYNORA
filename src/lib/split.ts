/**
 * Runtime line splitting for body copy. Words are wrapped first, then
 * grouped into `.line` masks by their rendered offsetTop so the reveal
 * follows the real line breaks at every breakpoint.
 */
export function splitLines(el: HTMLElement) {
  const source = el.dataset.text ?? el.textContent?.trim() ?? '';
  el.dataset.text = source;
  el.setAttribute('aria-label', source);
  el.innerHTML = source
    .split(/\s+/)
    .map((w) => `<span class="word" aria-hidden="true">${w}</span>`)
    .join(' ');

  const words = Array.from(el.querySelectorAll<HTMLElement>('.word'));
  const lines: HTMLElement[][] = [];
  let top = -1;
  words.forEach((w) => {
    if (Math.abs(w.offsetTop - top) > 2) {
      lines.push([]);
      top = w.offsetTop;
    }
    lines[lines.length - 1].push(w);
  });

  el.innerHTML = lines
    .map(
      (line) =>
        `<span class="line" aria-hidden="true"><span class="line-inner inline-block">${line
          .map((w) => w.textContent)
          .join(' ')}</span></span>`,
    )
    .join('');
  return Array.from(el.querySelectorAll<HTMLElement>('.line-inner'));
}

/** Re-splits on width changes so lines stay accurate. */
export function autoSplit(el: HTMLElement, onSplit: (lines: HTMLElement[]) => void) {
  let w = window.innerWidth;
  onSplit(splitLines(el));
  window.addEventListener('resize', () => {
    if (window.innerWidth === w) return;
    w = window.innerWidth;
    onSplit(splitLines(el));
  });
}
