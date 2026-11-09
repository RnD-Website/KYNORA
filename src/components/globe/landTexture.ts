import { feature } from 'topojson-client';
import land from 'world-atlas/land-110m.json';

/**
 * Paints world landmasses onto an equirectangular canvas used as the
 * globe texture. Rings crossing the antimeridian are unwrapped and drawn
 * three times (−W, 0, +W) so nothing streaks; Antarctica is closed to the pole.
 */
export function createLandCanvas(ocean: string, landColor: string, width = 2048) {
  const W = width;
  const H = width / 2;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = landColor;

  const geo: any = feature(land as any, (land as any).objects.land);
  const polys: number[][][][] = [];
  for (const f of geo.features ?? [geo]) {
    const g = f.geometry;
    if (g.type === 'Polygon') polys.push(g.coordinates);
    else if (g.type === 'MultiPolygon') polys.push(...g.coordinates);
  }

  const px = (lng: number) => ((lng + 180) / 360) * W;
  const py = (lat: number) => ((90 - lat) / 180) * H;

  for (const poly of polys) {
    ctx.beginPath();
    for (const ring of poly) {
      // unwrap longitudes for continuity
      const pts: [number, number][] = [];
      let prev = ring[0][0];
      let offset = 0;
      for (const [lng, lat] of ring) {
        const d = lng - prev;
        if (d > 180) offset -= 360;
        else if (d < -180) offset += 360;
        prev = lng;
        pts.push([lng + offset, lat]);
      }
      const span = pts[pts.length - 1][0] - pts[0][0];
      if (Math.abs(span) > 300) {
        // ring wraps the globe (Antarctica): close via the south pole
        pts.push([pts[pts.length - 1][0], -90], [pts[0][0], -90]);
      }
      for (const shift of [-360, 0, 360]) {
        pts.forEach(([lng, lat], i) => {
          const x = px(lng + shift);
          const y = py(lat);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
      }
    }
    ctx.fill('evenodd');
  }
  return canvas;
}
