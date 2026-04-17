/* ================================================
   JITPATEL WEB DEV — PORTFOLIO JAVASCRIPT
   Handles: Filters, Modal
   ================================================ */

'use strict';

/* ---- FILTER SYSTEM ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioCards.forEach((card, i) => {
      const cat = card.dataset.category;
      const match = filter === 'all' || cat === filter;

      if (match) {
        card.classList.remove('hidden');
        card.style.animationDelay = `${i * 0.06}s`;
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });
  });
});

/* ---- PROJECT MODAL ---- */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

function openModal(btn) {
  const card = btn.closest('.portfolio-card');
  if (!card || !modalOverlay) return;

  const title = card.dataset.title;
  const tech = card.dataset.tech;
  const desc = card.dataset.desc;
  const year = card.dataset.year;
  const cat = card.querySelector('.portfolio-cat')?.textContent || '';
  const bg = card.querySelector('.portfolio-card-img')?.style.background || '';

  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalCat').textContent = cat;
  document.getElementById('modalYear').textContent = `Year: ${year}`;
  document.getElementById('modalPreview').style.background = bg;
  document.getElementById('modalPreview').textContent = '';

  // Tech pills
  const techContainer = document.getElementById('modalTech');
  techContainer.innerHTML = '';
  tech.split(',').forEach(t => {
    const pill = document.createElement('span');
    pill.className = 'modal-tech-pill';
    pill.textContent = t.trim();
    techContainer.appendChild(pill);
  });

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (modalOverlay) modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Make openModal global so HTML onclick works
window.openModal = openModal;
