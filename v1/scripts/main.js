/* ============================================================
   VAST GALAXY — Main JavaScript
   Navigation, Reveal, Counter, Stars, Forms, Mobile Menu
   ============================================================ */

(function() {
  'use strict';

  // ── Navigation Scroll Effect ──
  var nav = document.getElementById('mainNav');
  var announceBar = document.querySelector('.announce-bar');
  var announceHeight = announceBar ? announceBar.offsetHeight : 40;

  function handleNavScroll() {
    if (window.scrollY > announceHeight) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ── Mobile Menu ──
  var mobileToggle = document.getElementById('mobileToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileClose = document.getElementById('mobileClose');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function() {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    mobileClose.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Reveal Animation (Intersection Observer) ──
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  // ── Staggered Reveal Delays ──
  document.querySelectorAll('[data-stagger-reveal]').forEach(function(grid) {
    grid.querySelectorAll('.reveal').forEach(function(el, i) {
      el.style.transitionDelay = (i * 0.12) + 's';
    });
  });

  // ── Counter Animation ──
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var format = el.getAttribute('data-format');
    var suffix = el.closest('.stat-item').querySelector('.stat-unit').textContent.trim().startsWith('%') ? '%' : '+';
    var duration = 1800;
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);

      if (format === 'comma') {
        el.textContent = current.toLocaleString('en-US') + '+';
      } else if (target === 100) {
        el.textContent = current + '%';
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number[data-target]').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  var statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    counterObserver.observe(statsGrid);
  }

  // ── Hero Stars Generator ──
  var starsContainer = document.getElementById('heroStars');
  if (starsContainer) {
    for (var i = 0; i < 50; i++) {
      var star = document.createElement('div');
      star.className = 'hero-star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.width = (Math.random() * 2 + 1) + 'px';
      star.style.height = star.style.width;
      star.style.animationDelay = (Math.random() * 5) + 's';
      star.style.animationDuration = (Math.random() * 3 + 2) + 's';
      starsContainer.appendChild(star);
    }
  }

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        var navHeight = nav ? nav.offsetHeight : 0;
        var pos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // ── Form Submission Handling ──
  function handleFormSubmit(formId) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var data = new FormData(form);
      var entries = {};
      data.forEach(function(value, key) { entries[key] = value; });
      console.log('Form submission (' + formId + '):', entries);

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = '\u5df2\u63d0\u4ea4\uff01\u6211\u4eec\u5c06\u5c3d\u5feb\u8054\u7cfb\u60a8\u3002';
      btn.style.background = '#25D366';
      btn.style.color = '#fff';
      btn.disabled = true;

      setTimeout(function() {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  handleFormSubmit('heroForm');
  handleFormSubmit('contactForm');

})();
