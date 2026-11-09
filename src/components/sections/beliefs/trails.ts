// Trail paths for the three belief sections (original drawings).
// viewBox is 1600 x 1000 per section; each trail ends where the next starts
// so the line reads as one continuous route down the page.

const toPath = (pts: [number, number][]) => 'M' + pts.map(([x, y]) => `${x} ${y}`).join(' L');

export const trails = [
  toPath([
    [800, 0], [804, 70], [776, 120], [838, 190], [790, 262], [846, 330], [772, 410], [828, 480],
    [760, 560], [812, 620], [700, 700], [784, 740], [660, 800], [742, 862], [690, 930], [704, 1000],
  ]),
  toPath([
    [704, 0], [664, 80], [742, 150], [690, 230], [780, 300], [720, 380], [812, 450], [760, 520],
    [850, 600], [780, 660], [902, 720], [838, 800], [930, 860], [872, 940], [890, 1000],
  ]),
  toPath([
    [890, 0], [846, 70], [910, 140], [836, 220], [902, 300], [820, 380], [880, 460], [800, 540],
    [866, 620], [790, 700], [850, 780], [800, 880], [820, 1000],
  ]),
];
