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
    if (!isOpen) mobileNav.classList.remove('industries-open');
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

  // Mobile Industries group: collapsed by default, tap the heading to expand
  const indHeading = mobileNav.querySelector('.nav__mobile-heading');
  if (indHeading) {
    mobileNav.classList.add('nav__mobile--collapsible');
    indHeading.setAttribute('role', 'button');
    indHeading.setAttribute('tabindex', '0');
    indHeading.setAttribute('aria-expanded', 'false');
    const caret = document.createElement('span');
    caret.className = 'nav__mobile-caret';
    caret.setAttribute('aria-hidden', 'true');
    caret.textContent = '▾';
    indHeading.appendChild(caret);
    const toggleInd = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = mobileNav.classList.toggle('industries-open');
      indHeading.setAttribute('aria-expanded', open);
    };
    indHeading.addEventListener('click', toggleInd);
    indHeading.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') toggleInd(e);
    });
  }

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
      channels:  form.querySelector('#channels')?.value,
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

    // Submit to Formspree → notifications go to jon@heytara.ai
    try {
      const res = await fetch('https://formspree.io/f/xyegzjnk', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Formspree error');
      if (typeof gtag === 'function') gtag('event', 'generate_lead', { form_name: 'demo', page_path: location.pathname });
      form.style.display = 'none';
      if (successEl) successEl.classList.add('show');
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book My Demo →';
      showError(form, 'Something went wrong. Please try again or email us at hello@heytara.ai.');
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
  var path = window.location.pathname;
  var inBlog = path.includes('/blog');
  var inIndustries = path.includes('/industries');
  var inCompare = path.includes('/compare');
  var current = (path.split('/').pop() || 'index').replace(/\.html$/, '');
  document.querySelectorAll('.nav__links a:not(.nav__cta), .nav__mobile a:not(.nav__cta)').forEach(function(link) {
    var href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return;
    var isBlogLink = href.includes('blog');
    var isIndustriesLink = href.includes('industries') || link.closest('.nav__dropdown');
    var hrefFile = (href.split('/').pop().split('#')[0] || 'index').replace(/\.html$/, '');
    var match = false;
    if (inBlog && isBlogLink) {
      match = true;
    } else if ((inIndustries || inCompare) && isIndustriesLink) {
      match = true;
    } else if (!inBlog && !inIndustries && !inCompare && !isBlogLink && hrefFile === current) {
      match = true;
    }
    if (match) {
      link.style.color = '#C41E1E';
    }
  });
})();

// ─────────────────────────────────────────────────────
// STICKY CTA — show after scrolling past hero
// ─────────────────────────────────────────────────────
(function initStickyCta() {
  const stickyCta = document.getElementById('stickyCta');
  const hero = document.querySelector('.hero, .page-hero');
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

// ─────────────────────────────────────────────────────
// PARTNER FORM HANDLER (Formspree → jon@heytara.ai)
// ─────────────────────────────────────────────────────
(function initPartnerForm() {
  const form = document.getElementById('partner-form-el');
  if (!form) return;
  const successEl = document.getElementById('partner-success');
  const btn = form.querySelector('.form-submit');
  const val = (id) => (form.querySelector('#' + id)?.value || '').trim();
  function err(msg) {
    let el = form.querySelector('.form-error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'form-error';
      el.style.cssText = 'color:#C41E1E;font-size:.88rem;margin-top:.75rem;font-weight:500;';
      btn.insertAdjacentElement('afterend', el);
    }
    el.textContent = msg;
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      _subject: 'New HeyTARA partner application',
      form: 'partner',
      name: val('p-name'), email: val('p-email'), company: val('p-company'),
      phone: val('p-phone'), partner_type: val('p-type'), message: val('p-message'),
      timestamp: new Date().toISOString(),
    };
    if (!data.name || !data.email || !data.company) return err('Please fill in all required fields.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return err('Please enter a valid email address.');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch('https://formspree.io/f/xyegzjnk', {
        method: 'POST', body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Formspree error');
      if (typeof gtag === 'function') gtag('event', 'generate_lead', { form_name: 'partner', page_path: location.pathname });
      form.style.display = 'none';
      if (successEl) successEl.classList.add('show');
    } catch (x) {
      btn.disabled = false; btn.textContent = 'Apply to Partner →';
      err('Something went wrong. Please try again or email us at hello@heytara.ai.');
    }
  });
})();

