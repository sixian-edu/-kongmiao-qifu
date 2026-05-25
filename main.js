/* ===== 孔庙祈福 · JS ===== */

// ===== Fortune Data =====
const FORTUNES = [
  { type:'大吉', cls:'da-ji', label:'大吉', poem:'少年执笔定山河，今朝落墨必生花。', desc:'文曲星照，笔下生辉。此番赴考，如鱼跃龙门，一举夺魁。' },
  { type:'上上签', cls:'shang-qian', label:'上上签', poem:'春风得意马蹄疾，一日看尽长安花。', desc:'金榜在望，前程似锦。平日的付出终将在此刻绽放。' },
  { type:'金榜题名', cls:'jin-bang', label:'金榜题名', poem:'十年寒窗无人问，一举成名天下知。', desc:'功不唐捐，玉汝于成。所有的努力都将化为荣耀。' },
  { type:'文运亨通', cls:'wen-yun', label:'文运亨通', poem:'笔走龙蛇惊风雨，文成锦绣动乾坤。', desc:'文思泉涌，下笔有神。考场之上，超常发挥。' },
  { type:'紫气东来', cls:'zi-qi', label:'紫气东来', poem:'紫气东来满乾坤，金榜高悬挂蟾宫。', desc:'祥瑞降临，好运相伴。此行必能如愿以偿，金榜题名。' },
  { type:'文曲星照', cls:'wen-qu', label:'文曲星照', poem:'魁星点斗占鳌头，文曲星辉照九州。', desc:'得文曲星庇佑，智慧开启。考题皆在掌握之中。' },
  { type:'大吉', cls:'da-ji', label:'大吉', poem:'宝剑锋从磨砺出，梅花香自苦寒来。', desc:'苦尽甘来，终得圆满。你的坚持终将照亮前路。' },
  { type:'上上签', cls:'shang-qian', label:'上上签', poem:'长风破浪会有时，直挂云帆济沧海。', desc:'时运已至，势不可挡。放手一搏，必创佳绩。' },
  { type:'金榜题名', cls:'jin-bang', label:'金榜题名', poem:'沧海横流显本色，青云直上展宏图。', desc:'厚积薄发，一鸣惊人。你已准备充分，只待挥毫。' },
  { type:'文运亨通', cls:'wen-yun', label:'文运亨通', poem:'书山有路勤为径，学海无涯苦作舟。', desc:'天道酬勤，你的勤奋必将换来丰硕的果实。' },
  { type:'紫气东来', cls:'zi-qi', label:'紫气东来', poem:'天门大开纳贤才，紫气东来送佳音。', desc:'好运将至，喜讯在望。此次考试必有意外之喜。' },
  { type:'文曲星照', cls:'wen-qu', label:'文曲星照', poem:'星光不负赶路人，时光不负有心人。', desc:'每一份努力都被看见，每一滴汗水都将开花结果。' },
  { type:'大吉', cls:'da-ji', label:'大吉', poem:'海阔凭鱼跃，天高任鸟飞。', desc:'前程远大，不可限量。此次考试是你展翅高飞的起点。' },
  { type:'上上签', cls:'shang-qian', label:'上上签', poem:'千淘万漉虽辛苦，吹尽狂沙始到金。', desc:'经历磨砺，终见真金。你的付出必将换来耀眼的成绩。' },
  { type:'金榜题名', cls:'jin-bang', label:'金榜题名', poem:'大鹏一日同风起，扶摇直上九万里。', desc:'一飞冲天，势不可挡。你的才华终将闪耀。' },
];

// ===== State =====
let userData = null;
let currentFortune = null;
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

// ===== Loading =====
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('loadingOverlay').classList.add('hidden');
    initParticles();
    initPetals();
    initScrollAnim();
    // Preload voices
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
  }, 2500);
});

