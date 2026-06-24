/* ============================================
   MAIN JAVASCRIPT - ZedLogic Cloud Pulse
   ============================================ */

(function () {
  'use strict';

  // ============= UTILITIES =============
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const onReady = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  // ============= PAGE LOADER =============
  const initLoader = () => {
    const loader = $('.page-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
  };

  // ============= HEADER SCROLL =============
  const initHeader = () => {
    const header = $('.site-header');
    if (!header) return;
    const updateHeader = () => {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  };

  // ============= SCROLL PROGRESS =============
  const initScrollProgress = () => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  };

  // ============= BACK TO TOP =============
  const initBackToTop = () => {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }, { passive: true });
  };

  // ============= REVEAL ON SCROLL =============
  const initReveal = () => {
    const els = $$('.reveal, .reveal-scale, .reveal-left, .reveal-right');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    els.forEach(el => io.observe(el));
  };

  // ============= COUNTER ANIMATION =============
  const initCounters = () => {
    const counters = $$('[data-counter]');
    if (!counters.length) return;
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.counter);
      const duration = parseInt(el.dataset.duration) || 2000;
      const decimals = parseInt(el.dataset.decimals) || 0;
      const start = performance.now();
      const startVal = 0;
      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = startVal + (target - startVal) * eased;
        el.textContent = decimals ? current.toFixed(decimals) : Math.floor(current).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString();
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  };

  // ============= PARALLAX =============
  const initParallax = () => {
    const elements = $$('[data-parallax]');
    if (!elements.length) return;
    let ticking = false;
    const update = () => {
      const scrollY = window.scrollY;
      elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrollY - window.innerHeight) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  };

  // ============= MAGNETIC HOVER =============
  const initMagnetic = () => {
    const els = $$('[data-magnetic]');
    els.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  };

  // ============= TILT EFFECT =============
  const initTilt = () => {
    const els = $$('[data-tilt]');
    els.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (y - 0.5) * -8;
        const ry = (x - 0.5) * 8;
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  };

  // ============= CUSTOM CURSOR =============
  const initCursor = () => {
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    const animate = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animate);
    };
    animate();
    $$('a, button, .service-card, .app-card, .news-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  };

  // ============= MOBILE MENU =============
  const initMobileMenu = () => {
    const toggle = $('.menu-toggle');
    const list = $('.nav-list');
    if (!toggle || !list) return;
    toggle.addEventListener('click', () => {
      const isOpen = list.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen) {
        list.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:64px;left:0;right:0;bottom:0;background:var(--color-bg);padding:32px;gap:0;border-top:1px solid var(--color-line);z-index:99;overflow-y:auto;';
        $$('.nav-list .nav-link').forEach(l => l.style.cssText = 'padding:20px 0;font-size:18px;border-bottom:1px solid var(--color-line);width:100%;justify-content:flex-start;');
        const cta = $('.nav-cta');
        if (cta) cta.style.cssText = 'margin:32px 0 0;justify-content:center;width:100%;';
      } else {
        list.style.cssText = '';
        $$('.nav-list .nav-link').forEach(l => l.style.cssText = '');
        const cta = $('.nav-cta');
        if (cta) cta.style.cssText = '';
      }
    });
  };

  // ============= SMOOTH ANCHOR SCROLL =============
  const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  };

  // ============= TYPING EFFECT =============
  const initTyping = () => {
    const els = $$('[data-typing]');
    els.forEach(el => {
      const text = el.dataset.typing;
      const speed = parseInt(el.dataset.speed) || 60;
      el.textContent = '';
      let i = 0;
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const tick = () => {
            if (i <= text.length) {
              el.textContent = text.slice(0, i);
              i++;
              setTimeout(tick, speed);
            }
          };
          tick();
          io.unobserve(el);
        }
      }, { threshold: 0.5 });
      io.observe(el);
    });
  };

  // ============= MARQUEE DUPLICATE =============
  const initMarquee = () => {
    $$('.marquee-track').forEach(track => {
      track.innerHTML = track.innerHTML + track.innerHTML;
    });
  };

  // ============= TABS =============
  const initTabs = () => {
    $$('[data-tabs]').forEach(group => {
      const tabs = $$('.service-tab, .news-filter', group);
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const target = tab.dataset.tab;
          const items = $$(`[data-tab-item]`, group.parentElement);
          items.forEach(item => {
            if (!target || target === 'all' || item.dataset.tabItem === target) {
              item.style.display = '';
              setTimeout(() => item.classList.add('visible'), 30);
            } else {
              item.classList.remove('visible');
              setTimeout(() => item.style.display = 'none', 300);
            }
          });
        });
      });
    });
  };

  // ============= LEGAL SIDEBAR ACTIVE =============
  const initLegalNav = () => {
    const nav = $('.legal-nav');
    if (!nav) return;
    const links = $$('a', nav);
    const sections = links.map(l => $(l.getAttribute('href'))).filter(Boolean);
    const update = () => {
      const scrollY = window.scrollY + 150;
      let active = sections[0];
      sections.forEach(s => {
        if (s.offsetTop <= scrollY) active = s;
      });
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + (active && active.id)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  };

  // ============= CONTACT FORM =============
  const initContactForm = () => {
    const form = $('#contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = $('.form-submit', form);
      const original = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '✓ Message Sent';
        btn.style.background = 'var(--color-success)';
        btn.style.borderColor = 'var(--color-success)';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });
  };

  // ============= NEWSLETTER (placeholder) =============
  const initNewsletter = () => {
    $$('[data-newsletter]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('input', form);
        const btn = $('button', form);
        btn.textContent = '✓';
        input.value = '';
        setTimeout(() => { btn.textContent = '→'; }, 2000);
      });
    });
  };

  // ============= RIPPLE EFFECT =============
  const initRipple = () => {
    $$('.btn').forEach(btn => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);transform:scale(0);animation:ripple 0.6s ease-out;width:${size}px;height:${size}px;left:${x}px;top:${y}px;pointer-events:none;`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
    if (!document.getElementById('ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = '@keyframes ripple{to{transform:scale(2);opacity:0;}}';
      document.head.appendChild(s);
    }
  };

  // ============= ORBIT NODES POSITIONING =============
  const initOrbitNodes = () => {
    const ring = $('.orbit-ring.ring-1');
    if (ring && !ring.querySelector('.orbit-node')) {
      const node = document.createElement('div');
      node.className = 'orbit-node';
      node.style.top = '0';
      node.style.left = '50%';
      node.style.transform = 'translate(-50%, -50%)';
      ring.appendChild(node);
    }
    $$('.orbit-ring.ring-2, .orbit-ring.ring-3, .orbit-ring.ring-4').forEach(r => {
      if (!r.querySelector('.orbit-node')) {
        const node = document.createElement('div');
        node.className = 'orbit-node';
        node.style.top = '0';
        node.style.left = '50%';
        node.style.transform = 'translate(-50%, -50%)';
        r.appendChild(node);
      }
    });
  };

  // ============= INIT =============
  onReady(() => {
    initLoader();
    initHeader();
    initScrollProgress();
    initBackToTop();
    initReveal();
    initCounters();
    initParallax();
    initMagnetic();
    initTilt();
    initCursor();
    initMobileMenu();
    initSmoothScroll();
    initTyping();
    initMarquee();
    initTabs();
    initLegalNav();
    initContactForm();
    initNewsletter();
    initRipple();
    initOrbitNodes();
  });
})();