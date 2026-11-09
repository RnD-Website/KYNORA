# KYNORA image slots & Magnific prompts

Every image in the layout is a plain file in `public/images/`. Replace a file with one of the
**same name, aspect ratio and orientation** and the site updates with no code changes.
Upload `KYNORA tub reference` (the orange creatine tub photo) as an image reference for every
prompt that shows product, so packaging stays consistent.

Palette for art direction: Orange #E66A32 · Cream #F4E9D9 · Beige #B58A6C · Brown #57382B · Black #171515.

## Current status

| File | Size | Status |
|---|---|---|
| `product/kynora-tub-orange.webp` | 702×766, transparent | ✅ Cut out from supplied tub photo |
| `product/kynora-tub-brown.webp` | 702×766, transparent | ⚠️ Recoloured from tub photo (label still reads "Creatine") — replace with a real Protein/Collagen tub cut-out |
| `story/lifestyle-steps.jpg` | 1440×960 (3:2) | ⚠️ Interim: supplied tub photo — replace with lifestyle shot |
| `beliefs/belief-1.jpg` | 724×724 | ✅ Crop of supplied photo (powder) |
| `beliefs/belief-2.jpg` | 724×724 | ✅ Crop of supplied photo (orange slice) |
| `beliefs/belief-3.jpg` | 1600×1067 (3:2) | ❌ Placeholder graphic — replace |
| `hero/sky.jpg` | 1280×1490 (portrait) | ✅ Generated gradient sky |

Hero hills, stone pedestal, grass and birds are SVG (code), so they stay crisp and animate.

## Prompts

### 1. `story/lifestyle-steps.jpg` — 3:2, landscape, full-bleed sticky photo
Reference purpose: woman walking down wide stone city steps, full body, mid-frame, lots of architecture.
> A confident woman in a cream athletic set walking down wide pale stone steps outside a modern building in warm late-afternoon sun, holding an orange KYNORA supplement shaker, full body in the centre third of the frame, soft shadows, warm beige and terracotta tones, editorial lifestyle photography.

### 2. `beliefs/belief-3.jpg` — 3:2, landscape, expands to full screen
Reference purpose: runner on an urban path, shot from above at an angle, greenery in foreground.
> Woman jogging along a sunlit urban riverside path seen from a slightly elevated angle, dark athletic leggings and a burnt-orange top, ornamental grasses in the foreground, warm golden light, motion and energy, editorial sports photography.

### 3. `product/kynora-tub-brown.webp` — product family tub, transparent PNG/WebP
> The same KYNORA supplement tub as the reference but in deep brown (#57382B) with a cream lid band, label reads "KYNORA Whey Protein, Vanilla", white typography, front-facing product shot, plain background. → then run **Remove background**.

### 4. Optional — `beliefs/belief-1.jpg` & `belief-2.jpg` (square, 1:1)
1. > Close-up of a scoop of fine white creatine powder spilling onto a warm sandstone surface, an orange KYNORA tub edge in soft focus, warm natural light.
2. > A woman's hand holding a halved orange next to a KYNORA tub on a stone ledge, leaves, warm sunlight, shallow depth of field.

## Recommended settings
Model: Google Nano Banana 2.1 (Magnific default), 2k resolution, aspect ratio as listed.
Export JPG at quality ~85 for photos; WebP with alpha for product cut-outs.