// ===== Particle System =====
function initParticles() {
  const c = document.getElementById('particleCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create particles
  for (let i = 0; i < 35; i++) {
    pts.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.3,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() / 2000;
    pts.forEach(p => {
      p.x += p.vx + Math.sin(t + p.phase) * 0.15;
      p.y += p.vy;
      p.alpha -= 0.0005;
      if (p.alpha <= 0.05 || p.y < -10 || p.x < -10 || p.x > W + 10) {
        p.x = Math.random() * W; p.y = H + 10;
        p.alpha = 0.2 + Math.random() * 0.6;
        p.vy = -0.2 - Math.random() * 0.3;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,168,71,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== Petals =====
function initPetals() {
  const container = document.getElementById('petalContainer');
  if (!container) return;
  const colors = ['#FFB7C5','#FF8FA3','#FFA5B8','#FFC0CB','#FF6B8A'];
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.style.left = Math.random() * 100 + '%';
    el.style.width = (10 + Math.random() * 10) + 'px';
    el.style.height = (10 + Math.random() * 8) + 'px';
    el.style.background = `radial-gradient(ellipse at 30% 30%, ${colors[i % colors.length]}, ${colors[(i+1) % colors.length]})`;
    el.style.animationDuration = (8 + Math.random() * 12) + 's';
    el.style.animationDelay = (Math.random() * 15) + 's';
    el.style.opacity = 0.3 + Math.random() * 0.4;
    container.appendChild(el);
  }
}

// ===== Scroll Animations =====
function initScrollAnim() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section').forEach(el => observer.observe(el));
}

// ===== Audio System =====
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playBell() {
  try {
    initAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(880, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1.5);
    g.gain.setValueAtTime(0.08, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
    o.start(); o.stop(audioCtx.currentTime + 1.5);
  } catch(e) {}
}

function playChime(freq, delay) {
  try {
    initAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.04, audioCtx.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + 0.6);
    o.start(audioCtx.currentTime + delay);
    o.stop(audioCtx.currentTime + delay + 0.6);
  } catch(e) {}
}

function playFanfare() {
  playChime(523, 0); playChime(659, 0.15);
  playChime(784, 0.3); playChime(1047, 0.5);
}

// Background music - pentatonic melody loop
const PENTATONIC = [262, 294, 330, 392, 440, 392, 330, 294]; // Do Re Mi Sol La Sol Mi Re
function startMusic() {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  let i = 0;
  function playNote() {
    if (!isMusicPlaying) return;
    try {
      initAudio();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = 'sine';
      o.frequency.value = PENTATONIC[i % PENTATONIC.length];
      g.gain.setValueAtTime(0.015, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      o.start(); o.stop(audioCtx.currentTime + 0.5);
      i++;
    } catch(e) {}
  }
  playNote();
  musicInterval = setInterval(() => {
    if (document.hidden) return;
    playNote();
  }, 500);
}

function stopMusic() {
  isMusicPlaying = false;
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
}

function toggleAudio() {
  const btn = document.getElementById('audioToggle');
  if (isMusicPlaying) { stopMusic(); btn.textContent = '🔇'; }
  else { startMusic(); btn.textContent = '🎵'; }
}

// ===== Form =====
function submitPrayer(type) {
  const name = document.getElementById('prayerName').value.trim() || '善信';
  const exam = document.getElementById('examType').value;
  const wish = document.getElementById('prayerWish').value.trim() || '金榜题名，前程似锦';

  userData = { name, exam, wish, type };

  // Hide form, show ceremony
  document.getElementById('formSection').style.display = 'none';
  showCeremony();
}

function showCeremony() {
  const overlay = document.getElementById('ceremonyOverlay');
  overlay.classList.add('active');
  playBell();

  // Light the lantern
  setTimeout(() => {
    document.querySelector('.ceremony-lamp .lantern-body').classList.add('lit');
    // Particle burst
    burstParticles('#D4A847', 30);
    burstParticles('#C41E3A', 20);
    playFanfare();
  }, 800);

  // After ceremony, show slip
  setTimeout(() => {
    overlay.classList.remove('active');
    document.querySelector('.ceremony-lamp .lantern-body').classList.remove('lit');
    document.getElementById('prayerSection').style.display = 'block';
    document.getElementById('prayerSection').classList.add('visible');
    drawFortune();
    // Scroll to slip
    setTimeout(() => {
      document.getElementById('prayerSection').scrollIntoView({ behavior:'smooth', block:'center' });
    }, 300);
  }, 3200);
}

// ===== Fortune =====
function drawFortune() {
  currentFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  const card = document.getElementById('slipCard');
  card.className = 'slip-card';
  card.innerHTML = `
    <div class="slip-type ${currentFortune.cls}">${currentFortune.label}</div>
    <div class="slip-poem">${currentFortune.poem}</div>
    <div class="slip-desc">${currentFortune.desc}</div>
    <div class="slip-seal">${currentFortune.label === '大吉' ? '大吉' : '文昌'}</div>
  `;
  setTimeout(() => card.classList.add('visible'), 100);
  playFanfare();
  burstParticles('#D4A847', 40);
  burstParticles('#F0D68A', 30);
  // Update poster section
  setTimeout(generatePoster, 600);
}

function drawFortuneAgain() {
  currentFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  const card = document.getElementById('slipCard');
  card.className = 'slip-card';
  card.innerHTML = `
    <div class="slip-type ${currentFortune.cls}">${currentFortune.label}</div>
    <div class="slip-poem">${currentFortune.poem}</div>
    <div class="slip-desc">${currentFortune.desc}</div>
    <div class="slip-seal">${currentFortune.label === '大吉' ? '大吉' : '文昌'}</div>
  `;
  setTimeout(() => {
    card.classList.add('visible');
    card.scrollIntoView({ behavior:'smooth', block:'center' });
  }, 100);
  playFanfare();
  burstParticles('#D4A847', 25);
  setTimeout(generatePoster, 500);
}

// ===== Particle Burst =====
function burstParticles(color, count) {
  const c = document.createElement('canvas');
  c.style.cssText = 'position:fixed;inset:0;z-index:999;pointer-events:none';
  c.width = window.innerWidth; c.height = window.innerHeight;
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const pts = [];
  const cx = c.width/2, cy = c.height/2;
  for (let i = 0; i < (count||30); i++) {
    const a = Math.random()*Math.PI*2, sp = 3+Math.random()*10;
    pts.push({ x:cx, y:cy, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-3, life:1, sz:2+Math.random()*4, clr:color || '#D4A847' });
  }
  function frame() {
    ctx.clearRect(0,0,c.width,c.height);
    let alive = false;
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= 0.02;
      if (p.life <= 0) return; alive = true;
      ctx.globalAlpha = p.life; ctx.fillStyle = p.clr;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.sz*p.life,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (alive) requestAnimationFrame(frame);
    else { document.body.removeChild(c); }
  }
  frame();
}

// ===== Poster Generation — Cinematic Edition v2 =====
function generatePoster() {
  const canvas = document.getElementById('posterCanvas');
  if (!canvas || !userData || !currentFortune) return;
  const ctx = canvas.getContext('2d');
  const W = 1080, H = 1920;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  // ============================================
  // HELPER: Paper noise texture
  // ============================================
  function drawPaperNoise(ctx, w, h, alpha) {
    const ts = 128;
    const tile = document.createElement('canvas');
    tile.width = ts; tile.height = ts;
    const tc = tile.getContext('2d');
    const d = tc.createImageData(ts, ts);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = 180 + Math.random() * 40;
      d.data[i] = v; d.data[i+1] = v - 5; d.data[i+2] = v - 10;
      d.data[i+3] = (alpha || 3);
    }
    tc.putImageData(d, 0, 0);
    for (let x = 0; x < w; x += ts) for (let y = 0; y < h; y += ts) ctx.drawImage(tile, x, y);
  }

  // ============================================
  // HELPER: Gold foil texture
  // ============================================
  function makeGoldTexture(tileSize, baseR, baseG, baseB, alpha) {
    const t = document.createElement('canvas');
    t.width = tileSize; t.height = tileSize;
    const tc = t.getContext('2d');
    const d = tc.createImageData(tileSize, tileSize);
    for (let i = 0; i < d.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      d.data[i] = Math.min(255, Math.max(0, baseR + noise));
      d.data[i+1] = Math.min(255, Math.max(0, baseG + noise * 0.7));
      d.data[i+2] = Math.min(255, Math.max(0, baseB + noise * 0.3));
      d.data[i+3] = alpha || 8;
    }
    tc.putImageData(d, 0, 0);
    return t;
  }

  // ============================================
  // 1. BACKGROUND — deep atmospheric sky
  // ============================================
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#040202');
  sky.addColorStop(0.15, '#080303');
  sky.addColorStop(0.35, '#0D0505');
  sky.addColorStop(0.55, '#120808');
  sky.addColorStop(0.75, '#1A0A08');
  sky.addColorStop(1, '#050202');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

  // ── Stars (distant depth) ──
  for (let i = 0; i < 120; i++) {
    const sx = Math.random() * W, sy = Math.random() * H * 0.35;
    const sz = 0.3 + Math.random() * 1.2;
    const sa = 0.02 + Math.random() * 0.06;
    ctx.fillStyle = `rgba(212,168,71,${sa})`;
    ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI * 2); ctx.fill();
  }

  // ── Distant mountains (atmospheric — low contrast, slightly blued) ──
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#1A0A10';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.45);
  for (let x = 0; x <= W; x += 30) {
    ctx.lineTo(x, H * 0.3 + Math.sin(x * 0.008) * 40 + Math.sin(x * 0.015) * 20);
  }
  ctx.lineTo(W, H * 0.55); ctx.lineTo(0, H * 0.55); ctx.closePath(); ctx.fill();
  ctx.restore();

  // ============================================
  // 2. BACKGROUND — Temple & Bell Tower (distant)
  // ============================================
  const templeY = H * 0.30;

  // Atmospheric fog behind temple
  const fog = ctx.createRadialGradient(W/2, templeY + 100, 0, W/2, templeY + 100, H * 0.3);
  fog.addColorStop(0, 'rgba(180,120,80,0.015)');
  fog.addColorStop(1, 'rgba(180,120,80,0)');
  ctx.fillStyle = fog; ctx.fillRect(0, templeY - 100, W, H * 0.35);

  // Temple silhouette (atmospheric — low opacity)
  ctx.save();
  ctx.globalAlpha = 0.25;

  // Main roof
  ctx.fillStyle = '#0A0606';
  ctx.beginPath();
  ctx.moveTo(W * 0.05, templeY + 200);
  ctx.quadraticCurveTo(W * 0.08, templeY + 80, W * 0.2, templeY + 60);
  ctx.quadraticCurveTo(W * 0.35, templeY + 30, W * 0.5, templeY + 10);
  ctx.quadraticCurveTo(W * 0.65, templeY + 30, W * 0.8, templeY + 60);
  ctx.quadraticCurveTo(W * 0.92, templeY + 80, W * 0.95, templeY + 200);
  ctx.closePath(); ctx.fill();

  // Upper roof layer
  ctx.fillStyle = '#0D0808';
  ctx.beginPath();
  ctx.moveTo(W * 0.12, templeY + 150);
  ctx.quadraticCurveTo(W * 0.3, templeY + 70, W * 0.5, templeY + 50);
  ctx.quadraticCurveTo(W * 0.7, templeY + 70, W * 0.88, templeY + 150);
  ctx.closePath(); ctx.fill();

  // Bell tower (central tall structure)
  ctx.fillStyle = '#0A0606';
  // Tower body
  ctx.fillRect(W * 0.46, templeY - 30, W * 0.08, 200);
  // Multi-tier roof
  ctx.beginPath();
  ctx.moveTo(W * 0.42, templeY - 20);
  ctx.quadraticCurveTo(W * 0.5, templeY - 60, W * 0.58, templeY - 20);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(W * 0.44, templeY - 50);
  ctx.quadraticCurveTo(W * 0.5, templeY - 80, W * 0.56, templeY - 50);
  ctx.closePath(); ctx.fill();

  // Pillars
  ctx.fillStyle = '#080303';
  [0.38, 0.44, 0.56, 0.62].forEach(px => {
    ctx.fillRect(W * px - 3, templeY + 70, 6, 140);
  });

  // Center gate
  ctx.fillStyle = '#060202';
  ctx.beginPath();
  (ctx.roundRect ? ctx.roundRect(W * 0.44, templeY + 110, W * 0.12, 100, 6)
    : ctx.rect(W * 0.44, templeY + 110, W * 0.12, 100));
  ctx.fill();

  // Steps
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `rgba(10,6,6,${0.3 + i * 0.08})`;
    const sw = W * (0.32 - i * 0.02), sx = (W - sw) / 2;
    (ctx.roundRect ? ctx.roundRect(sx, templeY + 210 + i * 6, sw, 5, 2)
      : ctx.rect(sx, templeY + 210 + i * 6, sw, 5));
    ctx.fill();
  }
  ctx.restore();

  // ============================================
  // 3. CLOUDS with depth layers
  // ============================================
  const cloudDefs = [
    { y: templeY + 40, sizes: [140, 90, 70], count: 2, alpha: 0.025 },
    { y: templeY + 120, sizes: [90, 60], count: 3, alpha: 0.02 },
    { y: templeY + 190, sizes: [110, 80], count: 2, alpha: 0.018 },
  ];
  cloudDefs.forEach(l => {
    ctx.fillStyle = `rgba(200,160,120,${l.alpha})`;
    for (let i = 0; i < l.count; i++) {
      const cx = W * (0.05 + Math.random() * 0.9);
      const cy = l.y + (Math.random() - 0.5) * 20;
      l.sizes.forEach((sz, si) => {
        ctx.beginPath();
        ctx.arc(cx + si * sz * 0.4 - sz * 0.3, cy + (si - 1) * 8, sz, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  });

  // ============================================
  // 4. SACRED CENTRAL LIGHT SOURCE
  // ============================================
  const titleY = Math.round(H * 0.42);
  const lightCX = W / 2;
  const lightCY = titleY - 60;

  // Massive outer glow
  const sacredGlow1 = ctx.createRadialGradient(lightCX, lightCY, 0, lightCX, lightCY, H * 0.6);
  sacredGlow1.addColorStop(0, 'rgba(212,168,71,0.08)');
  sacredGlow1.addColorStop(0.2, 'rgba(200,150,80,0.04)');
  sacredGlow1.addColorStop(0.5, 'rgba(180,120,60,0.015)');
  sacredGlow1.addColorStop(1, 'rgba(180,120,60,0)');
  ctx.fillStyle = sacredGlow1; ctx.fillRect(0, 0, W, H);

  // Medium glow
  const sacredGlow2 = ctx.createRadialGradient(lightCX, lightCY, 0, lightCX, lightCY, H * 0.35);
  sacredGlow2.addColorStop(0, 'rgba(240,200,140,0.06)');
  sacredGlow2.addColorStop(0.3, 'rgba(220,170,100,0.03)');
  sacredGlow2.addColorStop(0.7, 'rgba(200,150,80,0.01)');
  sacredGlow2.addColorStop(1, 'rgba(200,150,80,0)');
  ctx.fillStyle = sacredGlow2; ctx.fillRect(0, 0, W, H);

  // Hot core
  const sacredGlow3 = ctx.createRadialGradient(lightCX, lightCY, 0, lightCX, lightCY, H * 0.15);
  sacredGlow3.addColorStop(0, 'rgba(255,210,150,0.10)');
  sacredGlow3.addColorStop(0.4, 'rgba(240,190,120,0.05)');
  sacredGlow3.addColorStop(1, 'rgba(220,170,100,0)');
  ctx.fillStyle = sacredGlow3; ctx.fillRect(0, 0, W, H);

  // ── Light rays (divine beam) ──
  ctx.save();
  const rayGrad = ctx.createLinearGradient(0, lightCY - H * 0.2, 0, lightCY);
  rayGrad.addColorStop(0, 'rgba(212,168,71,0)');
  rayGrad.addColorStop(0.4, 'rgba(212,168,71,0.008)');
  rayGrad.addColorStop(0.7, 'rgba(212,168,71,0.015)');
  rayGrad.addColorStop(1, 'rgba(212,168,71,0)');
  ctx.fillStyle = rayGrad;
  for (let i = -2; i <= 2; i++) {
    const spread = 80 + Math.abs(i) * 60;
    ctx.beginPath();
    ctx.moveTo(lightCX + i * spread * 0.3, 0);
    ctx.lineTo(lightCX + i * spread * 0.7, 0);
    ctx.lineTo(lightCX + spread * (0.5 + Math.abs(i) * 0.1), lightCY);
    ctx.lineTo(lightCX - spread * (0.1 + Math.abs(i) * 0.05), lightCY);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();

  // ============================================
  // 5. LANTERNS with enhanced bloom
  // ============================================
  const lanterns = [
    { x: W * 0.15, y: templeY - 20, size: 35 },
    { x: W * 0.85, y: templeY - 20, size: 35 },
    { x: W * 0.08, y: templeY + 40, size: 28 },
    { x: W * 0.92, y: templeY + 40, size: 28 },
  ];
  lanterns.forEach(l => {
    // Massive bloom
    const bloom = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.size * 5);
    bloom.addColorStop(0, 'rgba(200,60,40,0.04)');
    bloom.addColorStop(0.2, 'rgba(200,60,40,0.02)');
    bloom.addColorStop(1, 'rgba(200,60,40,0)');
    ctx.fillStyle = bloom; ctx.fillRect(l.x - l.size * 5, l.y - l.size * 5, l.size * 10, l.size * 10);

    // Warm glow
    const glow = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.size * 2.5);
    glow.addColorStop(0, 'rgba(255,180,100,0.06)');
    glow.addColorStop(0.5, 'rgba(255,150,80,0.02)');
    glow.addColorStop(1, 'rgba(255,150,80,0)');
    ctx.fillStyle = glow; ctx.fillRect(l.x - l.size * 3, l.y - l.size * 3, l.size * 6, l.size * 6);

    // Body
    const lg = ctx.createLinearGradient(l.x - l.size, l.y, l.x + l.size, l.y);
    lg.addColorStop(0, 'rgba(160,25,25,0.2)'); lg.addColorStop(0.5, 'rgba(200,50,35,0.3)');
    lg.addColorStop(1, 'rgba(160,25,25,0.2)');
    ctx.fillStyle = lg;
    ctx.beginPath();
    (ctx.roundRect ? ctx.roundRect(l.x - l.size * 0.3, l.y - l.size, l.size * 0.6, l.size * 2, 4)
      : ctx.rect(l.x - l.size * 0.3, l.y - l.size, l.size * 0.6, l.size * 2));
    ctx.fill();

    // Core glow
    const core = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.size * 0.4);
    core.addColorStop(0, 'rgba(255,200,100,0.12)');
    core.addColorStop(1, 'rgba(255,200,100,0)');
    ctx.fillStyle = core; ctx.beginPath(); ctx.arc(l.x, l.y, l.size * 0.4, 0, Math.PI * 2); ctx.fill();
  });

  // ============================================
  // 6. INCENSE (ritual element)
  // ============================================
  const incenseX = W * 0.88, incenseBase = H * 0.38;
  // Stick
  ctx.strokeStyle = 'rgba(160,120,80,0.06)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(incenseX, incenseBase); ctx.lineTo(incenseX, incenseBase - 80); ctx.stroke();
  // Ember
  const ember = ctx.createRadialGradient(incenseX, incenseBase - 82, 0, incenseX, incenseBase - 82, 6);
  ember.addColorStop(0, 'rgba(255,120,60,0.15)'); ember.addColorStop(1, 'rgba(255,120,60,0)');
  ctx.fillStyle = ember; ctx.beginPath(); ctx.arc(incenseX, incenseBase - 82, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,150,80,0.2)';
  ctx.beginPath(); ctx.arc(incenseX, incenseBase - 82, 2, 0, Math.PI * 2); ctx.fill();
  // Smoke wisp
  ctx.strokeStyle = 'rgba(200,180,160,0.015)'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(incenseX, incenseBase - 85);
  ctx.quadraticCurveTo(incenseX + 15, incenseBase - 120, incenseX + 5, incenseBase - 160);
  ctx.quadraticCurveTo(incenseX - 10, incenseBase - 200, incenseX + 10, incenseBase - 240);
  ctx.stroke();

  // Second incense (left side)
  ctx.strokeStyle = 'rgba(160,120,80,0.04)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W * 0.12, incenseBase + 40); ctx.lineTo(W * 0.12, incenseBase - 40); ctx.stroke();
  ctx.fillStyle = 'rgba(255,120,60,0.1)';
  ctx.beginPath(); ctx.arc(W * 0.12, incenseBase - 42, 4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(200,180,160,0.01)'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W * 0.12, incenseBase - 45);
  ctx.quadraticCurveTo(W * 0.08, incenseBase - 80, W * 0.14, incenseBase - 130);
  ctx.stroke();

  // ============================================
  // 7. TOP SUBTITLE "文运昌隆"
  // ============================================
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(212,168,71,0.2)';
  ctx.font = '600 28px "Noto Serif SC","SimSun",serif';
  ctx.fillText('文运昌隆', W / 2, 130);

  // Decorative line
  ctx.strokeStyle = 'rgba(212,168,71,0.05)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W / 2 - 50, 150); ctx.lineTo(W / 2 + 50, 150); ctx.stroke();

  // ============================================
  // 8. "金榜题名" — CINEMATIC MOVIE TITLE
  // ============================================

  // Gold foil texture tile for text
  const foilTile = makeGoldTexture(64, 180, 150, 80, 10);

  function drawCinematicTitle(ctx, x, y) {
    const fontSize = 175;
    const fontStr = 'bold ' + fontSize + 'px "Noto Serif SC","SimSun","STSong",serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    // === Pass 1: Deep shadow (grounding) ===
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#000';
    ctx.font = fontStr;
    ctx.fillText('金榜题名', x, y);

    // === Pass 2: Warm ambient glow ===
    ctx.shadowColor = 'rgba(212,168,71,0.15)';
    ctx.shadowBlur = 80;
    ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
    const goldGrad = ctx.createLinearGradient(x - 300, y - 100, x + 300, y + 100);
    goldGrad.addColorStop(0, '#5A3E10');
    goldGrad.addColorStop(0.2, '#8A6A20');
    goldGrad.addColorStop(0.35, '#C9952E');
    goldGrad.addColorStop(0.5, '#F0D68A');
    goldGrad.addColorStop(0.6, '#D4A847');
    goldGrad.addColorStop(0.8, '#B8862A');
    goldGrad.addColorStop(1, '#5A3E10');
    ctx.fillStyle = goldGrad;
    ctx.fillText('金榜题名', x, y);

    // === Pass 3: Strong bloom glow ===
    ctx.shadowColor = 'rgba(212,168,71,0.08)';
    ctx.shadowBlur = 120;
    ctx.fillText('金榜题名', x, y);
    ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

    // === Pass 4: Gold foil texture overlay ===
    // Create a temp canvas with the text, clip foil onto it
    const tempC = document.createElement('canvas');
    tempC.width = W; tempC.height = 400;
    const tc = tempC.getContext('2d');
    tc.textAlign = 'center'; tc.textBaseline = 'middle';
    tc.font = fontStr;
    tc.fillStyle = '#FFF';
    tc.fillText('金榜题名', x, y);

    // Tile foil over the text area
    tc.globalCompositeOperation = 'source-atop';
    for (let fx = x - 350; fx < x + 350; fx += 64) {
      for (let fy = y - 100; fy < y + 100; fy += 64) {
        tc.drawImage(foilTile, fx, fy);
      }
    }
    tc.globalCompositeOperation = 'source-over';

    // Blend onto main canvas with low opacity (subtle texture)
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.drawImage(tempC, 0, y - 200);
    ctx.restore();

    // === Pass 5: Flow light (diagonal sweep) ===
    const flowC = document.createElement('canvas');
    flowC.width = W; flowC.height = 400;
    const fc = flowC.getContext('2d');
    fc.textAlign = 'center'; fc.textBaseline = 'middle';
    fc.font = fontStr;
    fc.fillStyle = '#FFF';
    fc.fillText('金榜题名', x, y);

    fc.globalCompositeOperation = 'source-atop';
    const sweep = fc.createLinearGradient(x - 400, y - 80, x + 400, y + 80);
    sweep.addColorStop(0, 'rgba(255,255,255,0)');
    sweep.addColorStop(0.35, 'rgba(255,255,220,0.3)');
    sweep.addColorStop(0.47, 'rgba(255,245,200,0.5)');
    sweep.addColorStop(0.5, 'rgba(255,255,240,0.7)');
    sweep.addColorStop(0.53, 'rgba(255,245,200,0.5)');
    sweep.addColorStop(0.65, 'rgba(255,255,220,0.3)');
    sweep.addColorStop(1, 'rgba(255,255,255,0)');
    fc.fillStyle = sweep;
    fc.fillRect(x - 500, y - 200, 1000, 400);
    fc.globalCompositeOperation = 'source-over';

    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.drawImage(flowC, 0, y - 200);
    ctx.restore();

    // === Pass 6: Edge highlight ===
    ctx.save();
    ctx.filter = 'blur(2px)';
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#FFF8E0';
    ctx.font = fontStr;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('金榜题名', x - 2, y - 2);
    ctx.restore();

    // === Pass 7: Particle脱落 around text ===
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = fontSize * 0.5 + Math.random() * fontSize * 0.6;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist * 0.6;
      const ps = 0.5 + Math.random() * 1.5;
      const pa = 0.02 + Math.random() * 0.08;
      ctx.fillStyle = `rgba(212,168,71,${pa})`;
      ctx.beginPath(); ctx.arc(px, py, ps, 0, Math.PI * 2); ctx.fill();
    }
  }

  drawCinematicTitle(ctx, W / 2, titleY);

  // ── Subtitle beneath title ──
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(200,160,120,0.35)';
  ctx.font = '400 24px "Noto Serif SC","SimSun",serif';
  // Slight shadow for readability
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 20; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
  ctx.fillText('愿此去提笔，皆有山河', W / 2, titleY + 130);
  ctx.shadowBlur = 0;

  // ============================================
  // 9. ANCIENT SCROLL — user info (not UI card)
  // ============================================
  const scrollY = titleY + 210;
  const scrollCX = W / 2;
  const scrollW = Math.round(W * 0.68);
  const scrollH = 230;
  const scrollX = scrollCX - scrollW / 2;

  // Paper noise for scroll
  const paperTile = document.createElement('canvas');
  paperTile.width = 64; paperTile.height = 64;
  const ptc = paperTile.getContext('2d');
  const ptData = ptc.createImageData(64, 64);
  for (let i = 0; i < ptData.data.length; i += 4) {
    const v = 160 + Math.random() * 50;
    ptData.data[i] = v; ptData.data[i+1] = v - 10; ptData.data[i+2] = v - 20;
    ptData.data[i+3] = 15;
  }
  ptc.putImageData(ptData, 0, 0);

  // Draw paper scroll with irregular edges
  ctx.save();

  // Shadow under scroll
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 30; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 4;

  // Scroll base shape (slightly irregular edges using sine perturbation)
  ctx.beginPath();
  const ripple = 4; // amplitude of edge irregularity
  const steps = 40;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const bx = scrollX + t * scrollW;
    const by = scrollY + Math.sin(t * Math.PI * 6) * ripple * (t < 0.3 || t > 0.7 ? 0.5 : 1);
    if (i === 0) ctx.moveTo(bx, by);
    else ctx.lineTo(bx, by);
  }
  // Right edge
  for (let i = 1; i <= 10; i++) {
    const t = i / 10;
    ctx.lineTo(scrollX + scrollW + Math.sin(t * Math.PI * 3) * 2, scrollY + t * scrollH);
  }
  // Bottom edge (reverse with waves)
  for (let i = 0; i <= steps; i++) {
    const t = 1 - i / steps;
    const bx = scrollX + t * scrollW;
    const by = scrollY + scrollH + Math.sin(t * Math.PI * 6 + 2) * ripple * (t < 0.3 || t > 0.7 ? 0.5 : 1);
    ctx.lineTo(bx, by);
  }
  // Left edge
  for (let i = 1; i < 10; i++) {
    const t = 1 - i / 10;
    ctx.lineTo(scrollX + Math.sin(t * Math.PI * 3) * 2, scrollY + t * scrollH);
  }
  ctx.closePath();

  // Fill with aged paper color
  ctx.fillStyle = 'rgba(30,18,10,0.55)';
  ctx.fill();
  ctx.shadowBlur = 0;

  // Paper texture overlay onto scroll
  ctx.save();
  ctx.beginPath();
  // Redraw the same path for clipping
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const bx = scrollX + t * scrollW;
    const by = scrollY + Math.sin(t * Math.PI * 6) * ripple * (t < 0.3 || t > 0.7 ? 0.5 : 1);
    if (i === 0) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
  }
  for (let i = 1; i <= 10; i++) { const t = i / 10; ctx.lineTo(scrollX + scrollW + Math.sin(t * Math.PI * 3) * 2, scrollY + t * scrollH); }
  for (let i = 0; i <= steps; i++) { const t = 1 - i / steps; const bx = scrollX + t * scrollW; const by = scrollY + scrollH + Math.sin(t * Math.PI * 6 + 2) * ripple * (t < 0.3 || t > 0.7 ? 0.5 : 1); ctx.lineTo(bx, by); }
  for (let i = 1; i < 10; i++) { const t = 1 - i / 10; ctx.lineTo(scrollX + Math.sin(t * Math.PI * 3) * 2, scrollY + t * scrollH); }
  ctx.closePath();
  ctx.clip();

  // Tile paper texture
  ctx.globalAlpha = 0.35;
  for (let tx = scrollX; tx < scrollX + scrollW; tx += 64)
    for (let ty = scrollY; ty < scrollY + scrollH; ty += 64)
      ctx.drawImage(paperTile, tx, ty);
  ctx.globalAlpha = 1;
  ctx.restore();

  // Ink border (inner stroke, subtle)
  ctx.strokeStyle = 'rgba(80,60,40,0.15)'; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const bx = scrollX + t * scrollW;
    const by = scrollY + Math.sin(t * Math.PI * 6) * ripple * (t < 0.3 || t > 0.7 ? 0.5 : 1);
    if (i === 0) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
  }
  for (let i = 1; i <= 10; i++) { const t = i / 10; ctx.lineTo(scrollX + scrollW + Math.sin(t * Math.PI * 3) * 2, scrollY + t * scrollH); }
  for (let i = 0; i <= steps; i++) { const t = 1 - i / steps; const bx = scrollX + t * scrollW; const by = scrollY + scrollH + Math.sin(t * Math.PI * 6 + 2) * ripple * (t < 0.3 || t > 0.7 ? 0.5 : 1); ctx.lineTo(bx, by); }
  for (let i = 1; i < 10; i++) { const t = 1 - i / 10; ctx.lineTo(scrollX + Math.sin(t * Math.PI * 3) * 2, scrollY + t * scrollH); }
  ctx.closePath(); ctx.stroke();

  // ── Scroll content ──
  const EXAM_MAP = { gaokao:'高考', zhongkao:'中考', jiaozi:'教资', kaoyan:'考研' };
  const displayName = userData.name || '善信';

  // Decorative top line
  ctx.fillStyle = 'rgba(180,140,100,0.08)';
  ctx.fillRect(scrollX + 30, scrollY + 18, scrollW - 60, 1);

  // Vertical left accent
  ctx.fillStyle = 'rgba(180,140,100,0.1)';
  ctx.fillRect(scrollX + 18, scrollY + 30, 2, scrollH - 60);

  // User name (large ink calligraphy style)
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#D4C4A0';
  ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 8; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
  ctx.font = 'bold 52px "Noto Serif SC","SimSun",serif';
  ctx.fillText(displayName, scrollX + 36, scrollY + 75);
  ctx.shadowBlur = 0;

  // Exam type (毛笔小字)
  const examLabel = EXAM_MAP[userData.exam] || userData.exam;
  ctx.fillStyle = 'rgba(200,170,130,0.5)';
  ctx.font = '18px "Noto Serif SC","PingFang SC",serif';
  ctx.fillText('· ' + examLabel + ' ·', scrollX + 36 + ctx.measureText(displayName).width + 16, scrollY + 76);

  // Wish text (ink style)
  const wishText = userData.wish ? '愿：' + userData.wish : '';
  if (wishText) {
    ctx.fillStyle = 'rgba(200,170,130,0.4)';
    ctx.font = '17px "Noto Serif SC","PingFang SC",serif';
    ctx.fillText(wishText, scrollX + 36, scrollY + 125);
  }

  // ── Fortune label (right side, vertical style) ──
  const fortuneColors = {
    'da-ji':'rgba(180,50,50,0.5)', 'shang-qian':'rgba(200,160,100,0.5)',
    'jin-bang':'rgba(220,200,130,0.5)', 'wen-yun':'rgba(190,160,80,0.5)',
    'zi-qi':'rgba(140,100,180,0.4)', 'wen-qu':'rgba(80,140,200,0.4)'
  };
  ctx.textAlign = 'right';
  ctx.fillStyle = fortuneColors[currentFortune.cls] || 'rgba(200,170,130,0.4)';
  ctx.font = 'bold 36px "Noto Serif SC","SimSun",serif';
  ctx.fillText(currentFortune.label, scrollX + scrollW - 36, scrollY + 80);

  // Small label above fortune
  ctx.fillStyle = 'rgba(180,140,100,0.2)';
  ctx.font = '12px "PingFang SC",sans-serif';
  ctx.fillText('祈愿灵签', scrollX + scrollW - 36, scrollY + 48);

  // ── Red seal stamp ──
  const sealX = scrollX + scrollW - 50;
  const sealY = scrollY + 158;
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.rotate(-0.12);
  ctx.shadowColor = 'rgba(180,50,50,0.15)'; ctx.shadowBlur = 15; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = 'rgba(180,50,50,0.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(180,50,50,0.12)';
  ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(180,50,50,0.45)';
  ctx.font = '13px "Noto Serif SC","SimSun",serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowBlur = 0;
  ctx.fillText('文昌', 0, 2);
  ctx.restore();

  // Ink splatter dots near scroll (decorative)
  for (let i = 0; i < 8; i++) {
    const sx = scrollX + Math.random() * scrollW;
    const sy = scrollY + scrollH + 8 + Math.random() * 10;
    const ss = 0.5 + Math.random() * 1.5;
    ctx.fillStyle = `rgba(60,40,30,${0.03 + Math.random() * 0.04})`;
    ctx.beginPath(); ctx.arc(sx, sy, ss, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();

  // ============================================
  // 10. DECORATIVE SEPARATOR & SERIAL
  // ============================================
  const sepY = H - 220;

  // Subtle gold line
  ctx.strokeStyle = 'rgba(200,160,120,0.04)'; ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(W * 0.25, sepY); ctx.lineTo(W * 0.75, sepY);
  ctx.stroke();

  // Decorative dots along line
  for (let i = 0; i < 16; i++) {
    const dx = W * 0.25 + (W * 0.5) / 15 * i;
    ctx.fillStyle = `rgba(200,160,120,${0.02 + (i % 2) * 0.02})`;
    ctx.fillRect(dx, sepY - 1, 1, 3);
  }

  // Serial number
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(200,160,120,0.08)';
  ctx.font = '11px "PingFang SC",sans-serif';
  const serial = 'No.' + new Date().toISOString().slice(0,10).replace(/-/g,'') +
    Math.random().toString(36).slice(2,6).toUpperCase();
  ctx.fillText('◇ ' + serial + ' ◇', W / 2, sepY + 24);

  // ============================================
  // 11. BRAND & FOOTER
  // ============================================
  ctx.fillStyle = 'rgba(180,50,50,0.25)';
  ctx.font = '13px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('思贤学习站 · 中高考助力计划', W / 2, sepY + 60);

  ctx.fillStyle = 'rgba(200,160,120,0.06)';
  ctx.font = '10px "PingFang SC",sans-serif';
  ctx.fillText('山东省济南市商河县 · 155-6412-8008', W / 2, sepY + 82);

  // ============================================
  // 12. FOREGROUND — Depth of Field elements
  // ============================================

  // ── Large blurred petals (foreground DOF) ──
  ctx.save();
  // Simulate blur with multiple low-opacity passes
  for (let i = 0; i < 8; i++) {
    const px = (i < 4) ? Math.random() * W * 0.3 : W * 0.7 + Math.random() * W * 0.3;
    const py = H * 0.5 + Math.random() * H * 0.4;
    const size = 40 + Math.random() * 60;
    const rot = Math.random() * Math.PI * 2;
    const alpha = 0.04 + Math.random() * 0.06;

    // Multi-pass blur simulation
    for (let pass = 0; pass < 5; pass++) {
      ctx.globalAlpha = alpha / (pass + 1);
      ctx.fillStyle = `rgba(255,180,190,${0.3})`;
      ctx.save();
      ctx.translate(px + pass * 3, py - pass * 2);
      ctx.rotate(rot + pass * 0.05);
      ctx.beginPath();
      ctx.ellipse(0, 0, size + pass * 4, (size + pass * 4) * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // ── Foreground large light orbs (out of focus) ──
  ctx.save();
  ctx.filter = 'blur(12px)';
  for (let i = 0; i < 5; i++) {
    const ox = (i < 2) ? -30 + Math.random() * 80 : W - 80 + Math.random() * 80;
    const oy = H * 0.6 + Math.random() * H * 0.3;
    const os = 40 + Math.random() * 80;
    const oa = 0.02 + Math.random() * 0.03;
    const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, os);
    og.addColorStop(0, `rgba(212,168,71,${oa * 2})`);
    og.addColorStop(1, `rgba(212,168,71,0)`);
    ctx.fillStyle = og;
    ctx.beginPath(); ctx.arc(ox, oy, os, 0, Math.PI * 2); ctx.fill();
  }
  ctx.filter = 'none';
  ctx.restore();

  // ============================================
  // 13. GOLD DUST & FLOATING PARTICLES
  // ============================================
  for (let i = 0; i < 35; i++) {
    const gx = Math.random() * W;
    const gy = templeY + 200 + Math.random() * (H - templeY - 300);
    const gs = 1 + Math.random() * 3.5;
    const ga = 0.03 + Math.random() * 0.10;

    // Glow halo
    const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gs * 4);
    gg.addColorStop(0, `rgba(212,168,71,${ga})`);
    gg.addColorStop(1, 'rgba(212,168,71,0)');
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(gx, gy, gs * 4, 0, Math.PI * 2); ctx.fill();

    // Core
    ctx.fillStyle = `rgba(240,210,160,${ga * 1.5})`;
    ctx.beginPath(); ctx.arc(gx, gy, gs, 0, Math.PI * 2); ctx.fill();
  }

  // ── Motion trail particles (dynamic feel) ──
  for (let i = 0; i < 12; i++) {
    const mx = Math.random() * W, my = H * 0.3 + Math.random() * H * 0.5;
    const ms = 2 + Math.random() * 3;
    const ma = 0.04 + Math.random() * 0.06;
    // Trail
    for (let t = 1; t <= 3; t++) {
      ctx.fillStyle = `rgba(212,168,71,${ma / (t * 1.5)})`;
      ctx.beginPath();
      ctx.arc(mx - t * 8, my + t * 5, ms * (1 - t * 0.15), 0, Math.PI * 2);
      ctx.fill();
    }
    // Head
    ctx.fillStyle = `rgba(240,210,160,${ma * 1.5})`;
    ctx.beginPath(); ctx.arc(mx, my, ms, 0, Math.PI * 2); ctx.fill();
  }

  // ============================================
  // 14. PAPER TEXTURE OVERLAY (subtle, full frame)
  // ============================================
  drawPaperNoise(ctx, W, H, 1.8);

  // ============================================
  // 15. VIGNETTE (cinematic dark corners)
  // ============================================
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(0.5, 'rgba(0,0,0,0.03)');
  vig.addColorStop(0.75, 'rgba(0,0,0,0.08)');
  vig.addColorStop(1, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

  // ============================================
  // 16. ATMOSPHERIC PERSPECTIVE (bottom fog)
  // ============================================
  const atmFog = ctx.createLinearGradient(0, H * 0.85, 0, H);
  atmFog.addColorStop(0, 'rgba(5,2,2,0)');
  atmFog.addColorStop(0.5, 'rgba(8,3,3,0.08)');
  atmFog.addColorStop(1, 'rgba(10,5,5,0.15)');
  ctx.fillStyle = atmFog; ctx.fillRect(0, H * 0.85, W, H * 0.15);

  // ============================================
  // 17. FINAL BLOOM OVERLAY
  // ============================================
  const finalBloom = ctx.createRadialGradient(W / 2, lightCY, 0, W / 2, lightCY, H * 0.45);
  finalBloom.addColorStop(0, 'rgba(212,168,71,0.01)');
  finalBloom.addColorStop(1, 'rgba(212,168,71,0)');
  ctx.fillStyle = finalBloom; ctx.fillRect(0, 0, W, H);

  // ============================================
  // SHOW POSTER
  // ============================================
  document.getElementById('posterSection').style.display = 'block';
  document.getElementById('posterSection').classList.add('visible');
}

// ===== Save Poster =====

// ===== Save Poster =====
function savePosterImg() {
  const canvas = document.getElementById('posterCanvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = '孔庙祈福_' + new Date().toISOString().slice(0,10) + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('海报已保存');
}

// ===== Share =====
function sharePoster() {
  const canvas = document.getElementById('posterCanvas');
  if (!canvas) return;
  // Try Web Share API
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], '孔庙祈福.png', { type:'image/png' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files:[file] })) {
      try {
        await navigator.share({ files:[file], title:'孔庙祈福', text:'来为我祈福吧！' });
        showToast('分享成功！解锁状元签 🎉');
        return;
      } catch(e) {}
    }
    // Fallback: copy image to clipboard
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      showToast('海报已复制，快去分享到朋友圈吧！');
    } catch(e) {
      // Final fallback: save
      savePosterImg();
    }
  });
}

// ===== Toast =====
function showToast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div'); el.id = 'toast'; el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

// ===== Smooth scroll buttons =====
function scrollToForm() {
  document.getElementById('formSection').style.display = 'block';
  document.getElementById('formSection').scrollIntoView({ behavior:'smooth', block:'start' });
  setTimeout(() => document.getElementById('formSection').classList.add('visible'), 100);
}
function scrollToFormOther() {
  document.getElementById('prayerName').value = '';
  document.getElementById('prayerName').placeholder = '输入对方姓名（如：孩子、学生...）';
  scrollToForm();
}
