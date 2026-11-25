const ICON = (function () {
  const P = { ink: '#f5eeda', glow: '#ffd35c', soft: '#aab7d6', green: '#58a56b', dgreen: '#2f6b4b', wood: '#8a6542', dwood: '#4a3423', red: '#d9667a', blue: '#6f8be0', pale: '#9fb0d0', dark: '#0a1226', bg: '#0f1a36' };
  function wrap(inner) { return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="31" fill="${P.bg}"/>${inner}</svg>`; }
  function f(n) { return (Math.round(n * 10) / 10).toString(); }
  function star(cx, cy, R, fill) {
    let pts = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.45 : R; pts += f(cx + Math.cos(a) * r) + ',' + f(cy + Math.sin(a) * r) + ' '; }
    return `<polygon points="${pts}" fill="${fill}"/>`;
  }
  function flake(cx, cy, r) {
    let d = '';
    for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3, x = Math.cos(a) * r, y = Math.sin(a) * r; d += `M${f(cx - x)},${f(cy - y)} L${f(cx + x)},${f(cy + y)} `; }
    return `<path d="${d}" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="2" fill="${P.ink}"/>`;
  }
  function person(x, top, bottom) {
    return `<circle cx="${x}" cy="${top + 5}" r="5.2" fill="${P.ink}"/><rect x="${x - 6}" y="${top + 11}" width="12" height="${bottom - top - 11}" rx="5" fill="${P.ink}"/>`;
  }
  function fly(x, y) { return `<circle cx="${x}" cy="${y}" r="8" fill="${P.glow}" opacity="0.2"/><circle cx="${x}" cy="${y}" r="3" fill="${P.glow}"/>`; }
  function foot(x, y, rot) {
    return `<g transform="rotate(${rot} ${x} ${y})" fill="${P.ink}"><ellipse cx="${x}" cy="${y + 3}" rx="6" ry="9"/><circle cx="${x - 5}" cy="${y - 9}" r="2"/><circle cx="${x}" cy="${y - 11}" r="2.2"/><circle cx="${x + 5}" cy="${y - 9}" r="2"/></g>`;
  }
  function stone(fill, extra) { return `<ellipse cx="32" cy="42" rx="24" ry="4" fill="#060a16"/><ellipse cx="32" cy="34" rx="23" ry="13" fill="${fill}"${extra || ''}/>`; }
  function glyph(t) { const n = t.length, fs = n > 3 ? 19 : n > 2 ? 23 : n > 1 ? 28 : 34; return `<text x="32" y="${f(32 + fs * 0.35)}" text-anchor="middle" font-size="${fs}" fill="${P.glow}">${t}</text>`; }

  const D = {
    mushroom: () => `<rect x="26" y="34" width="12" height="18" rx="5" fill="${P.ink}"/><path d="M12,37 q20,-36 40,0 z" fill="${P.red}"/><circle cx="24" cy="28" r="3" fill="${P.ink}"/><circle cx="35" cy="21" r="3.4" fill="${P.ink}"/><circle cx="43" cy="30" r="2.4" fill="${P.ink}"/>`,
    egg: () => `<ellipse cx="32" cy="37" rx="15.5" ry="17" fill="${P.ink}"/><ellipse cx="32" cy="28" rx="12" ry="17" fill="${P.ink}"/><ellipse cx="26" cy="27" rx="3" ry="6" fill="#ffffff" opacity="0.7"/>`,
    acorn: () => `<path d="M20,32 q0,24 12,24 q12,0 12,-24 z" fill="#c59a55"/><path d="M16,34 q16,-22 32,0 z" fill="#6e5330"/><path d="M32,22 v-8" stroke="#6e5330" stroke-width="3.4" stroke-linecap="round"/>`,
    seed: () => `<path d="M32,9 q19,27 0,46 q-19,-19 0,-46 z" fill="#2c2f3a" stroke="${P.soft}" stroke-width="1.5"/><path d="M32,17 v31 M26,29 q2,9 3,17 M38,29 q-2,9 -3,17" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round" fill="none"/>`,
    fireflies: () => fly(20, 24) + fly(43, 19) + fly(33, 43),
    windows: () => `${star(14, 14, 3, P.ink)}${star(46, 10, 2.4, P.ink)}<path d="M5,48 h54" stroke="${P.soft}" stroke-width="1.5"/><g fill="#2c4079"><rect x="9" y="35" width="13" height="13"/><polygon points="7,36 15.5,27 24,36"/><rect x="26" y="29" width="13" height="19"/><polygon points="24,30 32.5,21 41,30"/><rect x="43" y="37" width="12" height="11"/><polygon points="41,38 49,30 57,38"/></g><g fill="${P.glow}"><rect x="13" y="39" width="4.5" height="4.5"/><rect x="29" y="33" width="3.5" height="3.5"/><rect x="34" y="40" width="3.5" height="3.5"/><rect x="47" y="40" width="4" height="4"/></g>`,
    stars: () => star(21, 25, 10, P.ink) + star(44, 19, 6.5, P.ink) + star(38, 44, 8, P.ink),
    snow: () => flake(22, 24, 11) + flake(43, 40, 9) + flake(45, 16, 5),
    reflection: () => person(32, 8, 33) + `<g transform="translate(0,68) scale(1,-1)" opacity="0.4">${person(32, 8, 33)}</g><path d="M8,34 h48" stroke="${P.blue}" stroke-width="2"/><path d="M12,42 h8 M44,46 h9 M14,52 h6" stroke="${P.blue}" stroke-width="1.6" stroke-linecap="round"/>`,
    footprints: () => foot(23, 43, -12) + foot(41, 24, 12),
    echo: () => `<circle cx="10" cy="20" r="5" fill="${P.ink}"/><path d="M19,13 q6,7 0,14 M26,10 q9,10 0,20 M33,7 q12,13 0,26" stroke="${P.ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/><rect x="52" y="6" width="6" height="52" rx="2" fill="${P.soft}"/><path d="M45,37 q-6,7 0,14 M38,34 q-9,10 0,20 M31,31 q-12,13 0,26" stroke="${P.glow}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.65"/>`,
    shadow: () => `<path d="M4,45 h56" stroke="${P.soft}" stroke-width="1" opacity="0.5"/><polygon points="35,45 47,45 22,59 3,59" fill="#02040a" stroke="${P.soft}" stroke-width="0.8" stroke-opacity="0.5"/>${person(41, 12, 45)}<circle cx="55" cy="22" r="8" fill="${P.glow}" opacity="0.22"/><circle cx="55" cy="22" r="3.4" fill="${P.glow}"/>`,
    net: () => {
      let dots = '';
      [[32, 40], [24, 32], [40, 32], [32, 24], [16, 24], [24, 16], [40, 48], [48, 40], [16, 40], [24, 48], [40, 16], [48, 24]].forEach(function (p) { dots += `<circle cx="${p[0]}" cy="${p[1]}" r="2.3" fill="${P.ink}"/>`; });
      return `<path d="M12,20 L44,52 M20,12 L52,44 M12,36 L28,52 M36,12 L52,28 M52,20 L20,52 M44,12 L12,44 M52,36 L36,52 M28,12 L12,28" stroke="${P.soft}" stroke-width="1.8"/>` + dots;
    },
    cocoon: () => `<path d="M9,15 q23,-7 46,2" stroke="${P.wood}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M32,13 v8" stroke="${P.ink}" stroke-width="1.4"/><ellipse cx="32" cy="38" rx="11" ry="18" fill="#e6dcb8"/><path d="M22,30 q10,5 20,0 M21,38 q11,5 22,0 M22,46 q10,5 20,0" stroke="#b3a67c" stroke-width="1.6" fill="none"/>`,
    web: () => {
      let d = '', rings = '';
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.26; d += `M32,32 L${f(32 + Math.cos(a) * 25)},${f(32 + Math.sin(a) * 25)} `; }
      [9, 17, 24].forEach(function (r) { let p = ''; for (let i = 0; i <= 6; i++) { const a = i * Math.PI / 3 + 0.26; p += (i ? 'L' : 'M') + f(32 + Math.cos(a) * r) + ',' + f(32 + Math.sin(a) * r) + ' '; } rings += p; });
      return `<path d="${d}${rings}" stroke="${P.ink}" stroke-width="1.5" fill="none"/><circle cx="32" cy="32" r="2.6" fill="${P.soft}"/>`;
    },
    cage: () => `<circle cx="32" cy="9" r="3" fill="none" stroke="${P.glow}" stroke-width="2"/><path d="M16,50 v-20 a16,16 0 0 1 32,0 v20" fill="none" stroke="${P.glow}" stroke-width="2.6"/><path d="M24,16.5 v33.5 M32,14 v36 M40,16.5 v33.5" stroke="${P.glow}" stroke-width="2"/><rect x="13" y="50" width="38" height="5" rx="2" fill="${P.glow}"/>`,
    rainbow: () => [[24, P.red], [19, P.glow], [14, P.green], [9, P.blue]].map(function (a) { return `<path d="M${32 - a[0]},46 a${a[0]},${a[0]} 0 0 1 ${a[0] * 2},0" stroke="${a[1]}" stroke-width="4.6" fill="none"/>`; }).join(''),
    boat: () => `<path d="M32,11 v27" stroke="${P.soft}" stroke-width="2"/><polygon points="34,13 34,36 50,36" fill="${P.ink}"/><polygon points="30,18 30,36 18,36" fill="${P.pale}"/><path d="M11,40 h42 l-7,10 h-28 z" fill="${P.wood}"/><path d="M8,55 q6,-4 12,0 t12,0 t12,0 t12,0" stroke="${P.blue}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    heron: () => `<path d="M28,40 v16 M33,40 v16" stroke="${P.soft}" stroke-width="1.8"/><ellipse cx="29" cy="34" rx="11" ry="7.5" fill="${P.soft}"/><path d="M37,31 q9,-6 3,-12 q-5,-5 2,-8" stroke="${P.soft}" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="43" cy="11" r="3.6" fill="${P.soft}"/><polygon points="45,9 58,12.5 45,13.5" fill="${P.glow}"/><circle cx="43.5" cy="10.5" r="1" fill="${P.dark}"/><path d="M12,57 h40" stroke="${P.blue}" stroke-width="2.2" stroke-linecap="round"/>`,
    bridge: () => `<path d="M8,26 Q32,4 56,26" stroke="${P.ink}" stroke-width="2.2" fill="none"/><path d="M14,36 v-14 M23,30 v-14 M32,28 v-15 M41,30 v-14 M50,36 v-14" stroke="${P.ink}" stroke-width="2.2"/><path d="M6,40 Q32,14 58,40 v7 Q32,24 6,47 z" fill="${P.ink}"/><path d="M16,52 h10 M34,55 h12 M24,58 h8" stroke="${P.blue}" stroke-width="2" stroke-linecap="round"/>`,
    'stone-gray': () => stone('#8b93a3'),
    'stone-white': () => stone('#f0eee6'),
    'stone-speckled': () => stone('#d9d5c8') + [[18, 32], [24, 27], [28, 37], [33, 30], [38, 39], [41, 28], [46, 34], [22, 39], [36, 24], [48, 30], [30, 43], [15, 36]].map(function (p) { return `<circle cx="${p[0]}" cy="${p[1]}" r="1.7" fill="#3b3f4c"/>`; }).join(''),
    'stone-black': () => stone('#14161d', ` stroke="#6b7186" stroke-width="1.6"`) + `<path d="M20,28 q8,-5 16,-4" stroke="#4a5062" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    bubble: () => `<circle cx="30" cy="34" r="19" fill="${P.blue}" fill-opacity="0.22" stroke="${P.ink}" stroke-width="2"/><path d="M19,27 q4,-7 11,-8" stroke="${P.ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="51" cy="14" r="4.5" fill="${P.blue}" fill-opacity="0.22" stroke="${P.ink}" stroke-width="1.6"/>`,
    star: () => star(32, 33, 21, P.ink),
    fish: () => `<polygon points="43,32 57,22 57,42" fill="${P.pale}"/><ellipse cx="29" cy="32" rx="18" ry="10" fill="${P.pale}"/><polygon points="26,23 34,14 38,24" fill="${P.pale}"/><circle cx="20" cy="30" r="2" fill="${P.dark}"/><path d="M30,27 q4,5 0,10" stroke="${P.dark}" stroke-width="1.4" fill="none" opacity="0.5"/>`,
    moon: () => `<circle cx="32" cy="32" r="26" fill="${P.ink}" opacity="0.12"/><circle cx="32" cy="32" r="19" fill="${P.ink}"/><circle cx="26" cy="27" r="3.6" fill="#d9d2bd"/><circle cx="38" cy="38" r="2.6" fill="#d9d2bd"/><circle cx="39" cy="24" r="1.8" fill="#d9d2bd"/>`,
    parrot: () => `<path d="M12,55 h40" stroke="${P.wood}" stroke-width="3.4" stroke-linecap="round"/><polygon points="24,46 20,60 30,52" fill="${P.blue}"/><ellipse cx="30" cy="39" rx="10" ry="15" fill="${P.green}"/><ellipse cx="26" cy="41" rx="5" ry="10" fill="${P.blue}"/><circle cx="33" cy="20" r="9.5" fill="${P.red}"/><path d="M40,16 q10,2 6,13 q-5,-2 -7,-5 z" fill="${P.glow}"/><circle cx="35" cy="18" r="2.6" fill="${P.ink}"/><circle cx="35.4" cy="18" r="1.3" fill="${P.dark}"/>`,
    bell: () => `<circle cx="32" cy="11" r="3.4" fill="none" stroke="${P.glow}" stroke-width="2.4"/><path d="M32,14 q15,3 15,24 l5,9 h-40 l5,-9 q0,-21 15,-24 z" fill="${P.glow}"/><path d="M22,40 h20" stroke="#b8902f" stroke-width="2"/><circle cx="32" cy="52" r="4" fill="#b8902f"/>`,
    cookie: () => `<circle cx="32" cy="32" r="20" fill="#c9955a"/>` + [[24, 24, 3], [38, 22, 2.6], [42, 34, 3], [30, 36, 2.8], [22, 38, 2.2], [35, 45, 2.6]].map(function (p) { return `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="#4a3423"/>`; }).join(''),
    secret: () => `<rect x="15" y="11" width="32" height="42" rx="4" fill="#6a59ad"/><path d="M22,11 v42" stroke="#4a3d85" stroke-width="2.4"/><rect x="38" y="28" width="14" height="8" rx="2" fill="#4a3d85"/><circle cx="50" cy="32" r="7" fill="${P.glow}"/><circle cx="50" cy="30.5" r="2" fill="${P.dark}"/><rect x="49" y="31" width="2" height="5" fill="${P.dark}"/>`,
    flame: () => `<circle cx="32" cy="22" r="17" fill="${P.glow}" opacity="0.16"/><rect x="26" y="36" width="12" height="19" rx="2" fill="${P.ink}"/><path d="M32,36 v-4" stroke="${P.dark}" stroke-width="1.6"/><path d="M32,8 q13,15 0,25 q-13,-10 0,-25 z" fill="${P.glow}"/><path d="M32,18 q6,8 0,14 q-6,-6 0,-14 z" fill="#fff3c4"/>`,
    balloon: () => `<path d="M32,47 q-6,6 0,12" stroke="${P.ink}" stroke-width="1.5" fill="none"/><ellipse cx="32" cy="26" rx="15" ry="18" fill="${P.red}"/><polygon points="29,43 35,43 32,48" fill="${P.red}"/><path d="M23,19 q2,-6 7,-8" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.7"/>`,
    suitcase: () => `<path d="M24,22 v-7 h16 v7" stroke="${P.soft}" stroke-width="3.4" fill="none" stroke-linejoin="round"/><rect x="9" y="22" width="46" height="29" rx="5" fill="${P.wood}"/><rect x="17" y="22" width="5" height="29" fill="${P.dwood}"/><rect x="42" y="22" width="5" height="29" fill="${P.dwood}"/><rect x="29" y="33" width="6" height="5" rx="1" fill="${P.glow}"/>`,
    mattress: () => `<rect x="6" y="27" width="52" height="17" rx="7" fill="${P.ink}"/><path d="M8,40 h48" stroke="${P.pale}" stroke-width="2"/><path d="M16,28 v11 M26,27 v12 M36,27 v12 M46,28 v11" stroke="${P.blue}" stroke-width="2" opacity="0.6"/><rect x="11" y="44" width="5" height="6" fill="${P.wood}"/><rect x="48" y="44" width="5" height="6" fill="${P.wood}"/>`,
    blanket: () => `<rect x="11" y="16" width="42" height="32" rx="4" fill="#3a55a0"/><path d="M11,27 h42 M11,38 h42 M24,16 v32 M40,16 v32" stroke="${P.blue}" stroke-width="2.2"/><polygon points="53,48 37,48 53,32" fill="${P.blue}"/><path d="M14,48 v5 M20,48 v5 M26,48 v5 M32,48 v5" stroke="${P.blue}" stroke-width="1.8" stroke-linecap="round"/>`,
    pillow: () => `<path d="M11,22 q21,-7 42,0 q5,10 0,20 q-21,7 -42,0 q-5,-10 0,-20 z" fill="${P.ink}"/><path d="M19,27 q13,-4 26,0" stroke="#cfc8b3" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M11,22 l-4,-3 M53,22 l4,-3 M11,42 l-4,3 M53,42 l4,3" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/>`,
    book: () => `<path d="M32,20 q-12,-8 -24,-2 v30 q12,-6 24,2 z" fill="${P.ink}"/><path d="M32,20 q12,-8 24,-2 v30 q-12,-6 -24,2 z" fill="#e4dcc5"/><path d="M32,20 v30" stroke="${P.wood}" stroke-width="2"/><path d="M13,26 q8,-3 15,0 M13,33 q8,-3 15,0 M13,40 q8,-3 15,0 M36,26 q8,-3 15,0 M36,33 q8,-3 15,0 M36,40 q8,-3 15,0" stroke="${P.soft}" stroke-width="1.6" fill="none"/>`,
    drawing: () => `<rect x="11" y="9" width="40" height="46" rx="3" fill="${P.ink}"/><circle cx="23" cy="21" r="5" fill="${P.glow}"/><rect x="30" y="32" width="14" height="12" fill="${P.blue}"/><polygon points="27,33 37,23 47,33" fill="${P.red}"/><path d="M15,46 q18,-5 32,0" stroke="${P.green}" stroke-width="3" fill="none" stroke-linecap="round"/><g transform="rotate(-40 50 50)"><rect x="40" y="47" width="18" height="6" rx="1.5" fill="${P.red}"/><polygon points="40,47 34,50 40,53" fill="#e8b7a0"/></g>`,
    dream: () => `<circle cx="11" cy="55" r="2.6" fill="${P.ink}"/><circle cx="18" cy="48" r="4.2" fill="${P.ink}"/><g fill="${P.ink}"><circle cx="23" cy="28" r="10"/><circle cx="36" cy="22" r="13"/><circle cx="47" cy="30" r="9"/><rect x="16" y="26" width="38" height="14" rx="7"/></g><path d="M31,20 a8,8 0 1 0 8,11 a6.5,6.5 0 0 1 -8,-11 z" fill="${P.blue}"/>${star(45, 27, 4.4, '#e0a93a')}`,
    movie: () => `<rect x="7" y="13" width="50" height="34" rx="5" fill="${P.dark}" stroke="${P.ink}" stroke-width="2.6"/><polygon points="27,22 27,38 41,30" fill="${P.glow}"/><path d="M32,47 v6 M22,54 h20" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/>`,
    breath: () => `<path d="M9,23 h26 q10,0 10,-7 q0,-6 -6,-6 M9,33 h37 q10,0 10,7 q0,6 -7,6 M9,43 h17 q7,0 7,6" stroke="${P.ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
    heartbeat: () => `<path d="M32,53 q-23,-15 -23,-30 a11.5,11.5 0 0 1 23,-4 a11.5,11.5 0 0 1 23,4 q0,15 -23,30 z" fill="${P.red}"/><path d="M6,34 h14 l4,-9 l6,18 l5,-12 l3,3 h20" stroke="${P.ink}" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`,
    yawn: () => `<circle cx="32" cy="32" r="21" fill="${P.glow}"/><path d="M19,26 q4.5,-5 9,0 M36,26 q4.5,-5 9,0" stroke="${P.dark}" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="32" cy="41" rx="7.5" ry="9" fill="${P.dark}"/><ellipse cx="32" cy="46" rx="4.5" ry="3" fill="${P.red}"/>`,
    blink: () => `<path d="M10,22 q22,-18 44,0 q-22,18 -44,0 z" fill="${P.ink}"/><circle cx="32" cy="22" r="7" fill="${P.blue}"/><circle cx="32" cy="22" r="3" fill="${P.dark}"/><path d="M10,43 q22,13 44,0" stroke="${P.ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M19,49 l-2,5 M32,51 v6 M45,49 l2,5" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/>`,
    comb: () => `<rect x="10" y="16" width="44" height="12" rx="4" fill="${P.glow}"/><path d="M14,28 v22 M20,28 v22 M26,28 v22 M32,28 v22 M38,28 v22 M44,28 v22 M50,28 v22" stroke="${P.glow}" stroke-width="3" stroke-linecap="round"/>`,
    key: () => `<circle cx="20" cy="32" r="9" fill="none" stroke="${P.glow}" stroke-width="5"/><rect x="28" y="29.5" width="28" height="5" rx="2" fill="${P.glow}"/><rect x="43" y="34" width="4.5" height="9" fill="${P.glow}"/><rect x="50.5" y="34" width="4.5" height="7" fill="${P.glow}"/>`,
    clock: () => `<circle cx="32" cy="32" r="22" fill="${P.ink}" stroke="${P.soft}" stroke-width="3"/><path d="M32,13 v4 M32,47 v4 M13,32 h4 M47,32 h4" stroke="${P.dark}" stroke-width="2"/><path d="M32,32 V19 M32,32 L41,37" stroke="${P.dark}" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="32" r="2.4" fill="${P.red}"/>`,
    sundial: () => `<ellipse cx="32" cy="42" rx="25" ry="11" fill="${P.soft}"/><ellipse cx="32" cy="40" rx="25" ry="11" fill="${P.ink}"/><polygon points="32,40 14,46 10,41" fill="#3b3f4c" opacity="0.7"/><polygon points="32,40 32,14 46,42" fill="${P.wood}"/><path d="M12,38 h3 M49,38 h3 M32,49 v-3 M20,46 l2,-2 M44,46 l-2,-2" stroke="${P.dark}" stroke-width="1.6"/>`,
    glasses: () => `<circle cx="20" cy="34" r="10" fill="${P.blue}" fill-opacity="0.25" stroke="${P.ink}" stroke-width="3"/><circle cx="44" cy="34" r="10" fill="${P.blue}" fill-opacity="0.25" stroke="${P.ink}" stroke-width="3"/><path d="M29,31 q3,-4 6,0 M10,32 l-5,-6 M54,32 l5,-6" stroke="${P.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    snail: () => `<path d="M8,48 h40 q8,0 8,-12" stroke="${P.pale}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M54,34 l2,-9 M58,36 l5,-7" stroke="${P.pale}" stroke-width="2" stroke-linecap="round"/><circle cx="28" cy="32" r="14" fill="${P.wood}"/><path d="M28,32 m0,-9 a9,9 0 1 1 -9,9 a5,5 0 1 1 5,5" stroke="${P.dwood}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    rose: () => `<path d="M32,34 q-3,12 0,24" stroke="${P.green}" stroke-width="3" fill="none"/><path d="M31,46 q-10,-2 -12,-8 q9,-1 12,8 z" fill="${P.green}"/><path d="M33,42 l5,-2 M30,52 l-5,-1" stroke="${P.green}" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="23" r="13" fill="${P.red}"/><path d="M32,23 m0,-7 a7,7 0 1 1 -7,7 a4,4 0 1 1 4,4" stroke="#a83d52" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    turtle: () => `<ellipse cx="18" cy="46" rx="6" ry="3.4" fill="${P.green}"/><ellipse cx="42" cy="46" rx="6" ry="3.4" fill="${P.green}"/><ellipse cx="53" cy="37" rx="7" ry="5" fill="${P.green}"/><circle cx="55.5" cy="35.5" r="1.2" fill="${P.dark}"/><path d="M8,44 q22,-38 44,0 z" fill="${P.dgreen}"/><path d="M20,36 l8,8 M30,25 v19 M40,36 l-8,8" stroke="#1d3f30" stroke-width="1.8"/><path d="M8,44 l-4,2" stroke="${P.green}" stroke-width="2.4" stroke-linecap="round"/>`,
    frog: () => `<ellipse cx="14" cy="46" rx="9" ry="4" fill="${P.dgreen}"/><ellipse cx="50" cy="46" rx="9" ry="4" fill="${P.dgreen}"/><ellipse cx="32" cy="38" rx="19" ry="13" fill="${P.green}"/><circle cx="22" cy="23" r="7" fill="${P.green}"/><circle cx="42" cy="23" r="7" fill="${P.green}"/><circle cx="22" cy="23" r="3" fill="${P.dark}"/><circle cx="42" cy="23" r="3" fill="${P.dark}"/><path d="M21,40 q11,7 22,0" stroke="${P.dgreen}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    butterfly: () => `<ellipse cx="20" cy="24" rx="12" ry="11" fill="${P.blue}"/><ellipse cx="44" cy="24" rx="12" ry="11" fill="${P.blue}"/><ellipse cx="22" cy="42" rx="9" ry="8" fill="${P.red}"/><ellipse cx="42" cy="42" rx="9" ry="8" fill="${P.red}"/><circle cx="19" cy="23" r="3.4" fill="${P.ink}"/><circle cx="45" cy="23" r="3.4" fill="${P.ink}"/><rect x="30" y="18" width="4" height="30" rx="2" fill="${P.dark}" stroke="${P.soft}" stroke-width="0.8"/><path d="M31,18 q-3,-7 -7,-8 M33,18 q3,-7 7,-8" stroke="${P.soft}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
    drop: () => `<path d="M32,9 q17,23 17,33 a17,17 0 0 1 -34,0 q0,-10 17,-33 z" fill="${P.blue}"/><path d="M24,40 q0,7 6,10" stroke="#ffffff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.7"/>`,
    roots: () => `<rect x="24" y="6" width="16" height="16" fill="${P.wood}"/><path d="M4,22 h56" stroke="${P.green}" stroke-width="3"/><path d="M28,22 q-2,14 -14,20 M30,22 q0,18 -6,34 M34,22 q2,16 8,32 M36,22 q4,12 16,18 M22,36 l-8,10 M40,40 l8,10" stroke="${P.wood}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    worm: () => `<path d="M10,44 q8,-16 16,0 q8,14 16,-2 q4,-9 10,-10" stroke="#e0a595" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="52" cy="31" r="1.6" fill="${P.dark}"/>`,
    carrot: () => `<path d="M30,22 q-8,-12 -14,-12 M32,22 q0,-14 2,-16 M34,22 q8,-12 14,-10" stroke="${P.green}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M21,22 q11,-6 22,0 q-3,24 -11,36 q-8,-12 -11,-36 z" fill="#e58a3a"/><path d="M26,30 h7 M30,39 h6 M29,47 h5" stroke="#b9661f" stroke-width="1.8" stroke-linecap="round"/>`,
    tunnel: () => `<path d="M4,52 q28,-58 56,0 z" fill="${P.soft}"/><path d="M19,52 q0,-26 13,-26 q13,0 13,26 z" fill="#03050a"/><path d="M4,52 h56" stroke="${P.dgreen}" stroke-width="3"/><path d="M32,52 v-5 M32,43 v-4" stroke="${P.glow}" stroke-width="2" stroke-linecap="round"/>`,
    kite: () => `<polygon points="34,6 50,24 34,44 20,24" fill="${P.red}"/><path d="M34,6 v38 M20,24 h30" stroke="${P.ink}" stroke-width="1.6"/><path d="M34,44 q-10,4 -6,10 q4,5 -6,6" stroke="${P.ink}" stroke-width="1.6" fill="none"/><polygon points="26,49 31,47 30,53" fill="${P.glow}"/><polygon points="23,57 28,56 26,61" fill="${P.blue}"/>`,
    cloud: () => `<g fill="${P.ink}"><circle cx="20" cy="36" r="11"/><circle cx="33" cy="27" r="14"/><circle cx="46" cy="36" r="10"/><rect x="12" y="34" width="42" height="14" rx="7"/></g>`,
    ice: () => `<polygon points="32,10 52,20 32,30 12,20" fill="#e3f4fb"/><polygon points="12,20 32,30 32,54 12,44" fill="#9fd0e6"/><polygon points="52,20 32,30 32,54 52,44" fill="#c2e4f2"/><path d="M18,26 l8,4 M38,36 l8,-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>`,
    sled: () => `<path d="M10,46 h36 q10,0 10,-10" stroke="${P.wood}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M18,46 v-12 M40,46 v-12" stroke="${P.wood}" stroke-width="3"/><rect x="12" y="28" width="34" height="7" rx="3" fill="${P.red}"/><path d="M52,34 q6,-8 8,-16" stroke="${P.ink}" stroke-width="1.6" fill="none"/>`,
    scale: () => `<rect x="30" y="16" width="4" height="34" fill="${P.glow}"/><rect x="20" y="50" width="24" height="5" rx="2" fill="${P.glow}"/><path d="M12,18 h40" stroke="${P.glow}" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="16" r="4" fill="${P.glow}"/><path d="M14,18 l-7,16 M14,18 l7,16 M50,18 l-7,16 M50,18 l7,16" stroke="${P.soft}" stroke-width="1.4"/><path d="M5,34 h18 q-2,8 -9,8 q-7,0 -9,-8 z" fill="${P.ink}"/><path d="M41,34 h18 q-2,8 -9,8 q-7,0 -9,-8 z" fill="${P.ink}"/>`,
    umbrella: () => `<path d="M32,26 v24 q0,7 -6,7 q-5,0 -5,-5" stroke="${P.wood}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M6,30 q26,-44 52,0 q-4.5,-5 -8.7,0 q-4.3,-5 -8.6,0 q-4.4,-5 -8.7,0 q-4.3,-5 -8.6,0 q-4.4,-5 -8.7,0 q-4.2,-5 -8.7,0 z" fill="${P.red}"/><path d="M32,6 v4" stroke="${P.wood}" stroke-width="3" stroke-linecap="round"/>`,
    smile: () => `<circle cx="32" cy="32" r="21" fill="${P.glow}"/><circle cx="24" cy="27" r="3" fill="${P.dark}"/><circle cx="40" cy="27" r="3" fill="${P.dark}"/><path d="M20,36 q12,13 24,0" stroke="${P.dark}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
    hourglass: () => `<rect x="14" y="8" width="36" height="6" rx="2" fill="${P.wood}"/><rect x="14" y="50" width="36" height="6" rx="2" fill="${P.wood}"/><path d="M19,14 h26 q0,12 -11,18 q11,6 11,18 h-26 q0,-12 11,-18 q-11,-6 -11,-18 z" fill="${P.blue}" fill-opacity="0.2" stroke="${P.ink}" stroke-width="2"/><path d="M24,22 h16 q-3,6 -8,9 q-5,-3 -8,-9 z" fill="${P.glow}"/><path d="M21,50 q2,-9 11,-11 q9,2 11,11 z" fill="${P.glow}"/><path d="M32,31 v8" stroke="${P.glow}" stroke-width="1.6"/>`,
    cake: () => `<path d="M22,26 v-9 M32,26 v-9 M42,26 v-9" stroke="${P.ink}" stroke-width="3"/><circle cx="22" cy="13" r="3" fill="${P.glow}"/><circle cx="32" cy="13" r="3" fill="${P.glow}"/><circle cx="42" cy="13" r="3" fill="${P.glow}"/><rect x="12" y="26" width="40" height="26" rx="4" fill="#e7b7c4"/><path d="M12,34 q5,6 10,0 t10,0 t10,0 t10,0 v-4 q0,-4 -4,-4 h-32 q-4,0 -4,4 z" fill="${P.ink}"/><rect x="8" y="52" width="48" height="4" rx="2" fill="${P.soft}"/>`,
    coin: () => `<circle cx="32" cy="32" r="21" fill="${P.soft}"/><circle cx="32" cy="32" r="21" fill="none" stroke="${P.ink}" stroke-width="3"/><path d="M36,20 a13,13 0 1 0 6,22 a10,10 0 0 1 -6,-22 z" fill="${P.ink}"/>`,
    bookmark: () => `<rect x="10" y="10" width="34" height="42" rx="3" fill="#3a55a0"/><path d="M14,18 h22 M14,25 h22 M14,32 h16" stroke="${P.blue}" stroke-width="2"/><polygon points="34,6 46,6 46,58 40,51 34,58" fill="${P.red}"/>`,
    pencil: () => `<g transform="rotate(40 32 32)"><rect x="26" y="6" width="12" height="9" rx="3" fill="#e7a0b0"/><rect x="26" y="14" width="12" height="4" fill="${P.soft}"/><rect x="26" y="18" width="12" height="28" fill="${P.glow}"/><polygon points="26,46 38,46 32,58" fill="#e8c9a0"/><polygon points="29.5,53 34.5,53 32,58" fill="${P.dark}"/></g>`,
    note: () => `<path d="M24,44 V14 l24,-5 v30" stroke="${P.ink}" stroke-width="3.4" fill="none" stroke-linejoin="round"/><path d="M24,22 l24,-5" stroke="${P.ink}" stroke-width="4"/><ellipse cx="18" cy="46" rx="8" ry="6" fill="${P.ink}"/><ellipse cx="42" cy="41" rx="8" ry="6" fill="${P.ink}"/>`,
    ladder: () => `<path d="M22,58 L28,6 M44,58 L38,6" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="M23.5,48 h19 M24.8,37 h16.4 M26,26 h14 M27.2,15 h11.6" stroke="${P.glow}" stroke-width="3" stroke-linecap="round"/>`,
    friend: () => `<circle cx="22" cy="24" r="7" fill="${P.ink}"/><rect x="13" y="33" width="18" height="22" rx="8" fill="${P.ink}"/><circle cx="42" cy="24" r="7" fill="${P.glow}"/><rect x="33" y="33" width="18" height="22" rx="8" fill="${P.glow}"/><path d="M32,14 q-6,-5 -6,-9 a3.2,3.2 0 0 1 6,-1.5 a3.2,3.2 0 0 1 6,1.5 q0,4 -6,9 z" fill="${P.red}"/>`,
    unknown: () => `<text x="32" y="44" text-anchor="middle" font-size="34" fill="${P.soft}">?</text>`
  };
  const GEMS = { red: '#d9667a', blue: '#6f8be0', green: '#58a56b', gold: '#ffd35c', white: '#f0eee6', purple: '#9a86e0' };
  function gem(c) {
    const col = GEMS[c] || GEMS.white;
    return `<polygon points="20,14 44,14 54,28 32,54 10,28" fill="${col}"/><polygon points="20,14 44,14 38,28 26,28" fill="#ffffff" opacity="0.35"/><path d="M10,28 h44 M26,28 L32,54 L38,28" stroke="${P.dark}" stroke-width="1.2" opacity="0.45" fill="none"/>`;
  }

  const OPTIONS = {
    woods: ['mushroom', 'egg', 'acorn', 'seed'],
    hill: ['fireflies', 'windows', 'stars', 'snow'],
    log: ['reflection', 'footprints', 'echo', 'shadow'],
    web: ['net', 'cocoon', 'web', 'cage'],
    stream: ['rainbow', 'boat', 'heron', 'bridge'],
    stones: ['stone-gray', 'stone-white', 'stone-speckled', 'stone-black'],
    raft: ['bubble', 'star', 'fish', 'moon'],
    otter: ['num:5', 'num:8', 'num:10', 'num:12'],
    door: ['num:10', 'num:12', 'num:18', 'num:15'],
    stump: ['let:G', 'let:N', 'let:O', 'let:R'],
    well: ['parrot', 'shadow', 'bell', 'echo'],
    tree: ['cookie', 'secret', 'flame', 'balloon'],
    puff: ['suitcase', 'mattress', 'blanket', 'pillow'],
    leaf: ['book', 'drawing', 'dream', 'movie'],
    home: ['breath', 'heartbeat', 'yawn', 'blink']
  };

  function draw(key) {
    if (key.indexOf('num:') === 0 || key.indexOf('let:') === 0 || key.indexOf('txt:') === 0) return wrap(glyph(key.slice(4)));
    if (key.indexOf('gem:') === 0) return wrap(gem(key.slice(4)));
    return wrap((D[key] || D.unknown)());
  }
  return {
    draw: draw,
    option: function (id, i) { return draw((OPTIONS[id] || [])[i] || 'unknown'); },
    map: OPTIONS,
    has: function (key) { return !!D[key] || /^(num|let|txt|gem):/.test(key); },
    place: function (key, x, y, size) { return draw(key).replace('<svg ', '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" '); },
    keys: Object.keys(D)
  };
})();
