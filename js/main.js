(() => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const updateScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', updateScroll, { passive: true }); updateScroll();
    const nav = navbar.querySelector('.nav-menu');
    if (nav) {
      if (!nav.id) nav.id = 'main-navigation';
      const toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'nav-toggle';
      toggle.textContent = 'Menú ☰'; toggle.setAttribute('aria-controls', nav.id); toggle.setAttribute('aria-expanded', 'false');
      navbar.insertBefore(toggle, nav);
      const compact = window.matchMedia('(max-width: 1100px)');
      function setOpen(open, focus = false) {
        navbar.dataset.menuOpen = String(open); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Cerrar ×' : 'Menú ☰';
        if (focus) (open ? nav.querySelector('a') : toggle)?.focus();
      }
      toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true', true));
      nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
      document.addEventListener('click', event => { if (!navbar.contains(event.target)) setOpen(false); });
      document.addEventListener('keydown', event => { if (event.key === 'Escape' && navbar.dataset.menuOpen === 'true') setOpen(false, true); });
      compact.addEventListener('change', () => setOpen(false));
    }
  }
  const elements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('show'); observer.unobserve(entry.target); } }); }, { threshold: 0 });
    elements.forEach(el => observer.observe(el));
  } else elements.forEach(el => el.classList.add('show'));
})();
