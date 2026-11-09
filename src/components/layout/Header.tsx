import { createSignal, onMount, onCleanup, For, Show } from 'solid-js';

type Item = { label: string; href: string; image: string };
type Props = {
  primary: { label: string; items: Item[] }[];
  secondary: { label: string; href: string }[];
  region: string;
};

const LogoSvg = (p: { class?: string }) => (
  <svg class={p.class} viewBox="0 0 200 44" fill="currentColor" role="img" aria-label="KYNORA">
    <g transform="translate(0 6) scale(1.35)">
      <path d="M3 2c6 0 9.5 3.6 9.5 9.6C6.6 11.6 3 8 3 2Z" />
      <path d="M21 2c0 6-3.5 9.6-9.4 9.6C11.6 5.6 15 2 21 2Z" opacity=".75" />
      <path d="M12.5 12.4C12.5 18.4 9 22 3 22c0-6 3.6-9.6 9.5-9.6Z" opacity=".75" />
      <path d="M11.6 12.4c5.9 0 9.4 3.6 9.4 9.6-5.9 0-9.4-3.6-9.4-9.6Z" />
    </g>
    <text x="40" y="35" font-family="'Figtree Variable', Figtree, sans-serif" font-weight="800" font-size="36" letter-spacing="-0.5">KYNORA</text>
  </svg>
);

/**
 * Header island (reference: header).
 * - Transparent over the hero; hides on scroll down, returns on scroll up
 *   with a white bar.
 * - Category mega-menus with image cards + dimmed overlay (desktop).
 * - Full-screen menu on mobile.
 */
export default function Header(props: Props) {
  const [hidden, setHidden] = createSignal(false);
  const [solid, setSolid] = createSignal(false);
  const [submenu, setSubmenu] = createSignal<number | null>(null);
  const [mobileOpen, setMobileOpen] = createSignal(false);

  onMount(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const down = y > last;
      if (Math.abs(y - last) > 4) {
        setHidden(down && y > 120 && submenu() === null);
        last = y;
      }
      setSolid(y > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setSubmenu(null), setMobileOpen(false));
    window.addEventListener('keydown', onKey);
    onCleanup(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    });
  });

  const lockScroll = (lock: boolean) => {
    const l = (window as any).lenis;
    if (l) lock ? l.stop() : l.start();
  };
  const openSub = (i: number | null) => {
    setSubmenu(i);
    lockScroll(i !== null);
  };
  const toggleMobile = () => {
    const v = !mobileOpen();
    setMobileOpen(v);
    lockScroll(v);
  };

  return (
    <header class="header fixed top-0 left-0 w-screen pointer-events-none z-header text-ink">
      {/* overlay */}
      <div
        class="fixed inset-0 bg-black/70 transition-opacity duration-normal"
        classList={{ 'opacity-0 pointer-events-none': submenu() === null, 'opacity-100 pointer-events-auto': submenu() !== null }}
        onClick={() => openSub(null)}
      />

      {/* submenus */}
      <For each={props.primary}>
        {(group, i) => (
          <div
            class="header-submenu absolute top-0 left-0 w-full bg-white pt-[calc(var(--header-height)+2rem)] pb-40 px-margin transition-transform duration-smooth ease-out pointer-events-auto"
            classList={{ '-translate-y-full': submenu() !== i(), 'translate-y-0': submenu() === i() }}
            aria-hidden={submenu() !== i()}
          >
            <div class="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              <For each={group.items}>
                {(item) => (
                  <a href={item.href} class="group block" tabIndex={submenu() === i() ? 0 : -1}>
                    <div class="relative w-full pt-[70%] bg-cream overflow-hidden">
                      <img src={item.image} alt="" class="absolute-full object-contain p-20 transition-transform duration-smooth ease-out group-hover:scale-105" loading="lazy" />
                    </div>
                    <div class="heading-h8 md:heading-h6 mt-16">{item.label}</div>
                  </a>
                )}
              </For>
            </div>
          </div>
        )}
      </For>

      {/* top bar */}
      <div
        class="header-top relative grid-w items-center w-full h-header pointer-events-auto transition-[transform,background-color] duration-normal ease-out"
        classList={{
          '-translate-y-full': hidden() && !mobileOpen(),
          'bg-white': (solid() || submenu() !== null) && !mobileOpen(),
        }}
      >
        <nav class="col-span-2 md:col-span-5 flex items-center gap-x-20 heading-h8">
          <div class="hidden xl:flex gap-x-20">
            <For each={props.primary}>
              {(g, i) => (
                <button
                  type="button"
                  class="heading-h8 uppercase transition-opacity hover:opacity-60 focus:outline-none focus-visible:outline"
                  classList={{ 'opacity-60': submenu() !== null && submenu() !== i() }}
                  aria-expanded={submenu() === i()}
                  onClick={() => openSub(submenu() === i() ? null : i())}
                >
                  {g.label}
                </button>
              )}
            </For>
          </div>
          <button type="button" class="flex items-center gap-x-8 heading-h8 uppercase xl:ml-40 hover:opacity-60 transition-opacity" aria-label="Search">
            <svg class="w-16 h-16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <circle cx="6.8" cy="6.8" r="5.2" />
              <path d="m10.6 10.6 4 4" stroke-linecap="round" />
            </svg>
            <span class="max-md:hidden">Search</span>
          </button>
        </nav>

        <a href="/" class="col-span-2 md:col-span-2 justify-self-center" aria-label="KYNORA home">
          <LogoSvg class="w-[11rem] md:w-[10rem] h-auto" />
        </a>

        <div class="col-span-2 md:col-span-5 flex justify-end items-center gap-x-20">
          <nav class="hidden xl:flex gap-x-20">
            <For each={props.secondary}>
              {(l) => <a href={l.href} class="heading-h8 transition-opacity hover:opacity-60">{l.label}</a>}
            </For>
          </nav>
          <button type="button" class="xl:hidden relative heading-h8 uppercase w-60 text-right" aria-expanded={mobileOpen()} onClick={toggleMobile}>
            <span class="transition-opacity" classList={{ 'opacity-0': mobileOpen() }}>Menu</span>
            <span class="absolute top-0 right-0 transition-opacity" classList={{ 'opacity-0': !mobileOpen() }}>Close</span>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <Show when={true}>
        <div
          class="header-mobile xl:hidden absolute top-0 left-0 w-full h-screen-mobile bg-white -z-1 px-margin pt-[calc(var(--header-height)+4rem)] pb-40 flex flex-col transition-[clip-path] duration-smooth ease-out"
          style={{ 'clip-path': mobileOpen() ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)' }}
          classList={{ 'pointer-events-auto': mobileOpen() }}
          aria-hidden={!mobileOpen()}
        >
          <For each={props.primary}>
            {(g) => (
              <div class="border-t border-ink/20 py-20">
                <div class="heading-h5-mobile">{g.label}</div>
                <div class="flex flex-wrap gap-x-20 gap-y-8 mt-12 body-l">
                  <For each={g.items}>{(it) => <a href={it.href}>{it.label}</a>}</For>
                </div>
              </div>
            )}
          </For>
          <div class="border-t border-ink/20 pt-20 flex flex-col gap-y-8">
            <For each={props.secondary}>{(l) => <a href={l.href} class="heading-h7">{l.label}</a>}</For>
          </div>
          <div class="mt-auto heading-h8">{props.region}</div>
        </div>
      </Show>
    </header>
  );
}
