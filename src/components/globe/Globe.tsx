import { onMount, onCleanup, For } from 'solid-js';
import * as THREE from 'three';
import { createLandCanvas } from './landTexture';
import { onTune } from '../../lib/tune';

type Marker = { label: string; lat: number; lng: number; icon: 'bolt' | 'leaf' };

const OCEAN = '#FFFFFF';
const LAND = '#7A3D22';
// Live values from the DialKit "Ambassadors" panel (defaults below)
const live = { size: 0.73, spin: 1, land: LAND, ocean: OCEAN, tilt: 38, markers: true };
const FOCUS = { lat: 38, lng: 22 }; // initial view (Europe → South Asia)

const toVec = (lat: number, lng: number, r = 1) => {
  const polar = THREE.MathUtils.degToRad(90 - lat);
  const phi = THREE.MathUtils.degToRad(lng + 180);
  return new THREE.Vector3(-Math.cos(phi) * Math.sin(polar) * r, Math.cos(polar) * r, Math.sin(phi) * Math.sin(polar) * r);
};

/**
 * Three.js globe island (reference: c-globe).
 * Textured sphere with soft limb shading, auto-rotation, drag to spin,
 * scroll-linked spin, and HTML markers projected onto the surface.
 */
export default function Globe(props: { markers: Marker[] }) {
  let host!: HTMLDivElement;
  let canvasEl!: HTMLCanvasElement;
  const markerEls: HTMLAnchorElement[] = [];

  onMount(() => {
    const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const texture = new THREE.CanvasTexture(createLandCanvas(OCEAN, LAND));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;

    const material = new THREE.ShaderMaterial({
      uniforms: { map: { value: texture } },
      vertexShader: /* glsl */ `
        varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main(){
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D map; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main(){
          vec4 c = texture2D(map, vUv);
          float f = clamp(dot(vN, vV), 0.0, 1.0);
          float shade = mix(0.8, 1.0, smoothstep(0.0, 0.7, f));
          vec3 col = c.rgb * shade + vec3(0.96,0.91,0.85) * (1.0 - smoothstep(0.0,0.45,f)) * 0.35;
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    });

    const tiltGroup = new THREE.Group();
    const spinGroup = new THREE.Group();
    tiltGroup.add(spinGroup);
    scene.add(tiltGroup);
    spinGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), material));

    const baseSpin = Math.PI / 2 - THREE.MathUtils.degToRad(FOCUS.lng + 180);
    tiltGroup.rotation.x = THREE.MathUtils.degToRad(FOCUS.lat);
    let spin = baseSpin;
    let drag = 0;
    let velocity = 0;
    let scrollSpin = 0;

    const points = props.markers.map((m) => toVec(m.lat, m.lng, 1.005));

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // keep globe diameter ≈ 73% of the viewport height, ≈ 92% width on narrow screens
      const target = Math.min(h * live.size, w * 0.92);
      const dist = 1 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (h / target);
      camera.position.z = dist;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Drag to spin
    let dragging = false;
    let lastX = 0;
    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; host.classList.add('cursor-grabbing'); };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = dx * 0.005;
      drag += velocity;
    };
    const up = () => { dragging = false; host.classList.remove('cursor-grabbing'); };
    canvasEl.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    // Scroll-linked spin
    const onScroll = () => {
      const r = host.getBoundingClientRect();
      const p = 1 - (r.top + r.height) / (window.innerHeight + r.height);
      scrollSpin = (p - 0.5) * 0.9;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Reveal markers once in view
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        markerEls.forEach((el, i) => setTimeout(() => el.classList.add('is-in'), 200 + i * 120));
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(host);

    const v = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    let raf = 0;
    let visible = true;
    const vis = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    vis.observe(host);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (!dragging) {
        velocity *= 0.94;
        drag += velocity;
        spin += 0.0008 * live.spin;
      }
      spinGroup.rotation.y = spin + drag + scrollSpin;
      renderer.render(scene, camera);

      // project markers
      const w = host.clientWidth;
      const h = host.clientHeight;
      spinGroup.updateMatrixWorld();
      points.forEach((p, i) => {
        const el = markerEls[i];
        if (!el) return;
        v.copy(p).applyMatrix4(spinGroup.matrixWorld);
        camDir.copy(camera.position).sub(v).normalize();
        const facing = v.clone().normalize().dot(camDir);
        v.project(camera);
        const x = (v.x * 0.5 + 0.5) * w;
        const y = (-v.y * 0.5 + 0.5) * h;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.classList.toggle('is-hidden', facing < 0.15 || !live.markers);
      });
    };
    tick();

    const offTune = onTune('ambassadors', (v: any) => {
      const g = v.globe;
      const recolor = g.land !== live.land || g.ocean !== live.ocean;
      Object.assign(live, { size: g.size, spin: g.spinSpeed, land: g.land, ocean: g.ocean, tilt: g.tilt, markers: g.showMarkers });
      tiltGroup.rotation.x = THREE.MathUtils.degToRad(live.tilt);
      if (recolor) {
        texture.image = createLandCanvas(live.ocean, live.land);
        texture.needsUpdate = true;
      }
      resize();
    });

    onCleanup(() => {
      offTune();
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      vis.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
    });
  });

  return (
    <div ref={host} class="globe-canvas relative w-full h-screen-mobile xl:h-screen cursor-grab touch-pan-y select-none">
      <canvas ref={canvasEl} class="absolute-full" />
      <For each={props.markers}>
        {(m, i) => (
          <a
            ref={(el) => (markerEls[i()] = el)}
            href="#"
            class="globe-marker group absolute top-0 left-0 z-1 -ml-8 -mt-8"
            aria-label={m.label}
          >
            <span class="globe-marker-modal absolute bottom-[calc(100%+0.6rem)] left-[0.8rem] -translate-x-1/2 flex flex-col items-center pointer-events-none">
              <span class="relative px-20 py-15 heading-h8 text-ink whitespace-nowrap bg-white">{m.label}</span>
              <svg class="w-30 text-white -mt-px" viewBox="0 0 30 14" aria-hidden="true"><path d="M0 0h30L15 14Z" fill="currentColor" /></svg>
            </span>
            <span class="globe-marker-dot relative block w-16 h-16 bg-orange rounded-full">
              <svg class="absolute-center w-[0.7rem] h-[0.7rem] text-white" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                {m.icon === 'bolt' ? <path d="M9.8 0 1 9.3h6.4L6.2 16 15 6.2H8.6L9.8 0Z" /> : <circle cx="8" cy="8" r="4" />}
              </svg>
              <svg class="globe-marker-dashes absolute-center w-25 h-25 -rotate-90 text-orange overflow-visible" viewBox="0 0 26 26" aria-hidden="true">
                <circle cx="13" cy="13" r="12.5" fill="none" stroke="currentColor" stroke-dasharray="2 2" />
              </svg>
            </span>
          </a>
        )}
      </For>
    </div>
  );
}
