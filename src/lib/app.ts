// Tiny app lifecycle: sections register intro callbacks that fire once the
// loader has left (reference: loader → hero intro sequence).

type Cb = () => void;
const queue: Cb[] = [];
let ready = false;

export function onReady(cb: Cb) {
  if (ready) cb();
  else queue.push(cb);
}

export function setReady() {
  if (ready) return;
  ready = true;
  queue.splice(0).forEach((cb) => cb());
}

export const isDesktop = () => window.matchMedia('(min-width: 1200px)').matches;
export const isTouch = () => window.matchMedia('(pointer: coarse)').matches;
