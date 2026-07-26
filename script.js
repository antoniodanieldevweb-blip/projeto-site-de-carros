(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* ---------------------------------------------------------------
     Footer year
  --------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     Nav: scrolled state + mobile toggle
  --------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const setNavState = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  setNavState();
  window.addEventListener('scroll', setNavState, { passive: true });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      nav.classList.toggle('menu-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        nav.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------
     Marquee: duplicate track content for a seamless infinite loop
  --------------------------------------------------------------- */
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  /* ---------------------------------------------------------------
     Hero scroll-scrub: image pans/scales tied to scroll position,
     title/scrim fade as the hero leaves the viewport.
  --------------------------------------------------------------- */
  const hero = document.querySelector('.hero');
  const heroImg = document.getElementById('heroImg');
  const heroContent = document.querySelector('.hero__content');

  if (hero && heroImg && !prefersReducedMotion) {
    let ticking = false;

    const updateHero = () => {
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 at top of viewport, 1 once hero has fully scrolled past
      const progress = Math.min(Math.max(-rect.top / vh, 0), 1);

      const scale = 1 + progress * 0.18;
      const translateY = progress * 60;
      heroImg.style.transform = `scale(${scale}) translateY(${translateY}px)`;

      if (heroContent) {
        heroContent.style.transform = `translateY(${progress * 90}px)`;
        heroContent.style.opacity = String(1 - progress * 1.15);
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHero);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateHero);
    updateHero();
  }

  /* ---------------------------------------------------------------
     Scroll reveal: fade-up for cards, process steps, testimonials
  --------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach((el, i) => {
      el.style.transitionDelay = prefersReducedMotion ? '0ms' : `${(i % 3) * 90}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------
     Stat counters: animate numbers up when the section enters view
  --------------------------------------------------------------- */
  const statNums = document.querySelectorAll('.stat__num');

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statNums.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (prefersReducedMotion) {
            const target = entry.target.getAttribute('data-count');
            const suffix = entry.target.getAttribute('data-suffix') || '';
            entry.target.textContent = target + suffix;
          } else {
            animateCount(entry.target);
          }
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNums.forEach(el => statObserver.observe(el));
  }

  /* ---------------------------------------------------------------
     Pass the chosen model's name into the WhatsApp CTA message
  --------------------------------------------------------------- */
  document.querySelectorAll('.card__link').forEach(link => {
    link.addEventListener('click', () => {
      const model = link.getAttribute('data-model');
      const ctaWhats = document.getElementById('ctaWhats');
      if (model && ctaWhats) {
        const msg = `Olá, gostaria de consultar a disponibilidade do modelo VELLARIS ${model}.`;
        ctaWhats.href = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`;
      }
    });
  });

})();

