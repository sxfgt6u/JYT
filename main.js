// ============================================
// PARTICLE SYSTEM
// ============================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 2 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
    this.type = Math.random() > 0.8 ? 'gold' : 'blue';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += 0.02;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    const op = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    if (this.type === 'gold') {
      ctx.fillStyle = `rgba(240, 165, 0, ${op})`;
    } else {
      ctx.fillStyle = `rgba(0, 212, 255, ${op})`;
    }
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 10000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const op = (1 - dist / 120) * 0.08;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 212, 255, ${op})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// ============================================
// NAVBAR SCROLL
// ============================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav section
  const sections = ['hero', 'skills', 'learning', 'vision', 'contact'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= 100 && rect.bottom >= 100) {
      navLinks.forEach(l => l.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
});

// ============================================
// TYPEWRITER EFFECT
// ============================================
const phrases = [
  '> 智光商工 數位商管學生',
  '> 電子商務 熱情探索者',
  '> 智慧科技 好奇心驅動者',
  '> 未來商管跨領域人才',
];

let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typeWrite() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typeEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeWrite, 2200);
      return;
    }
    setTimeout(typeWrite, 60);
  } else {
    typeEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeWrite, 400);
      return;
    }
    setTimeout(typeWrite, 35);
  }
}

setTimeout(typeWrite, 800);

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ============================================
// RADAR CHART
// ============================================
function drawRadar() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 150;

  const labels = ['文書處理', '打字指法', '金融專業', '網頁開發', '商業思維', '電商知識'];
  const values = [0.82, 0.75, 0.68, 0.73, 0.80, 0.70];
  const n = labels.length;
  const angles = labels.map((_, i) => (i / n) * Math.PI * 2 - Math.PI / 2);

  // Draw grid
  for (let level = 1; level <= 5; level++) {
    ctx.beginPath();
    angles.forEach((a, i) => {
      const x = cx + (r * level / 5) * Math.cos(a);
      const y = cy + (r * level / 5) * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 + level * 0.02})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw axes
  angles.forEach(a => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Draw data with animation
  let progress = 0;
  function drawData() {
    progress = Math.min(progress + 0.025, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    // Clear data area only
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';

    // Data polygon
    ctx.beginPath();
    angles.forEach((a, i) => {
      const val = values[i] * eased;
      const x = cx + r * val * Math.cos(a);
      const y = cy + r * val * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Data points
    angles.forEach((a, i) => {
      const val = values[i] * eased;
      const x = cx + r * val * Math.cos(a);
      const y = cy + r * val * Math.sin(a);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Labels
    if (progress === 1) {
      ctx.font = '11px Noto Sans TC, sans-serif';
      ctx.fillStyle = 'rgba(125, 168, 200, 0.9)';
      ctx.textAlign = 'center';
      angles.forEach((a, i) => {
        const offset = 22;
        const lx = cx + (r + offset) * Math.cos(a);
        const ly = cy + (r + offset) * Math.sin(a);
        ctx.fillText(labels[i], lx, ly + 4);
      });
    }

    if (progress < 1) requestAnimationFrame(drawData);
  }

  drawData();
}

// ============================================
// INTERSECTION OBSERVER
// ============================================
const observerOpts = { threshold: 0.12 };

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

// Skill bars observer
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// Vision bars observer
const visionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.vp-bar').forEach(bar => {
        bar.style.width = bar.style.getPropertyValue('--target');
      });
      visionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Radar observer
const radarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      drawRadar();
      radarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// ============================================
// INIT OBSERVERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Reveal animation for cards
  const revealEls = [
    '#about-main', '#about-passion', '#about-school',
    '#skill-doc', '#skill-type', '#skill-finance', '#skill-web',
    '#tl1', '#tl2', '#tl3', '#tl4', '#tl5',
    '#vc1', '#vc2', '#vc3', '#vc4',
    '#cc1', '#cc2', '#cc3', '#cc4',
    '#terminal'
  ];
  revealEls.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) { el.classList.add('reveal'); revealObserver.observe(el); }
  });

  // Skill bars
  document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

  // Vision bars
  const visionGrid = document.querySelector('.vision-grid');
  if (visionGrid) visionObserver.observe(visionGrid);

  // Counter
  const statsEl = document.querySelector('.floating-stats');
  if (statsEl) counterObserver.observe(statsEl);

  // Radar
  const radarEl = document.querySelector('.skills-radar-wrapper');
  if (radarEl) radarObserver.observe(radarEl);

  // Add stagger delay to timeline items
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(el);
  });

  // Add stagger to stat cards
  document.querySelectorAll('.stat-card').forEach((el, i) => {
    el.style.animationDelay = `${1 + i * 0.15}s`;
  });
});

// ============================================
// MOUSE PARALLAX GLOW
// ============================================
document.addEventListener('mousemove', (e) => {
  const mx = e.clientX / window.innerWidth;
  const my = e.clientY / window.innerHeight;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.setProperty('--mx', mx);
    hero.style.setProperty('--my', my);
  }
});

// ============================================
// SMOOTH NAV SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// COPY PROFILE AVATAR
// ============================================
// Update avatar src to use local file
window.addEventListener('DOMContentLoaded', () => {
  const avatarImg = document.querySelector('.avatar-img');
  if (avatarImg) {
    // Try loading — if it fails, use a canvas-generated placeholder
    avatarImg.onerror = () => {
      const ph = document.createElement('canvas');
      ph.width = 130;
      ph.height = 130;
      const c = ph.getContext('2d');
      const grad = c.createRadialGradient(65, 65, 10, 65, 65, 65);
      grad.addColorStop(0, '#0a3050');
      grad.addColorStop(1, '#020b18');
      c.fillStyle = grad;
      c.fillRect(0, 0, 130, 130);
      c.font = '60px serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('🎓', 65, 65);
      avatarImg.src = ph.toDataURL();
    };
  }
});
