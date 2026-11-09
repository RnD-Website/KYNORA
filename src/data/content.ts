// All KYNORA copy and image paths live here so content can be edited
// without touching layout or animation code.

export const brand = {
  name: 'KYNORA',
  tagline: 'POWER YOUR EVERYDAY.',
  copyright: `© ${new Date().getFullYear()} KYNORA. All rights reserved`,
};

export const nav = {
  // Reference: "Cats" / "Dogs" mega menus
  primary: [
    {
      label: 'Supplements',
      items: [
        { label: 'Creatine', href: '#', image: '/images/product/kynora-tub-orange.webp' },
        { label: 'Protein', href: '#', image: '/images/product/kynora-tub-brown.webp' },
        { label: 'Collagen', href: '#', image: '/images/beliefs/belief-1.jpg' },
        { label: 'All', href: '#', image: '/images/beliefs/belief-2.jpg' },
      ],
    },
    {
      label: 'Wellness',
      items: [
        { label: 'Daily Vitamins', href: '#', image: '/images/beliefs/belief-2.jpg' },
        { label: 'Wellness', href: '#', image: '/images/product/kynora-tub-brown.webp' },
        { label: 'Bundles', href: '#', image: '/images/product/kynora-tub-orange.webp' },
        { label: 'All', href: '#', image: '/images/beliefs/belief-1.jpg' },
      ],
    },
  ],
  secondary: [
    { label: 'Mission', href: '#' },
    { label: 'Ambassadors', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  region: 'BD/EN',
};

export const hero = {
  label: 'Power your everyday',
  title: ['Trust your', 'strength'],
  copy: 'Clean nutrition that respects who you are — and who you’re becoming.',
  sky: '/images/hero/sky.jpg',
  products: {
    left: { image: '/images/product/kynora-tub-orange.webp', label: 'Explore creatine', href: '#' },
    right: { image: '/images/product/kynora-tub-brown.webp', label: 'Explore protein', href: '#' },
  },
};

export const scrollText = {
  label: 'Strong steady',
  text: 'Guided by science and crafted with care, KYNORA creates clean nutrition to fuel the strength and vitality of women, wherever their day may lead.',
  button: { label: 'Our mission', href: '#' },
  image: { src: '/images/story/lifestyle-steps.jpg', alt: 'Smiling woman in a sunlit gym leaning on a KYNORA creatine tub' },
  video: {
    src: '/videos/statement-loop.mp4',
    poster: '/videos/statement-loop-poster.jpg',
    alt: 'Smiling woman in a sunlit gym leaning on a KYNORA creatine tub',
  },
};

export const beliefs = {
  label: 'Build your own rhythm',
  title: ['The formula', 'we follow'],
  copy: 'When we move past outdated fitness myths, women feel stronger — in every way.',
  sections: [
    {
      number: 1,
      title: ['Pure strength', 'in motion'],
      heading: 'Creatine for muscle, focus, recovery — not hype',
      body: 'Real performance isn’t built on chalky blends and empty promises. We don’t make supplements that weigh you down. We make nutrition that moves with you.',
      image: { src: '/images/beliefs/belief-1.jpg', alt: 'Pile of creatine powder on a stone ledge beside an orange KYNORA tub' },
      theme: 'brown',
    },
    {
      number: 2,
      title: ['Sharpened by', 'clean energy'],
      heading: 'Balanced nutrients with zero fillers',
      body: 'Artificial sweeteners, fillers and proprietary blends are a quick hit of nothing. We don’t touch any of it. Only studied ingredients that support focus, strength, and steady energy.',
      image: { src: '/images/beliefs/belief-2.jpg', alt: 'Woman with a towel over her shoulder drinking a glass of water after a workout' },
      theme: 'cream',
    },
    {
      number: 3,
      title: ['Free to be', 'fiercely strong'],
      heading: 'Rooted in science & third-party tested',
      body: 'We studied women’s physiology for years to build our formulas, certified manufacturing and strict quality checks. A long process, for long-term health.',
      image: { src: '/images/beliefs/belief-3.jpg', alt: 'KYNORA creatine tub on a stone ledge with a woman relaxing behind it' },
      theme: 'orange',
    },
  ],
};

export const ambassadors = {
  label: 'Committed to change',
  title: ['Leading the way', 'side by side'],
  copy: 'Across the globe, women are breaking old habits for their health. We’re proud to introduce them.',
  button: { label: 'Our Ambassadors', href: '#' },
  // lat / lng in degrees
  markers: [
    { label: 'Meet Ayesha & Team Lift', lat: 23.81, lng: 90.41, icon: 'bolt' },
    { label: 'Meet Sofia, Lena & Mia', lat: 52.52, lng: 13.4, icon: 'leaf' },
    { label: 'Meet Maya Clarke', lat: 51.51, lng: -0.13, icon: 'bolt' },
    { label: 'Meet Ines & Run Club', lat: 38.72, lng: -9.14, icon: 'leaf' },
    { label: 'Meet Freja & Nora', lat: 59.33, lng: 18.07, icon: 'bolt' },
  ],
};

export const promo = {
  label: 'Let us help',
  title: 'Find your perfect formula',
  copy: 'Take a quick quiz and we will match you with the perfect supplements.',
  button: { label: 'Take the quiz', href: '#' },
  left: '/images/product/kynora-tub-orange.webp',
  right: '/images/product/kynora-tub-brown.webp',
};

export const footer = {
  columns: [
    { title: 'Supplements', links: ['Creatine', 'Protein', 'Collagen', 'All'] },
    { title: 'Wellness', links: ['Daily Vitamins', 'Wellness', 'Bundles', 'All'] },
    { title: 'Company', links: ['Mission', 'Ambassadors', 'Blog', 'Contact'] },
  ],
  wordmark: 'Power your everyday',
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
  ],
  socials: ['instagram', 'facebook', 'youtube'] as const,
};
