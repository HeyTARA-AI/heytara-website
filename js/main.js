/* ===================================================
   HeyTARA Website — main.js
   Scroll animations, counters, mobile nav, form handler
   =================================================== */

// ─────────────────────────────────────────────────────
// MOBILE NAV
// ─────────────────────────────────────────────────────
(function initNav() {
  const burger = document.getElementById('nav-burger');
  const mobileNav = document.getElementById('nav-mobile');
  const nav = document.querySelector('.nav');

  if (!burger || !mobileNav) return;

  burger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      mobileNav.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', false);
    }
  });

  // Nav scroll state
  const updateNavScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', false);
    });
  });
})();

// ─────────────────────────────────────────────────────
// INTERSECTION OBSERVER — SCROLL ANIMATIONS
// ─────────────────────────────────────────────────────
(function initScrollAnimations() {
  const selectors = [
    '.fade-in',
    '.stat-card',
    '.encounter-card',
    '.step-card',
    '.result-card',
    '.workflow-step',
    '.wf-step',
    '.channel__inner',
    '.channel__card',
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep visible state stable
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  // Stagger children inside a parent
  const staggerParents = document.querySelectorAll(
    '.stat-grid, .encounter-grid, .results-grid, .steps, .workflow-diagram'
  );
  staggerParents.forEach(parent => {
    const children = parent.querySelectorAll(
      '.stat-card, .encounter-card, .result-card, .step-card, .workflow-step, .workflow-arrow, .wf-step'
    );
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.09}s`;
      observer.observe(child);
    });
  });

  // Individual elements
  document.querySelectorAll(selectors.join(',')).forEach(el => {
    if (!el.closest('.stat-grid, .encounter-grid, .results-grid, .steps, .workflow-diagram')) {
      observer.observe(el);
    }
  });
})();

// ─────────────────────────────────────────────────────
// ANIMATED STAT COUNTERS
// ─────────────────────────────────────────────────────
(function initCounters() {
  const formatNumber = (num, config) => {
    const { prefix = '', suffix = '', decimals = 0 } = config || {};
    let formatted;
    if (num >= 1000000) {
      formatted = (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000 && config.compact) {
      formatted = (num / 1000).toFixed(0) + 'K';
    } else {
      formatted = num.toFixed(decimals);
    }
    return prefix + formatted + suffix;
  };

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const raw = el.dataset.target || '0';
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0');
    const compact = el.dataset.compact === 'true';
    const duration = parseInt(el.dataset.duration || '1800');
    const target = parseFloat(raw);

    let start = null;

    const step = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const current = target * eased;

      // Format
      let display;
      if (compact && target >= 1000) {
        display = (current / 1000).toFixed(0) + 'K';
      } else {
        display = current.toFixed(decimals);
      }
      el.textContent = prefix + display + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + (compact && target >= 1000 ? (target/1000).toFixed(0) + 'K' : target.toFixed(decimals)) + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-counter]').forEach(el => {
    counterObserver.observe(el);
  });
})();

// ─────────────────────────────────────────────────────
// SMOOTH SCROLL for anchor links
// ─────────────────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─────────────────────────────────────────────────────
// DEMO FORM HANDLER
// ─────────────────────────────────────────────────────
(function initDemoForm() {
  const form = document.getElementById('demo-form');
  if (!form) return;

  const successEl = document.getElementById('form-success');
  const submitBtn = form.querySelector('.form-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name:      form.querySelector('#name')?.value.trim(),
      email:     form.querySelector('#email')?.value.trim(),
      restaurant: form.querySelector('#restaurant')?.value.trim(),
      locations: form.querySelector('#locations')?.value,
      message:   form.querySelector('#message')?.value.trim(),
      timestamp: new Date().toISOString(),
    };

    // Basic validation
    if (!data.name || !data.email || !data.restaurant) {
      showError(form, 'Please fill in all required fields.');
      return;
    }
    if (!isValidEmail(data.email)) {
      showError(form, 'Please enter a valid email address.');
      return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // Simulate API call (replace with real endpoint)
    try {
      // In production: await fetch('/api/demo', { method: 'POST', body: JSON.stringify(data), headers: {'Content-Type':'application/json'} });
      await sleep(1200);
      form.style.display = 'none';
      if (successEl) successEl.classList.add('show');
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book My Demo →';
      showError(form, 'Something went wrong. Please try again or email us directly.');
    }
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(form, msg) {
    let errEl = form.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-error';
      errEl.style.cssText = 'color:#C41E1E;font-size:.88rem;margin-top:.75rem;font-weight:500;';
      form.querySelector('.form-submit').insertAdjacentElement('afterend', errEl);
    }
    errEl.textContent = msg;
    setTimeout(() => { if (errEl) errEl.textContent = ''; }, 5000);
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
})();

// ─────────────────────────────────────────────────────
// WAVEFORM INTERACTION (hover pause)
// ─────────────────────────────────────────────────────
(function initWaveform() {
  const waveform = document.querySelector('.waveform');
  if (!waveform) return;

  waveform.addEventListener('mouseenter', () => {
    waveform.querySelectorAll('.waveform__bar').forEach(b => {
      b.style.animationPlayState = 'paused';
    });
  });
  waveform.addEventListener('mouseleave', () => {
    waveform.querySelectorAll('.waveform__bar').forEach(b => {
      b.style.animationPlayState = 'running';
    });
  });
})();

// ─────────────────────────────────────────────────────
// HERO PARALLAX (subtle, performance-safe)
// ─────────────────────────────────────────────────────
(function initParallax() {
  const orbs = document.querySelectorAll('.hero__orb');
  if (!orbs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 0.15;
          orb.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ─────────────────────────────────────────────────────
// ACTIVE NAV LINK (highlight current page)
// ─────────────────────────────────────────────────────
(function highlightActiveNav() {
  const path = window.location.pathname;
  const current = path.split('/').pop() || 'index.html';
  const inBlog = path.includes('/blog');
  document.querySelectorAll('.nav__links a:not(.nav__cta), .nav__mobile a:not(.nav__cta)').forEach(link => {
    const href = link.getAttribute('href');
    const hrefFile = href.split('/').pop();
    const isMatch = (hrefFile === current || (current === '' && hrefFile === 'index.html'));
    const isBlogLink = href.includes('blog');
    if (isMatch || (inBlog && isBlogLink)) {
      link.style.color = '#C41E1E';
      link.style.fontWeight = '700';
    }
  });
})();

// ─────────────────────────────────────────────────────
// STICKY CTA — show after scrolling past hero
// ─────────────────────────────────────────────────────
(function initStickyCta() {
  const stickyCta = document.getElementById('stickyCta');
  const hero = document.querySelector('.hero');
  const footer = document.querySelector('.footer');
  if (!stickyCta || !hero) return;
  if (window.location.pathname.includes('contact')) {
    stickyCta.style.display = 'none';
    return;
  }
  var pastHero = false;
  var inFooter = false;
  var heroObs = new IntersectionObserver(function(entries) {
    pastHero = !entries[0].isIntersecting;
    stickyCta.classList.toggle('visible', pastHero && !inFooter);
  }, { threshold: 0 });
  heroObs.observe(hero);
  if (footer) {
    var footerObs = new IntersectionObserver(function(entries) {
      inFooter = entries[0].isIntersecting;
      stickyCta.classList.toggle('visible', pastHero && !inFooter);
    }, { threshold: 0 });
    footerObs.observe(footer);
  }
})();

// ─────────────────────────────────────────────────────
// FAQ ACCORDION
// ─────────────────────────────────────────────────────
(function initFaq() {
  document.querySelectorAll('.faq-item__q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(function(el) {
        el.classList.remove('active');
        el.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
