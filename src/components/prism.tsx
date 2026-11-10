/**
 * Hero art: the POLYX mark rebuilt as a faceted gem. Each of the six sectors is
 * subdivided into a triangle lattice and lit from the upper left, so the X
 * reads as depth rather than a flat icon.
 */
const N = 6;
const R = 200;
const C = { x: 240, y: 240 };
const V = Array.from({ length: 6 }, (_, k) => {
  const a = ((-90 + 60 * k) * Math.PI) / 180;
  return { x: C.x + R * Math.cos(a), y: C.y + R * Math.sin(a) };
});

function rnd(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type Tri = { d: string; fill: string; o: string; anim: boolean; delay: number };

const SECTOR_FILL = ["#C8FF4D", "#F3F4F1", "#7D6BFF", "#C8FF4D", "#F3F4F1", "#7D6BFF"];

const TRIS: Tri[] = (() => {
  const out: Tri[] = [];
  let seed = 1;
  for (let k = 0; k < 6; k++) {
    const A = V[k];
    const B = V[(k + 1) % 6];
    const P = (i: number, j: number) => ({
      x: C.x + (i / N) * (A.x - C.x) + (j / N) * (B.x - C.x),
      y: C.y + (i / N) * (A.y - C.y) + (j / N) * (B.y - C.y),
    });
    const push = (p: { x: number; y: number }[]) => {
      seed++;
      const cx = (p[0].x + p[1].x + p[2].x) / 3;
      const cy = (p[0].y + p[1].y + p[2].y) / 3;
      const dist = Math.hypot(cx - C.x, cy - C.y) / R;
      // light from upper left
      const light = 0.5 + 0.5 * (-(cx - C.x) * 0.6 - (cy - C.y) * 0.8) / R;
      const accent = k % 3 !== 1;
      const base = accent ? 0.18 + 0.62 * (1 - dist) : 0.03 + 0.1 * (1 - dist);
      const o = Math.max(0.03, Math.min(0.95, base * (0.55 + 0.6 * light) + (rnd(seed) - 0.5) * 0.14));
      out.push({
        d: `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}L${p[1].x.toFixed(1)} ${p[1].y.toFixed(1)}L${p[2].x.toFixed(1)} ${p[2].y.toFixed(1)}Z`,
        fill: SECTOR_FILL[k],
        o: o.toFixed(2),
        anim: Math.round(rnd(seed * 7) * 100) > 84,
        delay: Math.round(rnd(seed * 3) * 50) / 10,
      });
    };
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N - i; j++) {
        push([P(i, j), P(i + 1, j), P(i, j + 1)]);
        if (i + j + 1 < N) push([P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)]);
      }
    }
  }
  return out;
})();

export function Prism({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 480" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="pglow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#C8FF4D" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#7D6BFF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#08090B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="240" cy="240" r="240" fill="url(#pglow)" />
      <g className="spin-slow" style={{ transformOrigin: "240px 240px" }}>
        <circle cx="240" cy="240" r="226" fill="none" stroke="#fff" strokeOpacity=".08" strokeDasharray="2 7" />
        <circle cx="240" cy="14" r="3" fill="#C8FF4D" />
        <circle cx="44" cy="353" r="2.2" fill="#7D6BFF" />
      </g>
      <g className="float">
        {TRIS.map((t, i) => (
          <path
            key={i}
            d={t.d}
            fill={t.fill}
            fillOpacity={t.o}
            stroke="#08090B"
            strokeWidth="1.4"
            strokeLinejoin="round"
            className={t.anim ? "facet" : undefined}
            style={t.anim ? { animationDelay: `${t.delay.toFixed(2)}s` } : undefined}
          />
        ))}
        <path
          d={`M${V.map((v) => `${v.x.toFixed(1)} ${v.y.toFixed(1)}`).join("L")}Z`}
          fill="none"
          stroke="#fff"
          strokeOpacity=".14"
        />
      </g>
    </svg>
  );
}
