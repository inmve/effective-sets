// Stylised body map, front and back, in a 100 × 200 viewBox.
// Every muscle shape carries data-m="<muscle id from data/muscles.json>", so the art can be
// swapped for a better one without touching the volume maths.
// "l" shapes are the figure's left half and get mirrored; "c" shapes sit on the midline;
// "top" shapes are drawn last (over the others).

const SILHOUETTE = {
  c: [
    ["ellipse", { cx: 50, cy: 13, rx: 8, ry: 10 }],
    ["rect", { x: 45, y: 20, width: 10, height: 9 }],
    ["path", { d: "M34,32 Q50,27 66,32 L67,50 Q63,68 63,86 L37,86 Q37,68 33,50 Z" }],
    ["path", { d: "M37,84 L63,84 L65,98 L50,104 L35,98 Z" }],
  ],
  l: [
    ["ellipse", { cx: 28, cy: 52, rx: 6, ry: 17 }],
    ["ellipse", { cx: 25, cy: 80, rx: 5, ry: 13 }],
    ["ellipse", { cx: 23, cy: 98, rx: 4, ry: 5 }],
    ["path", { d: "M35,96 Q33,120 38,142 L48,142 Q50,120 50,102 Z" }],
    ["ellipse", { cx: 43, cy: 146, rx: 5, ry: 4 }],
    ["path", { d: "M38,150 Q36,168 40,188 L46,188 Q49,168 48,150 Z" }],
    ["ellipse", { cx: 43, cy: 192, rx: 5, ry: 3 }],
  ],
};

export const VIEWS = {
  front: {
    c: [
      ["upper_trap", "path", { d: "M45,27 L55,27 L62,32 L38,32 Z" }],
      ["abs_core", "rect", { x: 43, y: 54, width: 14, height: 30, rx: 3 }],
    ],
    l: [
      ["side_delts", "ellipse", { cx: 25, cy: 38, rx: 4, ry: 6 }],
      ["front_delts", "ellipse", { cx: 30, cy: 37, rx: 5, ry: 6 }],
      ["chest", "path", { d: "M49,33 L37,34 Q33,42 36,50 Q42,54 49,52 Z" }],
      ["brachialis", "ellipse", { cx: 24.5, cy: 58, rx: 2, ry: 6 }],
      ["biceps", "ellipse", { cx: 29, cy: 54, rx: 4, ry: 9 }],
      ["brachioradialis", "ellipse", { cx: 22.5, cy: 75, rx: 2.6, ry: 8 }],
      ["wrist_flexors", "ellipse", { cx: 26.5, cy: 81, rx: 3, ry: 11 }],
      ["finger_flexors", "ellipse", { cx: 23, cy: 98, rx: 4, ry: 5 }],
      ["abs_core", "path", { d: "M37,56 L42,56 L42,82 L38,80 Q37,68 37,56 Z" }],
      ["abductors", "ellipse", { cx: 36, cy: 96, rx: 2.5, ry: 7 }],
      ["hip_flexors", "path", { d: "M40,88 L48,90 L47,100 Z" }],
      ["quads", "path", { d: "M37,103 Q35,122 39,140 L46,140 Q48,122 47,106 Z" }],
      ["adductors", "path", { d: "M48,104 Q50,116 48,128 L46.5,126 Q46,114 46.5,104 Z" }],
      ["calves", "ellipse", { cx: 41, cy: 164, rx: 3, ry: 11 }],
    ],
  },
  back: {
    c: [
      ["upper_trap", "path", { d: "M45,25 L55,25 L66,33 L56,38 L50,44 L44,38 L34,33 Z" }],
      ["lower_back", "path", { d: "M44,66 L50,68 L56,66 L57,86 L43,86 Z" }],
    ],
    l: [
      ["rear_delts", "ellipse", { cx: 29, cy: 37, rx: 6, ry: 6 }],
      ["lats", "path", { d: "M36,46 Q33,62 42,80 L49,75 Q46,60 45,47 Z" }],
      ["rotator_cuff", "ellipse", { cx: 39, cy: 43, rx: 5, ry: 4.5 }],
      ["triceps", "ellipse", { cx: 28, cy: 54, rx: 5, ry: 11 }],
      ["wrist_finger_extensors", "ellipse", { cx: 25, cy: 80, rx: 4, ry: 12 }],
      ["abductors", "ellipse", { cx: 37, cy: 90, rx: 4, ry: 5 }],
      ["glutes", "ellipse", { cx: 43, cy: 98, rx: 7.5, ry: 8 }],
      ["hamstrings", "path", { d: "M37,108 Q36,124 40,140 L48,140 Q49,124 49,108 Z" }],
      ["calves", "ellipse", { cx: 42.5, cy: 162, rx: 5, ry: 12 }],
    ],
    top: [
      ["mid_lower_trap", "path", { d: "M44,38 L50,44 L56,38 L58,44 L50,66 L42,44 Z" }],
    ],
  },
};

const NS = "http://www.w3.org/2000/svg";
const MIRROR = "translate(100,0) scale(-1,1)";
function el(tag, attrs, parent) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  parent.appendChild(n);
  return n;
}

/** Draw one view into an <svg viewBox="0 0 100 200">. fill(id) -> CSS colour, label(id) -> tooltip. */
export function drawBody(svg, view, { fill, label }) {
  svg.replaceChildren();
  const spec = VIEWS[view];
  const sil = el("g", { fill: "var(--body)" }, svg);
  SILHOUETTE.c.forEach(([tag, a]) => el(tag, a, sil));
  for (const g of [el("g", {}, sil), el("g", { transform: MIRROR }, sil)])
    SILHOUETTE.l.forEach(([tag, a]) => el(tag, a, g));
  const shape = (parent) => ([m, tag, a]) => {
    const n = el(tag, { ...a, fill: fill(m), stroke: "var(--card)", "stroke-width": 0.6, "data-m": m }, parent);
    el("title", {}, n).textContent = label(m);
  };
  spec.c.forEach(shape(svg));
  for (const g of [el("g", {}, svg), el("g", { transform: MIRROR }, svg)]) spec.l.forEach(shape(g));
  (spec.top ?? []).forEach(shape(svg));
}
