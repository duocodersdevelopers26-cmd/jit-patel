/* ================================================
   JITPATEL WEB DEV — MAIN JAVASCRIPT
   Handles: Preloader, Cursor, Canvas, Scroll FX,
            Navbar, Stats Counter, Hamburger Menu
   ================================================ */

'use strict';

/* ---- PRELOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1800);
  document.body.style.overflow = 'hidden';
});

/* ---- HERO CANVAS — Particle Network ---- */
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        this.color = Math.random() > 0.5 ? '#E4A464' : '#CD853F';
      } else {
        this.color = Math.random() > 0.5 ? '#CD853F' : '#B7410E';
      }
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.save();
          ctx.globalAlpha = alpha;
          const currentTheme = document.documentElement.getAttribute('data-theme');
          ctx.strokeStyle = currentTheme === 'dark' ? '#E4A464' : '#CD853F';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animateCanvas);
  }

  resizeCanvas();
  initParticles();
  animateCanvas();

  const ro = new ResizeObserver(() => {
    resizeCanvas();
    initParticles();
  });
  ro.observe(canvas);
}

/* ---- NAVBAR SCROLL EFFECT ---- */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (navbar) {
    if (sy > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    // Hide on scroll down, show on scroll up
    if (sy > lastScrollY && sy > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
  }
  lastScrollY = sy;
}, { passive: true });

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal-item')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.08}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-item').forEach(el => revealObserver.observe(el));

/* ---- STATS COUNTER ---- */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count, 10);
      animateCounter(entry.target, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => statsObserver.observe(el));

/* ---- PARALLAX HERO TITLE ---- */
document.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content') || document.querySelector('.page-hero-content');
  if (heroContent) {
    const scrollY = window.scrollY;
    heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroContent.style.opacity = `${1 - scrollY / 600}`;
  }
}, { passive: true });

/* ---- SMOOTH ANCHOR SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- ACTIVE NAV LINK ---- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

/* ---- THEME TOGGLE ---- */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply the current theme on page load
if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  if (themeIcon) themeIcon.textContent = '☀️';
} else {
  document.documentElement.removeAttribute('data-theme');
  if (themeIcon) themeIcon.textContent = '🌙';
}

// Theme toggle functionality
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }

    // Update particle colors for the new theme
    updateParticleColors(newTheme);
  });
}

// Function to update particle colors based on theme
function updateParticleColors(theme) {
  if (typeof particles !== 'undefined' && particles.length > 0) {
    particles.forEach(particle => {
      if (theme === 'dark') {
        particle.color = Math.random() > 0.5 ? '#E4A464' : '#CD853F';
      } else {
        particle.color = Math.random() > 0.5 ? '#CD853F' : '#B7410E';
      }
    });
  }
  // Force a redraw to update connection lines
  if (typeof animId !== 'undefined') {
    cancelAnimationFrame(animId);
    animateCanvas();
  }
}
