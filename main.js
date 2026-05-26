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

// 状元签（分享后解锁）
const ZHUANGYUAN = { type:'状元签', cls:'zhuang-yuan', label:'状元签', poem:'春风得意占鳌头，金榜题名天下知。', desc:'独占鳌头，天下皆知。你是天选之子，此战必夺魁首，荣登状元之位。' };

function getAvailableFortunes() {
  return localStorage.getItem('zy_unlocked') ? [...FORTUNES, ZHUANGYUAN] : FORTUNES;
}

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
    preloadTemplates();
    // 自动播放背景音乐
    startMusic();
    document.getElementById('audioToggle').textContent = '🎵';
    // 状元签解锁状态
    if (localStorage.getItem('zy_unlocked')) {
      const btn = document.getElementById('unlockBtn');
      if (btn) { btn.textContent = '✅ 状元签已解锁'; btn.disabled = true; }
    }
  }, 2500);
  // 首次点击页面时确保音频已启动（绕过浏览器自动播放限制）
  document.addEventListener('click', () => {
    if (!isMusicPlaying) {
      startMusic();
      document.getElementById('audioToggle').textContent = '🎵';
    }
  }, { once: true });
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

// 随机钟声
const BELL_SOURCES = [];
for (let i = 1; i <= 5; i++) {
  const a = new Audio('assets/bells/' + i + '.mp3');
  a.volume = 1.0;
  BELL_SOURCES.push(a);
}

function playBell() {
  try {
    const idx = Math.floor(Math.random() * BELL_SOURCES.length);
    const clone = BELL_SOURCES[idx].cloneNode();
    clone.volume = 1.0;
    clone.play().catch(() => {});
  } catch(e) {}
}


// Background music - MP3 loop
const bgmAudio = new Audio('assets/bgm.mp3');
bgmAudio.loop = true;
bgmAudio.volume = 0.3;

function startMusic() {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  bgmAudio.play().catch(() => { isMusicPlaying = false; });
}

function stopMusic() {
  isMusicPlaying = false;
  bgmAudio.pause();
  bgmAudio.currentTime = 0;
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
    playBell();
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
  const pool = getAvailableFortunes();
  currentFortune = pool[Math.floor(Math.random() * pool.length)];
  const card = document.getElementById('slipCard');
  card.className = 'slip-card';
  card.innerHTML = `
    <div class="slip-type ${currentFortune.cls}">${currentFortune.label}</div>
    <div class="slip-poem">${currentFortune.poem}</div>
    <div class="slip-desc">${currentFortune.desc}</div>
    <div class="slip-seal">${currentFortune.label === '大吉' ? '大吉' : '文昌'}</div>
  `;
  setTimeout(() => card.classList.add('visible'), 100);
  playBell();
  burstParticles('#D4A847', 40);
  burstParticles('#F0D68A', 30);
  // Update poster section
  setTimeout(generatePoster, 600);
}

function drawFortuneAgain() {
  const pool = getAvailableFortunes();
  currentFortune = pool[Math.floor(Math.random() * pool.length)];
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
  playBell();
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

// ===== Template Image Cache =====
const templateCache = {};

function loadTemplate(src) {
  return new Promise((resolve) => {
    if (templateCache[src]) { resolve(templateCache[src]); return; }
    const img = new Image();
    img.onload = () => { templateCache[src] = img; resolve(img); };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function preloadTemplates() {
  // 预加载所有灵签模板，文件名 = 类型名.png
  ['da-ji','shang-qian','jin-bang','wen-yun','zi-qi','wen-qu','zhuang-yuan'].forEach(t => {
    loadTemplate('assets/' + t + '.png');
  });
}

// ===== Poster Generation =====
async function generatePoster() {
  const canvas = document.getElementById('posterCanvas');
  if (!canvas || !userData || !currentFortune) return;

  const src = 'assets/' + currentFortune.cls + '.png';

  const img = await loadTemplate(src);
  if (!img) { showToast('模板加载失败，请重试'); return; }

  const ctx = canvas.getContext('2d');
  const W = img.naturalWidth, H = img.naturalHeight; // 941 x 1672
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

    ctx.drawImage(img, 0, 0, W, H);

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
        showToast('分享成功！记得点击"我已分享"解锁状元签 🎉');
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

// ===== Unlock 状元签 =====
function unlockZhuangyuan() {
  if (localStorage.getItem('zy_unlocked')) {
    showToast('状元签已解锁，快去抽签吧！');
    return;
  }
  localStorage.setItem('zy_unlocked', 'true');
  document.getElementById('unlockBtn').textContent = '✅ 状元签已解锁';
  document.getElementById('unlockBtn').disabled = true;
  showToast('🎉 状元签已解锁！下次抽签有机会抽到');
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