// ─────────────────────────────────────────────────────
// IVR RECORDINGS: SAMPLE PLAYERS + ORDER FORM (Formspree → jon@heytara.ai)
// ─────────────────────────────────────────────────────
(function initIvrSamples() {
  const samples = document.querySelectorAll('.ivr-sample');
  if (!samples.length) return;
  let current = null;
  samples.forEach(function(card) {
    const btn = card.querySelector('.ivr-sample__play');
    const icon = card.querySelector('.ivr-sample__icon');
    const bar = document.createElement('div');
    bar.className = 'ivr-sample__bar';
    bar.innerHTML = '<span></span>';
    card.querySelector('.ivr-sample__body').appendChild(bar);
    const fill = bar.firstChild;
    const audio = new Audio();
    audio.preload = 'none';
    audio.src = card.dataset.src;
    function reset() { card.classList.remove('is-playing'); icon.innerHTML = '&#9654;'; }
    audio.addEventListener('timeupdate', function() {
      if (audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    });
    audio.addEventListener('ended', function() { reset(); fill.style.width = '0'; });
    audio.addEventListener('pause', reset);
    btn.addEventListener('click', function() {
      if (!audio.paused) { audio.pause(); return; }
      if (current && current !== audio) current.pause();
      current = audio;
      audio.play().then(function() {
        card.classList.add('is-playing');
        icon.innerHTML = '&#10074;&#10074;';
        if (typeof gtag === 'function') gtag('event', 'ivr_sample_play', { sample: card.querySelector('.ivr-sample__title').textContent });
      }).catch(function() {
        card.querySelector('.ivr-sample__meta').textContent = 'Sample unavailable right now';
      });
    });
  });
})();

(function initIvrForm() {
  const form = document.getElementById('ivr-form-el');
  if (!form) return;
  const successEl = document.getElementById('ivr-success');
  const btn = form.querySelector('.form-submit');
  const val = (id) => (form.querySelector('#' + id)?.value || '').trim();
  const script = form.querySelector('#r-script');
  const count = document.getElementById('r-script-count');
  if (script && count) script.addEventListener('input', function() {
    const n = script.value.trim() ? script.value.trim().split(/\s+/).length : 0;
    count.textContent = n + (n === 1 ? ' word' : ' words');
  });
  function err(msg) {
    let el = form.querySelector('.form-error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'form-error';
      el.style.cssText = 'color:#C41E1E;font-size:.88rem;margin-top:.75rem;font-weight:500;text-align:center;';
      btn.insertAdjacentElement('afterend', el);
    }
    el.textContent = msg;
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const voice = (form.querySelector('input[name="voice"]:checked') || {}).value || '';
    const data = {
      _subject: 'New HeyTARA recording order: ' + val('r-company'),
      _replyto: val('r-email'),
      _gotcha: (form.querySelector('input[name="_gotcha"]') || {}).value || '',
      form: 'ivr-recording',
      name: val('r-name'), company: val('r-company'), email: val('r-email'),
      voice: voice, file_format: val('r-format'), script: val('r-script'),
      pronunciation_notes: val('r-pron'), additional_instructions: val('r-notes'),
      price: '$20 per recording',
      timestamp: new Date().toISOString(),
    };
    if (!data.name || !data.company || !data.email || !data.script) return err('Please fill in your name, company, email and script.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return err('Please enter a valid email address.');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch('https://formspree.io/f/xyegzjnk', {
        method: 'POST', body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Formspree error');
      if (typeof gtag === 'function') gtag('event', 'generate_lead', { form_name: 'ivr_recording', page_path: location.pathname, value: 20, currency: 'USD' });
      form.style.display = 'none';
      if (successEl) { successEl.classList.add('show'); successEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    } catch (x) {
      btn.disabled = false; btn.textContent = 'Order Your Recording →';
      err('Something went wrong. Please try again or email us at hello@heytara.ai.');
    }
  });
})();

// Track clicks on marked CTAs (data-cta="...") as GA4 cta_click
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('[data-cta]');
  if (a && typeof gtag === 'function') gtag('event', 'cta_click', { cta: a.getAttribute('data-cta'), link_url: a.getAttribute('href'), page_path: location.pathname });
});
