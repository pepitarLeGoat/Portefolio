/* ---------- Injection automatique du header et du footer ---------- */
async function loadPartials() {
  try {
    const header = await fetch("partials/header.html").then(res => res.text());
    const footer = await fetch("partials/footer.html").then(res => res.text());

    // Insertion dans la page
    document.body.insertAdjacentHTML("afterbegin", header);
    document.body.insertAdjacentHTML("beforeend", footer);

    // Recharge les scripts liés au menu (mobile, dropdown, etc.)
    initHeaderScripts();
  } catch (error) {
    console.error("Erreur de chargement des partials:", error);
  }
}
loadPartials();

/* ---------- Scripts du header (menu déroulant + mobile) ---------- */
function initHeaderScripts() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('nav ul');

  mobileToggle?.addEventListener('click', () => {
    navList.classList.toggle('active');
    mobileToggle.classList.toggle('open');
  });
}

/* ---------- Mobile menu toggle ---------- */
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('nav ul');

mobileToggle?.addEventListener('click', () => {
  navList.classList.toggle('active');
  mobileToggle.classList.toggle('open');
});

/* ---------- Smooth scroll for hash links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------- Typing effect ---------- */
const typingEl = document.querySelector('.typing-text');
if (typingEl) {
  const text = typingEl.textContent.trim();
  typingEl.textContent = '';
  let idx = 0;
  (function type() {
    if (idx < text.length) {
      typingEl.textContent += text.charAt(idx++);
      setTimeout(type, 45);
    }
  })();
}

/* ---------- Fade-up on scroll (IntersectionObserver) ---------- */
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // if you want one-time animation, unobserve:
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => observer.observe(el));

/* ---------- Animated particle background (version plus dynamique) ---------- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

function setupCanvas() {
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.scale(dpr, dpr);
}
setupCanvas();
window.addEventListener('resize', setupCanvas);

/* Particules boostées */
const particles = [];
const PARTICLE_COUNT = Math.max(120, Math.floor(window.innerWidth / 10));

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 1, // plus grandes
      vx: (Math.random() - 0.5) * 1.2, // vitesse augmentée
      vy: (Math.random() - 0.5) * 1.2,
      hue: 200 + Math.random() * 100, // dégradé bleu-violet
    });
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // léger fond dégradé pour plus de contraste
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(10,10,30,0.3)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    // rebonds aux bords
    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

    // dessin des particules
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, 0.8)`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsla(${p.hue}, 80%, 70%, 1)`;
    ctx.fill();
  });

  // connexion entre particules proches
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 80%, 70%, ${(130 - dist) / 130 * 0.2})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);


/* ---------- Contact form simple feedback (local only) ---------- */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // fake quick feedback (no backend)
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Envoi...';
    setTimeout(() => {
      btn.textContent = 'Envoyé ✓';
      btn.style.background = 'linear-gradient(90deg,#06d6a0,#34d399)';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Envoyer ';
        btn.innerHTML = 'Envoyer <i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
        form.reset();
      }, 1400);
    }, 900);
  });
}
