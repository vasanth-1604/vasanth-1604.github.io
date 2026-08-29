/* ============================================================
   VASANTH A — Portfolio JS
   Scroll reveal · Mobile nav · Incident board · Lightbox · Contact
   ============================================================ */

'use strict';

/* ── Reduced motion check ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Scroll reveal ── */
if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  // Immediately make everything visible for reduced-motion users
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

/* ── Mobile nav ── */
(function () {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── Nav scroll border ── */
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const update = () => {
    nav.style.borderBottomColor = window.scrollY > 10 ? 'var(--border)' : 'transparent';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── Active nav link ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => {
          const active = a.getAttribute('href') === '#' + entry.target.id;
          a.style.color = active ? 'var(--text)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ── Incident board — accordion ── */
(function () {
  const board = document.getElementById('incident-board');
  if (!board) return;

  board.addEventListener('click', e => {
    const header = e.target.closest('.incident-card-header');
    if (!header) return;

    const card = header.closest('.incident-card');
    const isOpen = card.classList.toggle('open');

    // Update ARIA
    header.setAttribute('aria-expanded', String(isOpen));

    // Close other cards (optional — remove if you prefer multi-open)
    board.querySelectorAll('.incident-card.open').forEach(other => {
      if (other !== card) {
        other.classList.remove('open');
        other.querySelector('.incident-card-header')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Keyboard support — Enter / Space on header
  board.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const header = e.target.closest('.incident-card-header');
    if (!header) return;
    e.preventDefault();
    header.click();
  });
})();

/* ── Image lightbox ── */
(function () {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbClose   = document.getElementById('lightbox-close');
  if (!lightbox || !lbImg) return;

  const open = (src, alt) => {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  // Trigger on cs-visual clicks
  document.querySelectorAll('.cs-visual').forEach(visual => {
    const img = visual.querySelector('img');
    if (!img) return;

    visual.addEventListener('click', () => open(img.src, img.alt));
    visual.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img.src, img.alt); }
    });
  });

  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── Email copy ── */
(function () {
  const EMAIL = 'a.vasanth1602@gmail.com';
  document.querySelectorAll('[data-copy-email]').forEach(el => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(EMAIL);
        const valueEl = el.querySelector('.contact-link-value');
        if (valueEl) {
          const orig = valueEl.textContent;
          valueEl.textContent = 'Copied to clipboard';
          valueEl.style.color = 'var(--green)';
          setTimeout(() => {
            valueEl.textContent = orig;
            valueEl.style.color = '';
          }, 2000);
        }
      } catch (_) {
        window.location.href = 'mailto:' + EMAIL;
      }
    });
  });
})();

/* ── Formspree contact form ── */
(function () {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    status.textContent = '';

    try {
      const res = await fetch('https://formspree.io/f/xaeyyrdn', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        form.reset();
        status.textContent = 'Message sent — I\'ll reply soon.';
        status.style.color = 'var(--green)';
        btn.textContent = 'Sent';
      } else {
        throw new Error('non-ok');
      }
    } catch (_) {
      status.textContent = 'Something went wrong. Email me directly.';
      status.style.color = 'var(--red)';
      btn.textContent = orig;
      btn.disabled = false;
    }
  });
})();
