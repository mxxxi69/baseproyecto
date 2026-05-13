/* ============================================================
   main.js
   Lógica principal del sitio:
   - Navbar sticky con cambio de estilo al scroll
   - Menú móvil (hamburguesa)
   - Smooth scroll para links internos
   - IntersectionObserver para animaciones al scroll
   - Animaciones del hero
   - Contadores animados de estadísticas
   - Filtro de proyectos
   - Carrusel automático de clientes
   - Año actual en el footer
   - Navegación activa según sección visible
   ============================================================ */

'use strict';

/* ── Utilidad: esperar a que el DOM esté listo ────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // ── 1. NAVBAR: cambio de estilo al hacer scroll ──────────
  initNavbar();

  // ── 2. MENÚ MÓVIL ────────────────────────────────────────
  initMobileMenu();

  // ── 3. SMOOTH SCROLL para links del menú ─────────────────
  initSmoothScroll();

  // ── 4. ANIMACIONES DEL HERO ──────────────────────────────
  initHeroAnimations();

  // ── 5. SCROLL REVEAL (IntersectionObserver) ───────────────
  initScrollReveal();

  // ── 6. CONTADORES ANIMADOS ───────────────────────────────
  initCounters();

  // ── 7. FILTRO DE PROYECTOS ────────────────────────────────
  initProjectFilters();

  // ── 8. CARRUSEL DE CLIENTES (loop infinito) ───────────────
  initClientsCarousel();

  // ── 9. AÑO ACTUAL en footer ──────────────────────────────
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── 10. NAVEGACIÓN ACTIVA al hacer scroll ─────────────────
  initActiveNav();

});


/* ── 1. NAVBAR ────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 80; // px antes de activar el estilo "scrolled"

  const handleScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Usar scroll pasivo para mejor rendimiento
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Ejecutar al cargar por si ya estamos scrolleados
  handleScroll();
}


/* ── 2. MENÚ MÓVIL ────────────────────────────────────────── */
function initMobileMenu() {
  const toggle  = document.getElementById('menuToggle');
  const menu    = document.getElementById('mobileMenu');
  const links   = menu ? menu.querySelectorAll('.mobile-menu__link') : [];

  if (!toggle || !menu) return;

  // Abrir / cerrar al hacer clic en hamburguesa
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen.toString());
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar al hacer clic en un link
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Cerrar al hacer clic fuera (en el overlay oscuro del body)
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Cerrar con tecla Escape (accesibilidad)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}


/* ── 3. SMOOTH SCROLL ────────────────────────────────────── */
function initSmoothScroll() {
  // Selecciona todos los links que apuntan a un ancla interna (#...)
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 72;

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return; // Skip los links vacíos

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Calcular posición tomando en cuenta el navbar fijo
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}


/* ── 4. ANIMACIONES DEL HERO ─────────────────────────────── */
function initHeroAnimations() {
  // Los elementos del hero tienen clase .fade-in
  // Los activamos inmediatamente con clase .animated
  const heroElements = document.querySelectorAll('.fade-in');

  if (heroElements.length === 0) return;

  // Pequeño delay inicial para que el CSS cargue antes de la animación
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroElements.forEach(el => el.classList.add('animated'));
    });
  });
}


/* ── 5. SCROLL REVEAL ────────────────────────────────────── */
function initScrollReveal() {
  // IntersectionObserver: observa elementos y los anima cuando entran al viewport
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (revealElements.length === 0) return;

  const observerOptions = {
    threshold: 0.12,      // Se activa cuando el 12% del elemento es visible
    rootMargin: '0px 0px -50px 0px', // Un poco antes del borde inferior
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Una vez animado, dejamos de observar para optimizar
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}


/* ── 6. CONTADORES ANIMADOS ──────────────────────────────── */
function initCounters() {
  // Elementos con data-count="N" en las estadísticas del hero
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length === 0) return;

  /**
   * Anima un número del 0 hasta el valor objetivo
   * @param {HTMLElement} el  - Elemento span donde se muestra el número
   * @param {number} target   - Valor final
   * @param {number} duration - Duración en ms
   */
  const animateCounter = (el, target, duration = 1800) => {
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Función de easing: ease-out cúbico (empieza rápido, termina despacio)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target; // Asegurar el valor final exacto
      }
    };

    requestAnimationFrame(tick);
  };

  // Observar cuando el hero entra en pantalla para iniciar los contadores
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.count, 10);
          if (!isNaN(target)) {
            animateCounter(counter, target);
          }
        });
        observer.disconnect(); // Solo una vez
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) observer.observe(heroStats);
}


/* ── 7. FILTRO DE PROYECTOS ──────────────────────────────── */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Actualizar estado activo del botón
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      // Mostrar/ocultar cards con transición
      projectCards.forEach(card => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.style.display = '';
          // Pequeño delay para que la transición de display funcione
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Ocultar después de que termine la transición CSS
          setTimeout(() => {
            if (card.dataset.category !== filter && filter !== 'all') {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });

  // Aplicar transición inicial a todas las cards
  projectCards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
}


/* ── 8. CARRUSEL DE CLIENTES ─────────────────────────────── */
function initClientsCarousel() {
  const track = document.getElementById('clientsTrack');
  if (!track) return;

  // Duplicar el contenido para el efecto de loop infinito
  // (la animación CSS mueve el track -50%, y así siempre hay contenido)
  const originalContent = track.innerHTML;
  track.innerHTML = originalContent + originalContent;

  // La animación CSS `scrollClients` en animations.css hace el movimiento
  // Aquí solo necesitamos asegurarnos de que el track tenga el doble de contenido
}


/* ── 9. NAVEGACIÓN ACTIVA ────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__nav .nav__link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 72;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', isActive);
        });
      }
    });
  }, {
    // Observar cuando la sección está en el centro del viewport
    rootMargin: `-${navbarHeight}px 0px -60% 0px`,
    threshold: 0,
  });

  sections.forEach(section => observer.observe(section));
}
