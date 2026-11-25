const ART = (function () {
  const C = {
    sky1: '#0a1330', sky2: '#27447f', far: '#182b55', mid: '#101d3c', near: '#070d1c',
    ink: '#f5eeda', glow: '#ffd35c', water1: '#16305c', water2: '#0c1a38',
    green: '#2f6b4b', wood: '#5a3d25', ella: '#9fb0d0', ellaDark: '#8193b9', sharky: '#6fa6ad'
  };
  let uid = 0;
  function rng(seed) { let s = seed; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function f(n) { return (Math.round(n * 10) / 10).toString(); }

  function stars(n, seed, x0, y0, w, h) {
    const r = rng(seed); let o = '';
    for (let i = 0; i < n; i++) {
      o += `<circle cx="${f(x0 + r() * w)}" cy="${f(y0 + r() * h)}" r="${f(0.5 + r() * 1.1)}" fill="${C.ink}" opacity="${f(0.3 + r() * 0.6)}"/>`;
    }
    return o;
  }
  function moon(x, y, r) {
    return `<circle cx="${x}" cy="${y}" r="${r * 2.1}" fill="${C.ink}" opacity="0.07"/><circle cx="${x}" cy="${y}" r="${r * 1.45}" fill="${C.ink}" opacity="0.1"/><circle cx="${x}" cy="${y}" r="${r}" fill="${C.ink}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.18}" fill="#d9d2bd"/><circle cx="${x + r * 0.25}" cy="${y + r * 0.3}" r="${r * 0.12}" fill="#d9d2bd"/>`;
  }
  // Blink the firefly. power 0..8 is how many riddles are solved.
  function blink(x, y, power) {
    const p = Math.max(0, Math.min(8, power || 0));
    const halo = 7 + p * 2.6, core = 2.4 + p * 0.28, op = 0.16 + p * 0.03;
    return `<g class="blink"><circle class="halo" cx="${x}" cy="${y}" r="${f(halo)}" fill="${C.glow}" opacity="${f(op)}"/><circle cx="${x}" cy="${y}" r="${f(halo * 0.5)}" fill="${C.glow}" opacity="${f(op + 0.12)}"/><circle cx="${x}" cy="${y}" r="${f(core)}" fill="${C.glow}"/><path d="M${x - 2},${y - 2} q-5,-6 -8,-1 M${x + 2},${y - 2} q5,-6 8,-1" stroke="${C.ink}" stroke-width="1" fill="none" opacity="0.55"/></g>`;
  }
  function elephant(x, y, s) {
    return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-13" y="8" width="8" height="12" rx="3" fill="${C.ellaDark}"/><rect x="6" y="8" width="8" height="12" rx="3" fill="${C.ellaDark}"/><ellipse cx="0" cy="2" rx="20" ry="14" fill="${C.ella}"/><circle cx="19" cy="-9" r="12" fill="${C.ella}"/><ellipse cx="11" cy="-11" rx="8" ry="11" fill="${C.ellaDark}"/><path d="M29,-6 q9,5 4,17" stroke="${C.ella}" stroke-width="5.5" stroke-linecap="round" fill="none"/><circle cx="23" cy="-11" r="1.6" fill="${C.near}"/><path d="M-20,0 q-5,2 -4,8" stroke="${C.ellaDark}" stroke-width="2" stroke-linecap="round" fill="none"/></g>`;
  }
  function shark(x, y, s) {
    return `<g transform="translate(${x},${y}) scale(${s})"><polygon points="-20,0 -36,-11 -33,9" fill="${C.sharky}"/><polygon points="-3,-9 6,-23 11,-8" fill="${C.sharky}"/><path d="M-24,0 q22,-18 48,0 q-24,13 -48,0 z" fill="${C.sharky}"/><path d="M-14,4 q14,7 34,-3 q-18,10 -34,3 z" fill="#d6e6e6"/><circle cx="14" cy="-3" r="1.7" fill="${C.near}"/><path d="M12,3 q5,2 9,-2" stroke="${C.near}" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>`;
  }
  function pine(x, base, h, fill) {
    return `<rect x="${x - 3}" y="${base - h * 0.3}" width="6" height="${h * 0.3}" fill="${fill}"/><polygon points="${x},${base - h} ${x - h * 0.24},${base - h * 0.25} ${x + h * 0.24},${base - h * 0.25}" fill="${fill}"/>`;
  }
  function water(y) {
    let lines = ''; const r = rng(31 + y);
    for (let i = 0; i < 14; i++) {
      const x = r() * 380, yy = y + 12 + r() * (250 - y), w = 10 + r() * 26;
      lines += `<path d="M${f(x)},${f(yy)} h${f(w)}" stroke="${C.ink}" stroke-width="1" opacity="${f(0.1 + r() * 0.18)}" stroke-linecap="round"/>`;
    }
    return `<rect x="0" y="${y}" width="400" height="${260 - y}" fill="url(#wt${uid})"/>${lines}`;
  }
  function wrap(label, inner, plainSky) {
    const u = uid;
    const out = `<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><defs><linearGradient id="sk${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky1}"/><stop offset="1" stop-color="${C.sky2}"/></linearGradient><linearGradient id="wt${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.water1}"/><stop offset="1" stop-color="${C.water2}"/></linearGradient><radialGradient id="gl${u}"><stop offset="0" stop-color="${C.glow}" stop-opacity="0.75"/><stop offset="1" stop-color="${C.glow}" stop-opacity="0"/></radialGradient></defs>${plainSky === false ? '' : `<rect width="400" height="260" fill="url(#sk${u})"/>`}${inner}</svg>`;
    uid++;
    return out;
  }

  const S = {};

  S.bedroom = function (o) {
    const p = o.power;
    let s = `<rect width="400" height="260" fill="#131d3b"/>`;
    s += `<rect x="112" y="22" width="176" height="150" rx="10" fill="url(#sk${uid})"/>`;
    s += stars(26, 5, 118, 28, 164, 120) + moon(248, 66, 20);
    s += `<path d="M112,172 q30,-22 60,-6 q28,-18 56,-2 q30,-16 60,8 z" fill="${C.near}"/>`;
    s += `<rect x="112" y="22" width="176" height="150" rx="10" fill="none" stroke="#33477c" stroke-width="8"/><path d="M200,22 v150 M112,97 h176" stroke="#33477c" stroke-width="5"/><rect x="98" y="170" width="204" height="10" rx="4" fill="#3d528c"/>`;
    s += `<path d="M84,10 h44 q-4,80 -30,170 h-14 z" fill="#3a2f66"/><path d="M316,10 h-44 q4,80 30,170 h14 z" fill="#3a2f66"/><rect x="74" y="6" width="252" height="8" rx="4" fill="#55468f"/>`;
    s += blink(214, 118, p);
    s += `<ellipse cx="78" cy="214" rx="56" ry="20" fill="#cfcabb"/><path d="M0,226 q200,-34 400,-6 v40 h-400 z" fill="#2a4079"/><path d="M0,236 q200,-30 400,-4" stroke="#3a55a0" stroke-width="2" fill="none"/>`;
    s += elephant(176, 214, 0.95) + shark(292, 222, 0.95);
    return wrap('Your bedroom window at night, with Ella the elephant and Sharky the shark on the bed', s, false);
  };

  S.woods = function (o) {
    let s = stars(30, 9, 0, 0, 400, 110) + moon(332, 40, 16);
    s += `<path d="M0,170 q100,-40 200,-10 t200,-10 v110 h-400 z" fill="${C.far}"/>`;
    [30, 78, 262, 312, 368].forEach(function (x, i) { s += `<rect x="${x}" y="0" width="${12 + (i % 3) * 5}" height="260" fill="${C.mid}"/>`; });
    s += `<path d="M118,260 q10,-80 4,-150 q-2,-40 -30,-70 h34 q16,26 22,52 q10,-30 44,-34 l6,16 q-34,10 -36,52 q-4,70 12,134 z" fill="${C.near}"/>`;
    s += `<ellipse cx="120" cy="26" rx="110" ry="46" fill="${C.near}"/><ellipse cx="230" cy="40" rx="70" ry="30" fill="${C.near}"/>`;
    s += `<path d="M150,128 q40,-6 78,-22 l4,10 q-36,20 -80,24 z" fill="${C.near}"/>`;
    s += `<g><ellipse cx="204" cy="94" rx="15" ry="19" fill="#28365f"/><polygon points="192,80 195,68 201,79" fill="#28365f"/><polygon points="216,80 213,68 207,79" fill="#28365f"/><circle cx="198" cy="88" r="5.5" fill="${C.glow}"/><circle cx="210" cy="88" r="5.5" fill="${C.glow}"/><circle cx="198" cy="88" r="2.2" fill="${C.near}"/><circle cx="210" cy="88" r="2.2" fill="${C.near}"/><polygon points="204,92 201,97 207,97" fill="#c89a4e"/><path d="M196,104 q8,5 16,0" stroke="#3a4a7a" stroke-width="1.5" fill="none"/></g>`;
    s += `<path d="M0,232 q200,-22 400,0 v28 h-400 z" fill="${C.near}"/>`;
    [[216, 238], [240, 244], [268, 236], [300, 243], [186, 246]].forEach(function (a) {
      s += `<ellipse cx="${a[0]}" cy="${a[1]}" rx="3.2" ry="4" fill="#b08a4a"/><path d="M${a[0] - 3.6},${a[1] - 1.5} q3.6,-5 7.2,0 z" fill="#6e5330"/>`;
    });
    s += blink(282, 168, o.power);
    return wrap('An owl with gold eyes sitting in a big oak tree', s);
  };

  S.hill = function (o) {
    let s = stars(120, 14, 0, 0, 400, 170) + moon(64, 48, 17);
    s += `<path d="M0,260 v-50 q200,-120 400,0 v50 z" fill="${C.mid}"/>`;
    s += `<g fill="#8e9cc0"><ellipse cx="196" cy="147" rx="27" ry="10"/><circle cx="226" cy="142" r="9"/><ellipse cx="246" cy="143" rx="15" ry="3.6" transform="rotate(6 246 143)"/><ellipse cx="245" cy="137" rx="15" ry="3.4" transform="rotate(-10 245 137)"/><ellipse cx="176" cy="138" rx="4" ry="9" transform="rotate(-20 176 138)"/><ellipse cx="190" cy="136" rx="3.6" ry="8" transform="rotate(10 190 136)"/></g><circle cx="229" cy="140" r="1.3" fill="${C.near}"/>`;
    s += `<path d="M0,260 v-26 q200,-40 400,0 v26 z" fill="${C.near}"/>`;
    [[60, 226], [96, 220], [318, 222], [350, 228]].forEach(function (a) {
      s += `<circle cx="${a[0]}" cy="${a[1]}" r="12" fill="#0f2a22"/><circle cx="${a[0] - 4}" cy="${a[1] - 2}" r="2.2" fill="#6f8be0"/><circle cx="${a[0] + 5}" cy="${a[1] + 3}" r="2.2" fill="#6f8be0"/><circle cx="${a[0] + 2}" cy="${a[1] - 6}" r="2" fill="#6f8be0"/>`;
    });
    s += blink(140, 112, o.power);
    return wrap('A hare lying on her back on a hilltop under a sky full of stars', s);
  };

  S.log = function (o) {
    let s = `<rect width="400" height="260" fill="#06090f"/>`;
    const rings = ['#120d0a', '#19120d', '#211811', '#2a1f16', '#33261b', '#3d2e21'];
    rings.forEach(function (c, i) { s += `<ellipse cx="200" cy="128" rx="${250 - i * 36}" ry="${170 - i * 24}" fill="${c}"/>`; });
    s += `<circle cx="262" cy="118" r="78" fill="url(#gl${uid})"/>`;
    s += `<ellipse cx="200" cy="124" rx="26" ry="20" fill="#0a1226"/>` + stars(5, 3, 182, 110, 36, 26);
    s += `<path d="M120,214 q60,-10 106,-8 l4,6 q-60,6 -110,10 z" fill="#06090f" opacity="0.7"/>`;
    s += `<g><path d="M186,196 l6,-16 l5,10 l5,-15 l6,12 l6,-14 l5,13 l7,-10 l3,13 l8,-5 q8,12 0,22 h-48 q-8,-6 -3,-10 z" fill="#5a4230"/><path d="M238,196 q12,2 16,8 q-8,6 -18,2 z" fill="#7a5c44"/><circle cx="254" cy="204" r="1.8" fill="#06090f"/><circle cx="244" cy="199" r="1.5" fill="#06090f"/><rect x="198" y="206" width="6" height="5" rx="2" fill="#7a5c44"/><rect x="224" y="206" width="6" height="5" rx="2" fill="#7a5c44"/></g>`;
    s += `<path d="M236,200 L260,128" stroke="#7a5c44" stroke-width="2.5" stroke-linecap="round"/><rect x="254" y="110" width="14" height="18" rx="3" fill="${C.glow}"/><path d="M254,110 h14 M261,104 v6" stroke="#7a5c44" stroke-width="2.5" stroke-linecap="round"/>`;
    s += blink(128, 120, o.power);
    return wrap('A hedgehog holding a tiny lantern inside a dark hollow log', s, false);
  };

  S.web = function (o) {
    let s = stars(36, 21, 0, 0, 400, 150) + moon(200, 148, 26);
    s += `<path d="M0,214 q200,-26 400,0 v46 h-400 z" fill="${C.mid}"/>`;
    const cx = 200, cy = 142, R = 84;
    let web = '';
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + 0.2;
      web += `<path d="M${cx},${cy} L${f(cx + Math.cos(a) * R * 1.25)},${f(cy + Math.sin(a) * R * 1.25)}"/>`;
    }
    for (let k = 1; k <= 4; k++) {
      let d = '';
      for (let i = 0; i <= 8; i++) {
        const a = i * Math.PI / 4 + 0.2, rr = R * k / 4;
        d += (i ? 'L' : 'M') + f(cx + Math.cos(a) * rr) + ',' + f(cy + Math.sin(a) * rr) + ' ';
      }
      web += `<path d="${d}"/>`;
    }
    s += `<g stroke="#e3e9f7" stroke-width="1.1" fill="none" opacity="0.8">${web}</g>`;
    const r = rng(77);
    for (let i = 0; i < 16; i++) {
      const a = Math.floor(r() * 8) * Math.PI / 4 + 0.2, rr = R * (1 + Math.floor(r() * 4)) / 4;
      s += `<circle cx="${f(cx + Math.cos(a) * rr)}" cy="${f(cy + Math.sin(a) * rr)}" r="1.8" fill="${C.ink}"/>`;
    }
    let legs = '';
    for (let i = 0; i < 8; i++) {
      const side = i < 4 ? -1 : 1, j = i % 4;
      legs += `<path d="M${cx},${cy} q${side * 8},${-9 + j * 5} ${side * 13},${-8 + j * 6}"/>`;
    }
    s += `<g stroke="#b9c0d2" stroke-width="1.4" fill="none" stroke-linecap="round">${legs}</g><ellipse cx="${cx}" cy="${cy}" rx="4.5" ry="5.5" fill="#b9c0d2"/>`;
    s += `<path d="M30,270 Q26,26 200,26 Q374,26 370,270" stroke="${C.near}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M58,270 Q60,60 200,54 Q340,60 342,270" stroke="#0c1730" stroke-width="7" fill="none"/>`;
    [[40, 150, -30], [56, 86, 20], [108, 40, 50], [292, 40, -50], [344, 86, -20], [360, 150, 30], [200, 22, 0]].forEach(function (a) {
      s += `<ellipse cx="${a[0]}" cy="${a[1]}" rx="15" ry="7" transform="rotate(${a[2]} ${a[0]} ${a[1]})" fill="#0f2a22"/>`;
    });
    s += blink(306, 204, o.power);
    return wrap('A silver web with drops of dew, stretched across an arch of brambles', s);
  };

  S.stream = function (o) {
    let s = stars(40, 28, 0, 0, 400, 110) + moon(334, 44, 16);
    s += `<path d="M0,150 q100,-34 200,-8 t200,-10 v130 h-400 z" fill="${C.far}"/>`;
    s += water(150);
    s += `<path d="M96,176 Q200,96 304,176 v14 Q200,116 96,190 z" fill="${C.near}"/><g stroke="${C.near}" stroke-width="3">` + [120, 150, 180, 220, 250, 280].map(function (x) {
      const t = (x - 96) / 208, y = 176 - Math.sin(t * Math.PI) * 40;
      return `<path d="M${x},${f(y)} v-16"/>`;
    }).join('') + `</g><path d="M96,160 Q200,80 304,160" stroke="${C.near}" stroke-width="3" fill="none"/>`;
    s += `<path d="M0,260 v-62 q60,-22 120,-6 q-30,40 -40,68 z" fill="${C.near}"/><path d="M400,260 v-70 q-60,-20 -110,-2 q30,40 34,72 z" fill="${C.near}"/>`;
    s += `<g><ellipse cx="44" cy="214" rx="8" ry="4" fill="#3e6b52"/><ellipse cx="84" cy="216" rx="8" ry="4" fill="#3e6b52"/><path d="M36,212 q28,-34 56,0 z" fill="#2c5a44"/><path d="M48,203 l8,9 M64,196 v16 M80,203 l-8,9" stroke="#1d3f30" stroke-width="1.5"/><ellipse cx="100" cy="204" rx="9" ry="6" fill="#3e6b52"/><circle cx="103" cy="202" r="1.4" fill="${C.near}"/></g>`;
    [330, 346, 362, 378].forEach(function (x, i) { s += `<path d="M${x},230 q${i % 2 ? 4 : -4},-30 0,-${50 + i * 5}" stroke="#1f4a36" stroke-width="2.5" fill="none"/><ellipse cx="${x}" cy="${178 - i * 5}" rx="3.2" ry="9" fill="#5a4230"/>`; });
    s += blink(214, 84, o.power);
    return wrap('An old turtle beside a sparkling stream with a little wooden bridge', s);
  };

  S.stones = function (o) {
    let s = stars(30, 33, 0, 0, 400, 80) + moon(60, 40, 15);
    s += `<path d="M0,100 q100,-26 200,-8 t200,-6 v30 h-400 z" fill="${C.far}"/>` + water(104);
    s += `<path d="M0,260 v-26 q200,-18 400,0 v26 z" fill="${C.near}"/>`;
    const order = o.order || ['gray', 'white', 'speckled', 'black'], fills = { gray: '#8b93a3', white: '#f0eee6', speckled: '#d9d5c8', black: '#14161d' }, r = rng(52);
    order.forEach(function (c, k) {
      const x = 95 + k * 70;
      s += `<ellipse cx="${x}" cy="204" rx="30" ry="14" fill="${fills[c]}"${c === 'black' ? ' stroke="#5a6072" stroke-width="1.5"' : ''}/>`;
      if (c === 'speckled') for (let i = 0; i < 22; i++) s += `<circle cx="${f(x - 21 + r() * 42)}" cy="${f(196 + r() * 16)}" r="${f(1 + r() * 1.3)}" fill="#3b3f4c"/>`;
    });
    s += `<ellipse cx="340" cy="140" rx="34" ry="12" fill="${C.green}"/><path d="M340,140 l30,-8 v10 z" fill="${C.water1}"/><g><ellipse cx="334" cy="130" rx="14" ry="9" fill="#58a56b"/><circle cx="327" cy="121" r="4.5" fill="#58a56b"/><circle cx="340" cy="121" r="4.5" fill="#58a56b"/><circle cx="327" cy="121" r="1.8" fill="${C.near}"/><circle cx="340" cy="121" r="1.8" fill="${C.near}"/><path d="M326,132 q8,4 16,0" stroke="#2c5a3b" stroke-width="1.4" fill="none"/></g>`;
    s += blink(70, 150, o.power);
    return wrap('Four stones in a row at the edge of a pond: gray, white, speckled and black. A frog watches from a lily leaf.', s);
  };

  S.raft = function (o) {
    let s = stars(40, 41, 0, 0, 400, 110) + moon(290, 50, 20);
    s += `<path d="M0,120 q100,-22 200,-6 t200,-6 v30 h-400 z" fill="${C.far}"/>` + water(122);
    s += `<ellipse cx="290" cy="178" rx="20" ry="13" fill="${C.ink}" opacity="0.85"/><path d="M262,170 h56 M258,178 h64 M264,186 h52" stroke="${C.water1}" stroke-width="1.3"/><path d="M270,198 h40" stroke="${C.ink}" stroke-width="1.6" opacity="0.4"/>`;
    s += `<ellipse cx="150" cy="214" rx="92" ry="24" fill="${C.green}"/><path d="M150,214 l92,-12 v20 z" fill="${C.water2}"/><path d="M150,214 L70,206 M150,214 L110,232 M150,214 L176,194" stroke="#235239" stroke-width="1.5"/>`;
    s += `<g><ellipse cx="44" cy="206" rx="22" ry="13" fill="#e6dcb8"/><path d="M24,202 q-10,-6 -8,6 z" fill="#e6dcb8"/><circle cx="62" cy="188" r="9" fill="#e6dcb8"/><polygon points="70,186 82,189 70,193" fill="#e39a3b"/><circle cx="64" cy="186" r="1.5" fill="${C.near}"/><path d="M36,206 q10,6 20,0" stroke="#bfb48e" stroke-width="1.5" fill="none"/></g>`;
    s += elephant(138, 196, 0.6) + shark(186, 204, 0.6);
    s += blink(206, 128, o.power);
    return wrap('A duck pushing a big lily pad across a pond. The moon shines in the sky and in the water.', s);
  };

  S.otter = function (o) {
    let s = stars(36, 46, 0, 0, 400, 120) + moon(330, 46, 16);
    s += `<path d="M0,260 V70 q120,20 230,120 q40,36 170,40 v30 z" fill="${C.mid}"/><path d="M40,92 q110,30 196,112 l-22,12 q-80,-76 -186,-100 z" fill="#4a382b"/>`;
    s += `<rect x="0" y="226" width="400" height="34" fill="url(#wt${uid})"/><path d="M250,234 h50 M316,244 h40 M200,246 h30" stroke="${C.ink}" stroke-width="1" opacity="0.25"/><path d="M0,260 v-30 q100,-10 180,4 q-80,8 -90,26 z" fill="${C.near}"/>`;
    s += `<g><path d="M268,214 q22,6 34,-10" stroke="#6b4f3a" stroke-width="7" stroke-linecap="round" fill="none"/><ellipse cx="262" cy="186" rx="13" ry="28" fill="#6b4f3a"/><ellipse cx="263" cy="190" rx="7" ry="19" fill="#c9ab8a"/><circle cx="262" cy="154" r="11" fill="#6b4f3a"/><circle cx="253" cy="146" r="3" fill="#6b4f3a"/><circle cx="271" cy="146" r="3" fill="#6b4f3a"/><ellipse cx="262" cy="158" rx="6" ry="4" fill="#c9ab8a"/><circle cx="258" cy="152" r="1.5" fill="${C.near}"/><circle cx="266" cy="152" r="1.5" fill="${C.near}"/><circle cx="262" cy="156" r="1.6" fill="${C.near}"/><path d="M272,176 q10,-6 16,-14" stroke="#6b4f3a" stroke-width="5" stroke-linecap="round" fill="none"/><rect x="254" y="210" width="7" height="8" rx="3" fill="#6b4f3a"/><rect x="264" y="210" width="7" height="8" rx="3" fill="#6b4f3a"/></g>`;
    [0, 9, 18].forEach(function (d) { s += `<g transform="translate(${288 + d},160)"><polygon points="0,0 -3,-5 3,-5" fill="${C.ella}"/><ellipse cx="0" cy="8" rx="3.2" ry="8" fill="${C.ella}"/><circle cx="0" cy="13" r="0.9" fill="${C.near}"/></g>`; });
    s += blink(150, 70, o.power);
    return wrap('An otter beside a muddy slide, holding up three small fish', s);
  };

  S.door = function (o) {
    let s = stars(24, 55, 0, 0, 400, 60) + moon(60, 30, 13);
    s += `<rect x="0" y="52" width="400" height="208" fill="#12301f"/>`;
    for (let x = 0; x <= 400; x += 34) { s += `<circle cx="${x}" cy="54" r="22" fill="#12301f"/>`; }
    const r = rng(61);
    for (let i = 0; i < 70; i++) { const lx = f(r() * 400), ly = f(46 + r() * 200); s += `<ellipse cx="${lx}" cy="${ly}" rx="5" ry="2.6" transform="rotate(${f(r() * 180)} ${lx} ${ly})" fill="#1c4a30" opacity="0.9"/>`; }
    s += `<circle cx="200" cy="164" r="70" fill="#2a1c10"/><circle cx="200" cy="164" r="62" fill="${C.wood}"/><path d="M168,111 v106 M200,102 v124 M232,111 v106" stroke="#46301c" stroke-width="2"/><path d="M146,134 h108 M146,194 h108" stroke="#33261b" stroke-width="5"/>`;
    s += `<circle cx="200" cy="158" r="11" fill="none" stroke="${C.glow}" stroke-width="4"/><ellipse cx="200" cy="172" rx="5" ry="6.5" fill="${C.glow}"/><path d="M194,169 q6,-6 12,0 z" fill="#b8902f"/>`;
    s += `<rect x="150" y="66" width="100" height="24" rx="4" fill="${C.ink}"/><path d="M160,75 h80 M168,82 h64" stroke="#3a3f52" stroke-width="2.2" stroke-linecap="round"/>`;
    s += `<path d="M150,260 q50,-34 100,0 z" fill="#3b3f4c"/>`;
    s += blink(312, 120, o.power);
    return wrap('A round wooden door in a tall hedge, with a brass knocker shaped like an acorn', s);
  };

  S.stump = function (o) {
    let s = stars(40, 63, 0, 0, 400, 130) + moon(330, 46, 17);
    s += `<path d="M0,196 q200,-30 400,0 v64 h-400 z" fill="${C.mid}"/><path d="M0,260 v-26 q200,-18 400,0 v26 z" fill="${C.near}"/>`;
    s += `<path d="M146,244 q10,-36 8,-70 h92 q-2,34 8,70 z" fill="#4a3423"/><ellipse cx="200" cy="174" rx="46" ry="12" fill="#7a5a3c"/><ellipse cx="200" cy="174" rx="30" ry="7.5" fill="none" stroke="#5a4028" stroke-width="1.5"/><ellipse cx="200" cy="174" rx="15" ry="3.6" fill="none" stroke="#5a4028" stroke-width="1.5"/>`;
    s += `<ellipse cx="160" cy="184" rx="14" ry="6" fill="${C.green}"/><ellipse cx="236" cy="190" rx="12" ry="5" fill="${C.green}"/><ellipse cx="170" cy="238" rx="18" ry="6" fill="${C.green}"/>`;
    s += `<path d="M178,170 q4,-22 14,-10 q7,9 14,-10" stroke="#e0a595" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="207" cy="149" r="6.5" fill="#e0a595"/><circle cx="204.5" cy="148" r="2.6" fill="none" stroke="${C.ink}" stroke-width="1"/><circle cx="210.5" cy="148" r="2.6" fill="none" stroke="${C.ink}" stroke-width="1"/><path d="M205,153 q3,2 5,0" stroke="#8a4f44" stroke-width="1" fill="none"/>`;
    s += `<path d="M214,168 q14,-16 28,-2 q-14,10 -28,2 z" fill="#58a56b"/><path d="M216,167 q12,-6 24,-1" stroke="#2c5a3b" stroke-width="1" fill="none"/>`;
    s += `<circle cx="224" cy="124" r="20" fill="url(#gl${uid})"/><ellipse cx="224" cy="124" rx="5" ry="2.6" fill="#d8f29a"/>`;
    [[320, 204], [344, 196], [366, 208], [336, 216]].forEach(function (a) { s += `<circle cx="${a[0]}" cy="${a[1]}" r="13" fill="#0f2a22"/><circle cx="${a[0]}" cy="${a[1] - 3}" r="4" fill="#b8566a"/>`; });
    s += blink(110, 118, o.power);
    return wrap('A bookworm with tiny glasses reading a leaf on a mossy stump', s);
  };

  S.well = function (o) {
    let s = stars(40, 71, 0, 0, 400, 130) + moon(66, 46, 17);
    s += `<path d="M0,196 q200,-30 400,0 v64 h-400 z" fill="${C.mid}"/><path d="M0,260 v-22 q200,-18 400,0 v22 z" fill="${C.near}"/>`;
    s += `<rect x="146" y="92" width="8" height="78" fill="#4a3423"/><rect x="246" y="92" width="8" height="78" fill="#4a3423"/><polygon points="126,98 200,56 274,98" fill="#5a3d25"/><path d="M126,98 h148" stroke="#3a2718" stroke-width="4"/>`;
    s += `<path d="M150,164 h100 v70 q-50,10 -100,0 z" fill="#737a8b"/><ellipse cx="200" cy="164" rx="50" ry="11" fill="#8d94a6"/><ellipse cx="200" cy="165" rx="38" ry="7" fill="#06090f"/>`;
    s += `<g stroke="#565c6c" stroke-width="1.5" fill="none"><path d="M150,186 q50,10 100,0 M150,208 q50,10 100,0"/><path d="M176,176 v14 M214,178 v12 M160,196 v14 M196,200 v12 M232,196 v14 M178,220 v12 M216,220 v12"/></g>`;
    s += `<path d="M178,98 v40" stroke="#c9ab8a" stroke-width="1.6"/><path d="M170,138 h16 l-2,16 h-12 z" fill="#7a5a3c"/><path d="M170,138 q8,-10 16,0" stroke="#c9ab8a" stroke-width="1.4" fill="none"/>`;
    s += `<g><path d="M226,100 v4" stroke="#2b2238" stroke-width="2"/><path d="M226,104 l-9,4 q-2,12 9,22 q11,-10 9,-22 z" fill="#3a2f4d"/><ellipse cx="226" cy="124" rx="5" ry="6" fill="#4b3d63"/><polygon points="222,128 221,134 225,130" fill="#4b3d63"/><polygon points="230,128 231,134 227,130" fill="#4b3d63"/><circle cx="224" cy="125" r="1.1" fill="${C.glow}"/><circle cx="228" cy="125" r="1.1" fill="${C.glow}"/></g>`;
    s += blink(312, 134, o.power);
    return wrap('An old stone well with a bucket. A little bat hangs upside down under its roof.', s);
  };

  S.tree = function (o) {
    const lights = o.lights || 0;
    let s = stars(40, 80, 0, 0, 400, 120) + moon(350, 36, 13);
    s += `<path d="M0,214 q200,-26 400,0 v46 h-400 z" fill="${C.mid}"/>`;
    if (lights > 20) s += `<circle cx="200" cy="104" r="${f(110 + lights * 0.5)}" fill="url(#gl${uid})" opacity="${f(Math.min(0.7, lights / 130))}"/>`;
    const canopy = lights > 0 ? '#12261f' : '#0a1420';
    s += `<path d="M178,236 q10,-50 2,-96 h40 q-8,46 2,96 z" fill="#1a130f"/><path d="M182,150 q-30,-10 -50,-40 M218,150 q30,-10 50,-40" stroke="#1a130f" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    [[200, 76, 70], [130, 104, 52], [270, 104, 52], [160, 60, 46], [240, 60, 46], [200, 118, 56]].forEach(function (a) { s += `<circle cx="${a[0]}" cy="${a[1]}" r="${a[2]}" fill="${canopy}"/>`; });
    const r = rng(90);
    for (let i = 0; i < lights; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()), x = 200 + Math.cos(a) * d * 112, y = 92 + Math.sin(a) * d * 70, rr = 1.2 + r() * 1.4;
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr * 3)}" fill="${C.glow}" opacity="0.16"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="${C.glow}"/>`;
    }
    s += `<path d="M0,260 v-22 q200,-18 400,0 v22 z" fill="${C.near}"/>`;
    s += `<circle cx="120" cy="170" r="9" fill="${C.glow}" opacity="0.18"/><circle cx="120" cy="170" r="2.6" fill="#ffe7a3"/>`;
    s += blink(150, 186, o.power);
    return wrap(lights > 0 ? 'The Lantern Tree, shining with firefly lights' : 'A giant dark tree in a moonlit meadow', s);
  };

  function below() {
    let s = `<path d="M0,260 v-34 q60,-18 120,-6 q80,-20 150,-2 q70,-14 130,4 v38 z" fill="${C.near}"/>`;
    [20, 44, 150, 176, 300, 330, 366].forEach(function (x, i) { s += pine(x, 236 - (i % 3) * 3, 16 + (i % 2) * 6, '#0c1730'); });
    s += `<rect x="84" y="222" width="22" height="16" fill="#1b2948"/><polygon points="80,223 95,210 110,223" fill="#26386a"/><rect x="91" y="227" width="7" height="7" fill="${C.glow}"/>`;
    s += `<path d="M214,236 q30,-8 60,0" stroke="${C.water1}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    return s;
  }
  function clouds() {
    return `<g fill="${C.ink}" opacity="0.1"><ellipse cx="80" cy="150" rx="60" ry="12"/><ellipse cx="120" cy="142" rx="40" ry="12"/><ellipse cx="320" cy="176" rx="64" ry="11"/><ellipse cx="290" cy="168" rx="36" ry="10"/></g>`;
  }

  S.puff = function (o) {
    let s = stars(90, 97, 0, 0, 400, 210) + moon(316, 62, 30) + clouds() + below();
    const cx = 190, cy = 92;
    let seeds = '';
    for (let i = 0; i < 26; i++) {
      const a = i * (Math.PI * 2 / 26), x = cx + Math.cos(a) * 42, y = cy + Math.sin(a) * 42;
      seeds += `<path d="M${cx},${cy} L${f(x)},${f(y)}" stroke="${C.ink}" stroke-width="0.9" opacity="0.7"/><circle cx="${f(x)}" cy="${f(y)}" r="3.4" fill="${C.ink}" opacity="0.9"/>`;
    }
    s += `<path d="M${cx},${cy} q6,50 -2,92" stroke="#7fb58d" stroke-width="3" fill="none" stroke-linecap="round"/>` + seeds + `<circle cx="${cx}" cy="${cy}" r="5" fill="#cfcabb"/>`;
    s += blink(258, 128, o.power);
    return wrap('A giant dandelion puff floating high above the woods, with your house far below', s);
  };

  S.leaf = function (o) {
    let s = stars(90, 104, 0, 0, 400, 210) + moon(316, 62, 30) + clouds() + below();
    s += elephant(176, 124, 0.62) + shark(216, 128, 0.58);
    s += `<path d="M120,128 q76,50 160,-6 q-8,34 -78,36 q-66,2 -82,-30 z" fill="#3c8259"/><path d="M130,134 q70,34 142,-8" stroke="#235239" stroke-width="1.6" fill="none"/><path d="M280,122 q12,-8 18,-18" stroke="#3c8259" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const r = rng(111);
    for (let i = 0; i < 16; i++) { const x = 126 + r() * 150, y = 168 + r() * 16; s += `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="${C.glow}" opacity="0.18"/><circle cx="${f(x)}" cy="${f(y)}" r="1.6" fill="${C.glow}"/>`; }
    s += blink(244, 100, o.power);
    return wrap('A leaf boat carried by fireflies high above the woods, with Ella and Sharky riding inside', s);
  };

  function starPts(cx, cy, R) {
    let pts = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.45 : R; pts += f(cx + Math.cos(a) * r) + ',' + f(cy + Math.sin(a) * r) + ' '; }
    return pts;
  }

  S.garden = function (o) {
    let s = stars(40, 121, 0, 0, 400, 100) + moon(330, 40, 15);
    s += `<rect x="0" y="96" width="400" height="80" fill="#0f2a1d"/>`;
    for (let x = 0; x <= 400; x += 30) s += `<circle cx="${x}" cy="98" r="18" fill="#0f2a1d"/>`;
    s += `<polygon points="150,210 250,210 400,260 0,260" fill="#3b3f4c"/><polygon points="0,84 150,126 150,210 0,260" fill="#12301f"/><polygon points="400,84 250,126 250,210 400,260" fill="#12301f"/>`;
    s += `<rect x="150" y="126" width="100" height="84" fill="#1a4a30"/><path d="M180,210 v-40 a20,20 0 0 1 40,0 v40 z" fill="${C.near}"/>`;
    s += `<rect x="142" y="112" width="12" height="100" fill="#2f6b4b"/><rect x="246" y="112" width="12" height="100" fill="#2f6b4b"/><circle cx="148" cy="104" r="13" fill="#2f6b4b"/><circle cx="252" cy="104" r="13" fill="#2f6b4b"/>`;
    const r = rng(123);
    for (let i = 0; i < 16; i++) { const left = i % 2, x = left ? r() * 130 : 270 + r() * 130, y = 130 + r() * 80; s += `<circle cx="${f(x)}" cy="${f(y)}" r="3.4" fill="#d9667a"/>`; }
    s += blink(200, 150, o.power);
    return wrap('A hedge maze with a dark arch in the middle, under the moon', s);
  };

  S.deep = function (o) {
    let s = `<rect width="400" height="260" fill="#0a2742"/><rect width="400" height="70" fill="#123b5e"/>`;
    s += `<polygon points="60,0 110,0 40,260 -30,260" fill="#ffffff" opacity="0.04"/><polygon points="220,0 280,0 240,260 150,260" fill="#ffffff" opacity="0.05"/>`;
    s += `<path d="M0,260 v-30 q100,-24 200,-6 t200,-10 v46 z" fill="#061a2e"/>`;
    [[30, 1], [60, -1], [330, 1], [362, -1], [384, 1]].forEach(function (a, i) { s += `<path d="M${a[0]},240 q${a[1] * 12},-26 0,-52 q${-a[1] * 12},-26 0,-${50 + i * 6}" stroke="#2f8a5f" stroke-width="5" fill="none" stroke-linecap="round"/>`; });
    [[90, 60, 4], [104, 34, 2.6], [250, 90, 3.4], [262, 60, 2.2], [320, 40, 3]].forEach(function (b) { s += `<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="none" stroke="${C.ink}" stroke-width="1" opacity="0.6"/>`; });
    s += `<circle cx="140" cy="128" r="50" fill="#ffffff" opacity="0.07"/><circle cx="140" cy="128" r="50" fill="none" stroke="${C.ink}" stroke-width="1.6" opacity="0.6"/><path d="M106,100 q8,-14 24,-18" stroke="${C.ink}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.6"/>`;
    s += elephant(130, 140, 0.9) + blink(160, 104, o.power) + shark(286, 150, 1.5);
    s += `<g fill="#9fb0d0" opacity="0.8"><ellipse cx="320" cy="208" rx="9" ry="4.5"/><polygon points="328,208 336,203 336,213"/><ellipse cx="350" cy="196" rx="7" ry="3.6"/><polygon points="356,196 362,192 362,200"/></g>`;
    return wrap('Under the pond: Ella and Blink ride in a big bubble while Sharky swims beside them', s, false);
  };

  S.tunnels = function (o) {
    let s = `<rect width="400" height="260" fill="#17100b"/>`;
    s += `<path d="M-20,70 Q110,30 180,120 T420,190" stroke="#2e2219" stroke-width="58" fill="none"/><path d="M180,120 Q150,200 60,250" stroke="#2e2219" stroke-width="40" fill="none"/>`;
    [[60, 0], [150, 0], [240, 0], [330, 0]].forEach(function (a, i) { s += `<path d="M${a[0]},0 q${i % 2 ? 10 : -10},30 0,${46 + i * 8} M${a[0] + 12},0 q8,16 4,${30 + i * 4}" stroke="#6b4f3a" stroke-width="4" fill="none" stroke-linecap="round"/>`; });
    [[40, 200, '#d9667a'], [320, 110, '#6f8be0'], [356, 232, '#58a56b'], [100, 120, '#ffd35c'], [264, 236, '#9a86e0']].forEach(function (g) { s += `<polygon points="${g[0] - 6},${g[1] - 4} ${g[0] + 6},${g[1] - 4} ${g[0] + 9},${g[1] + 2} ${g[0]},${g[1] + 11} ${g[0] - 9},${g[1] + 2}" fill="${g[2]}"/>`; });
    s += `<g><ellipse cx="226" cy="152" rx="26" ry="17" fill="#55495f"/><ellipse cx="250" cy="150" rx="10" ry="8" fill="#55495f"/><circle cx="260" cy="150" r="3.6" fill="#e7a0b0"/><ellipse cx="238" cy="166" rx="8" ry="4" fill="#e7a0b0"/><ellipse cx="214" cy="168" rx="8" ry="4" fill="#e7a0b0"/><path d="M200,150 q-8,-2 -10,4" stroke="#55495f" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
    s += blink(170, 110, o.power);
    return wrap('A mole in a dark tunnel with roots hanging down and gems in the walls', s, false);
  };

  S.clouds = function (o) {
    let s = stars(70, 131, 0, 0, 400, 200) + moon(64, 56, 24);
    s += `<g fill="#dfe6f5"><rect x="150" y="96" width="34" height="100"/><rect x="216" y="96" width="34" height="100"/><rect x="180" y="62" width="40" height="134"/><rect x="150" y="150" width="100" height="46"/></g>`;
    s += `<g fill="#6f8be0"><polygon points="146,96 167,62 188,96"/><polygon points="212,96 233,62 254,96"/><polygon points="176,62 200,22 224,62"/></g>`;
    s += `<path d="M200,22 v-14 M192,10 h16" stroke="${C.glow}" stroke-width="2.4" stroke-linecap="round"/><polygon points="208,10 214,7 214,13" fill="${C.glow}"/>`;
    s += `<g fill="${C.glow}"><rect x="194" y="84" width="12" height="18" rx="6"/><rect x="161" y="112" width="10" height="14" rx="5"/><rect x="228" y="112" width="10" height="14" rx="5"/></g><path d="M188,196 v-24 a12,12 0 0 1 24,0 v24 z" fill="${C.mid}"/>`;
    s += `<g fill="${C.ink}"><ellipse cx="200" cy="206" rx="120" ry="20"/><circle cx="110" cy="198" r="22"/><circle cx="150" cy="190" r="18"/><circle cx="262" cy="192" r="20"/><circle cx="298" cy="202" r="18"/></g>`;
    s += `<g fill="${C.ink}" opacity="0.16"><ellipse cx="60" cy="150" rx="50" ry="10"/><ellipse cx="350" cy="120" rx="46" ry="9"/><ellipse cx="330" cy="244" rx="70" ry="12"/><ellipse cx="60" cy="238" rx="60" ry="11"/></g>`;
    s += blink(300, 150, o.power);
    return wrap('A white castle sitting on a cloud, with a golden weathervane on top', s);
  };

  S.snowy = function (o) {
    let s = stars(60, 141, 0, 0, 400, 130);
    s += `<path d="M-10,60 q80,-50 160,-10 t260,-20" stroke="#58a56b" stroke-width="16" fill="none" opacity="0.32"/><path d="M-10,84 q90,-40 180,-6 t240,-26" stroke="#d9667a" stroke-width="12" fill="none" opacity="0.26"/><path d="M-10,104 q100,-30 190,-4 t230,-20" stroke="#9a86e0" stroke-width="10" fill="none" opacity="0.26"/>`;
    s += `<polygon points="40,220 150,70 260,220" fill="#2a3b66"/><polygon points="200,220 300,96 400,220" fill="#223158"/><polygon points="150,70 126,103 142,98 152,110 164,96 176,105" fill="${C.ink}"/><polygon points="300,96 280,121 294,116 302,126 312,116 322,123" fill="${C.ink}"/>`;
    s += `<path d="M0,260 v-50 q100,-22 200,-8 t200,-6 v64 z" fill="#dfe6f5"/><path d="M0,260 v-24 q200,-16 400,0 v24 z" fill="${C.ink}"/>`;
    [[40, 222, 34], [84, 228, 26], [330, 222, 36], [370, 230, 26]].forEach(function (p) { s += pine(p[0], p[1], p[2], '#12301f') + `<polygon points="${p[0]},${p[1] - p[2]} ${f(p[0] - p[2] * 0.1)},${f(p[1] - p[2] * 0.68)} ${f(p[0] + p[2] * 0.1)},${f(p[1] - p[2] * 0.68)}" fill="${C.ink}"/>`; });
    s += blink(210, 160, o.power);
    return wrap('Snowy mountains under green and pink northern lights', s);
  };

  S.market = function (o) {
    let s = stars(20, 151, 0, 60, 400, 80);
    s += `<rect x="0" y="196" width="400" height="64" fill="#1b1524"/><path d="M0,0 h400 v96 Q200,6 0,96 z" fill="${C.near}"/>`;
    const cols = ['#d9667a', '#ffd35c', '#6f8be0', '#58a56b'];
    for (let i = 0; i < 9; i++) { const x = 30 + i * 42.5, y = 86 + Math.sin(i / 8 * Math.PI) * 26; s += `<circle cx="${f(x)}" cy="${f(y + 8)}" r="12" fill="${cols[i % 4]}" opacity="0.18"/><ellipse cx="${f(x)}" cy="${f(y + 8)}" rx="6" ry="7.5" fill="${cols[i % 4]}"/>`; }
    s += `<path d="M30,86 Q200,146 370,86" stroke="${C.ink}" stroke-width="1" fill="none" opacity="0.6"/>`;
    [[30, '#d9667a'], [150, '#6f8be0'], [270, '#58a56b']].forEach(function (st) {
      const x = st[0];
      s += `<rect x="${x + 6}" y="150" width="4" height="66" fill="#6b4f3a"/><rect x="${x + 90}" y="150" width="4" height="66" fill="#6b4f3a"/><rect x="${x}" y="186" width="100" height="34" fill="#5a3d25"/>`;
      for (let k = 0; k < 5; k++) s += `<polygon points="${x + k * 20},132 ${x + k * 20 + 20},132 ${x + k * 20 + 20},154 ${x + k * 20 + 10},160 ${x + k * 20},154" fill="${k % 2 ? C.ink : st[1]}"/>`;
      s += `<circle cx="${x + 30}" cy="181" r="5" fill="${C.glow}"/><circle cx="${x + 50}" cy="181" r="5" fill="#e58a3a"/><circle cx="${x + 70}" cy="181" r="5" fill="#d9667a"/>`;
    });
    s += blink(200, 118, o.power);
    return wrap('Market stalls with striped roofs and colored lanterns under a stone bridge', s);
  };

  S.clock = function (o) {
    let s = stars(50, 161, 0, 0, 400, 180) + moon(326, 50, 18) + below();
    s += `<rect x="168" y="62" width="64" height="180" fill="#1b2548"/><polygon points="158,64 200,10 242,64" fill="#2c3f7a"/><rect x="162" y="60" width="76" height="8" fill="#2c3f7a"/>`;
    s += `<circle cx="200" cy="104" r="25" fill="${C.ink}"/><circle cx="200" cy="104" r="25" fill="none" stroke="${C.glow}" stroke-width="3"/><path d="M200,104 V86 M200,104 L187,112" stroke="${C.near}" stroke-width="3.4" stroke-linecap="round"/><circle cx="200" cy="104" r="2.6" fill="#d9667a"/>`;
    s += `<g fill="${C.glow}"><rect x="194" y="146" width="12" height="18" rx="6"/><rect x="194" y="182" width="12" height="18" rx="6"/></g><path d="M188,242 v-18 a12,12 0 0 1 24,0 v18 z" fill="${C.near}"/>`;
    s += blink(262, 120, o.power);
    return wrap('A tall clock tower in the middle of town, stopped at eight o’clock', s);
  };

  S.library = function (o) {
    let s = `<rect width="400" height="260" fill="#1a1320"/>`;
    const cols = ['#d9667a', '#6f8be0', '#58a56b', '#ffd35c', '#f5eeda', '#9a86e0', '#b5805a'], r = rng(171);
    for (let row = 0; row < 4; row++) {
      const base = 62 + row * 58; let x = 10;
      while (x < 386) { const w = 8 + r() * 10, h = 30 + r() * 18; if (r() > 0.12) s += `<rect x="${f(x)}" y="${f(base - h)}" width="${f(w)}" height="${f(h)}" rx="1.5" fill="${cols[Math.floor(r() * cols.length)]}" opacity="0.85"/>`; x += w + 2; }
      s += `<rect x="0" y="${base}" width="400" height="7" fill="#6b4f3a"/>`;
    }
    s += `<path d="M270,250 L298,10 M318,250 L330,10" stroke="#c9ab8a" stroke-width="4" stroke-linecap="round"/>` + [50, 100, 150, 200].map(function (y) { return `<path d="M${f(270 + (250 - y) * 0.117 + 4)},${y} L${f(318 + (250 - y) * 0.05 - 2)},${y}" stroke="#c9ab8a" stroke-width="3.4"/>`; }).join('');
    s += `<circle cx="70" cy="150" r="60" fill="url(#gl${uid})" opacity="0.6"/>`;
    [['A', 120, 60, -18], ['q', 180, 120, 14], ['M', 230, 70, 8], ['e', 150, 190, -10], ['Z', 90, 110, 22], ['y', 220, 200, -24]].forEach(function (l) { s += `<text x="${l[1]}" y="${l[2]}" font-size="22" font-weight="700" fill="${C.ink}" opacity="0.9" transform="rotate(${l[3]} ${l[1]} ${l[2]})">${l[0]}</text>`; });
    s += blink(70, 150, o.power);
    return wrap('Tall library shelves with a ladder, and loose letters floating in the air', s, false);
  };

  S.ladder = function (o) {
    let s = stars(140, 181, 0, 0, 400, 220) + moon(310, 56, 26);
    s += `<path d="M0,260 v-40 q200,-70 400,0 v40 z" fill="${C.mid}"/><path d="M0,260 v-20 q200,-24 400,0 v20 z" fill="${C.near}"/>`;
    s += `<path d="M168,236 L206,6 M232,236 L226,6" stroke="${C.ink}" stroke-width="3.4" stroke-linecap="round"/>`;
    for (let i = 0; i < 9; i++) { const t = i / 9, y = 222 - t * 200, x1 = 168 + (206 - 168) * ((236 - y) / 230), x2 = 232 + (226 - 232) * ((236 - y) / 230); s += `<path d="M${f(x1)},${f(y)} L${f(x2)},${f(y)}" stroke="${C.glow}" stroke-width="${f(3.4 - t * 1.6)}" stroke-linecap="round"/>`; }
    s += `<circle cx="112" cy="206" r="26" fill="${C.glow}" opacity="0.16"/><polygon points="${starPts(112, 206, 17)}" fill="${C.glow}"/><circle cx="107" cy="205" r="1.6" fill="${C.near}"/><circle cx="117" cy="205" r="1.6" fill="${C.near}"/><path d="M108,211 q4,3 8,0" stroke="${C.near}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    s += blink(260, 150, o.power);
    return wrap('A silver ladder leaning against the night sky, with a little fallen star at the bottom', s);
  };

  /* World map: one tappable spot per chapter. info = [{id, n, title, done, open, here}] */
  const POS = { c1: [52, 236], c2: [124, 258], c3: [198, 234], c4: [272, 258], c5: [338, 72], c6: [300, 152], c7: [218, 170], c8: [142, 172], c9: [64, 146], c10: [112, 56] };
  const SPOT = { c1: 'fireflies', c2: 'rose', c3: 'fish', c4: 'gem:green', c5: 'cloud', c6: 'snow', c7: 'coin', c8: 'clock', c9: 'book', c10: 'star' };
  function world(info) {
    uid++;
    let s = stars(60, 191, 0, 0, 400, 120) + moon(366, 28, 11);
    s += `<path d="M0,300 V150 q70,-34 150,-14 q90,-30 250,-6 V300 z" fill="#14264a"/><path d="M0,300 V214 q110,-30 230,-10 q90,-12 170,6 V300 z" fill="#101d3c"/>`;
    s += `<polygon points="250,160 300,96 350,160" fill="#2a3b66"/><polygon points="300,96 288,112 298,109 304,116 312,110" fill="${C.ink}"/><g fill="${C.ink}" opacity="0.5"><ellipse cx="338" cy="92" rx="34" ry="8"/><ellipse cx="318" cy="86" rx="18" ry="7"/></g>`;
    s += `<ellipse cx="198" cy="244" rx="40" ry="14" fill="${C.water1}"/>` + pine(26, 232, 22, '#0c1730') + pine(78, 226, 18, '#0c1730') + pine(40, 262, 16, '#0c1730');
    s += `<rect x="12" y="276" width="18" height="13" fill="#1b2948"/><polygon points="9,277 21,266 33,277" fill="#26386a"/><rect x="18" y="280" width="6" height="6" fill="${C.glow}"/>`;
    s += `<path d="M104,74 L108,20 M120,74 L118,20" stroke="${C.ink}" stroke-width="1.6" opacity="0.6"/>`;
    let pts = [[21, 276]], solid = '', dash = '';
    info.forEach(function (c) { pts.push(POS[c.id]); });
    for (let i = 1; i < pts.length; i++) {
      const seg = `M${pts[i - 1][0]},${pts[i - 1][1]} L${pts[i][0]},${pts[i][1]} `;
      if (info[i - 1].done) solid += seg; else dash += seg;
    }
    s += `<path d="${dash}" stroke="${C.ink}" stroke-width="1.6" stroke-dasharray="2 6" stroke-linecap="round" opacity="0.5" fill="none"/><path d="${solid}" stroke="${C.glow}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
    info.forEach(function (c) {
      const p = POS[c.id];
      let g = '';
      if (c.here) g += `<circle class="halo" cx="${p[0]}" cy="${p[1]}" r="24" fill="${C.glow}" opacity="0.28"/>`;
      g += ICON.place(SPOT[c.id], p[0] - 17, p[1] - 17, 34);
      g += `<circle cx="${p[0]}" cy="${p[1]}" r="17" fill="none" stroke="${c.done ? C.glow : C.ink}" stroke-width="${c.done ? 2.6 : 1.4}"/>`;
      g += `<circle cx="${p[0] + 14}" cy="${p[1] - 14}" r="8" fill="${c.done ? C.glow : C.ink}"/><text x="${p[0] + 14}" y="${p[1] - 10.4}" text-anchor="middle" font-size="${c.n > 9 ? 9 : 10.5}" font-weight="700" fill="${C.near}">${c.n}</text>`;
      s += c.open
        ? `<g class="spot${c.here ? ' blink' : ''}" data-act="chapter:${c.id}" role="button" tabindex="0" aria-label="Chapter ${c.n}: ${c.title}">${g}</g>`
        : `<g opacity="0.32" aria-hidden="true">${g}</g>`;
    });
    const out = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="World map"><defs><linearGradient id="sk${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky1}"/><stop offset="1" stop-color="${C.sky2}"/></linearGradient></defs><rect width="400" height="300" fill="url(#sk${uid})"/>${s}</svg>`;
    uid++;
    return out;
  }

  return {
    draw: function (key, o) { uid++; return (S[key] || S.bedroom)(o || { power: 0 }); },
    has: function (key) { return !!S[key]; },
    world: world,
    keys: Object.keys(S)
  };
})();
