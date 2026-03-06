/* ============================================================
   Vast Galaxy V2 — Main Interaction Engine
   Cinematic dark luxury B2B warehouse website
   No external dependencies.
   ============================================================ */
;(function () {
  'use strict';

  /* ----------------------------------------------------------
     Utility: Debounce
  ---------------------------------------------------------- */
  function debounce(fn, ms) {
    var timer;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  /* ----------------------------------------------------------
     Utility: Format number with commas
  ---------------------------------------------------------- */
  function formatWithCommas(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /* ==========================================================
     1. Announce Bar Text Cycling
  ========================================================== */
  function initAnnounceBar() {
    var items = document.querySelectorAll('#announceBar .v2-announce-item');
    if (!items.length) return;
    var current = 0;
    // Ensure first item is active
    items[0].classList.add('is-active');
    setInterval(function () {
      items[current].classList.remove('is-active');
      current = (current + 1) % items.length;
      items[current].classList.add('is-active');
    }, 3500);
  }

  /* ==========================================================
     2. Navigation Scroll
  ========================================================== */
  function initNavScroll() {
    var nav = document.getElementById('mainNav');
    if (!nav) return;
    var threshold = 40; // announce bar height

    window.addEventListener('scroll', function () {
      if (window.scrollY > threshold) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  /* ==========================================================
     3. Mobile Menu
  ========================================================== */
  function initMobileMenu() {
    var toggle = document.getElementById('mobileToggle');
    var close = document.getElementById('mobileClose');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      menu.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openMenu);
    if (close) close.addEventListener('click', closeMenu);

    // Close on link click inside mobile menu
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', closeMenu);
    }
  }

  /* ==========================================================
     4. Scroll-Triggered Animations (IntersectionObserver)
  ========================================================== */
  function initScrollAnimations() {
    var els = document.querySelectorAll('[data-anim]');
    if (!els.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // Apply delay if present
          var delay = el.getAttribute('data-delay');
          if (delay !== null) {
            el.style.transitionDelay = (parseFloat(delay) * 0.15) + 's';
          }
          el.classList.add('is-visible');
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ==========================================================
     4B. Hero Typewriter — Type, Pause, Delete, Cycle
  ========================================================== */
  function initTypewriter() {
    var el = document.getElementById('heroTypewriter');
    if (!el) return;

    var phrases = [
      '美国海外仓合作伙伴',
      'TEMU 一件代发专家',
      'TikTok Shop 仓储方案',
      '跨境电商物流伙伴',
      '丢货包赔的海外仓'
    ];

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 100;
    var deleteSpeed = 50;
    var pauseAfterType = 2500;
    var pauseAfterDelete = 400;

    function tick() {
      var current = phrases[phraseIndex];

      if (!isDeleting) {
        // Typing
        charIndex++;
        el.textContent = current.substring(0, charIndex);

        if (charIndex === current.length) {
          // Finished typing — pause then start deleting
          setTimeout(function () {
            isDeleting = true;
            tick();
          }, pauseAfterType);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        // Deleting
        charIndex--;
        el.textContent = current.substring(0, charIndex);

        if (charIndex === 0) {
          // Finished deleting — move to next phrase
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, pauseAfterDelete);
          return;
        }
        setTimeout(tick, deleteSpeed);
      }
    }

    // Start after a short delay
    setTimeout(tick, 800);
  }

  /* ==========================================================
     5. Hero Particles (Canvas)
  ========================================================== */
  function initHeroParticles() {
    var canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 60;

    function resize() {
      canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1 + Math.random(),                          // radius 1-2
        alpha: 0.15 + Math.random() * 0.25,            // 0.15-0.4
        speed: 0.1 + Math.random() * 0.2,              // 0.1-0.3
        sinAmp: 0.3 + Math.random() * 0.5,
        sinFreq: 0.005 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y -= p.speed;
        p.x += Math.sin(p.phase) * p.sinAmp;
        p.phase += p.sinFreq;

        // Reset if off top
        if (p.y + p.r < 0) {
          p.y = canvas.height + p.r;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,168,76,' + p.alpha + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener('resize', debounce(function () {
      resize();
    }, 100));
  }

  /* ==========================================================
     6. Counter Animation (Stats)
  ========================================================== */
  function initCounters() {
    var grid = document.getElementById('statsGrid');
    if (!grid || !('IntersectionObserver' in window)) return;

    var hasRun = false;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          animateCounters();
          observer.unobserve(grid);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(grid);

    function animateCounters() {
      var nums = grid.querySelectorAll('.v2-stat-num[data-target]');
      nums.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var format = el.getAttribute('data-format');
        var duration = 2000;
        var start = performance.now();

        function tick(now) {
          var elapsed = now - start;
          var t = Math.min(elapsed / duration, 1);
          // Cubic ease-out: 1 - (1-t)^3
          var eased = 1 - Math.pow(1 - t, 3);
          var current = Math.round(eased * target);

          // Format display value
          var display;
          if (format === 'comma') {
            display = formatWithCommas(current) + '+';
          } else if (target === 100) {
            display = current + '%';
          } else {
            display = current.toString();
          }

          el.textContent = display;

          if (t < 1) {
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
      });
    }
  }

  /* ==========================================================
     7. Industry Tabs
  ========================================================== */
  function initIndustryTabs() {
    var tabs = document.querySelectorAll('.v2-ind-tab');
    var panels = document.querySelectorAll('.v2-ind-panel');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('data-tab');

        // Remove active from all
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        panels.forEach(function (p) { p.classList.remove('is-active'); });

        // Activate clicked tab and matching panel
        this.classList.add('is-active');
        var matchingPanel = document.querySelector('.v2-ind-panel[data-panel="' + target + '"]');
        if (matchingPanel) matchingPanel.classList.add('is-active');
      });
    });
  }

  /* ==========================================================
     8. Testimonials Carousel
  ========================================================== */
  function initTestimonials() {
    var track = document.getElementById('testiTrack');
    var dotsContainer = document.getElementById('testiDots');
    if (!track || !dotsContainer) return;

    var dots = dotsContainer.querySelectorAll('button');
    if (!dots.length) return;

    var currentSlide = 0;
    var totalSlides = dots.length;
    var autoInterval;
    var AUTO_DELAY = 5000;

    function goTo(index) {
      currentSlide = index;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === index);
      });
    }

    function nextSlide() {
      goTo((currentSlide + 1) % totalSlides);
    }

    function startAuto() {
      clearInterval(autoInterval);
      autoInterval = setInterval(nextSlide, AUTO_DELAY);
    }

    function stopAuto() {
      clearInterval(autoInterval);
    }

    // Dot clicks
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        // Reset auto-advance timer
        startAuto();
      });
    });

    // Pause on hover
    var carousel = track.closest('.v2-testi-carousel') || track.parentElement;
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
    }

    // Initialize
    goTo(0);
    startAuto();
  }

  /* ==========================================================
     9. Form Submission
  ========================================================== */
  function initForms() {
    var formIds = ['heroForm', 'contactForm'];

    formIds.forEach(function (id) {
      var form = document.getElementById(id);
      if (!form) return;

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var formData = new FormData(form);
        var data = {};
        formData.forEach(function (val, key) { data[key] = val; });
        console.log('[Vast Galaxy] Form submitted:', id, data);

        // Find submit button
        var btn = form.querySelector('button[type="submit"], button:not([type])');
        if (!btn) return;

        var originalText = btn.textContent;
        var originalBg = btn.style.backgroundColor;

        // Show success
        btn.textContent = '\u5df2\u63d0\u4ea4\uff01\u6211\u4eec\u5c06\u5c3d\u5feb\u8054\u7cfb\u60a8\u3002';
        btn.style.backgroundColor = '#25D366';
        btn.disabled = true;

        // Reset after 3s
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.backgroundColor = originalBg;
          btn.disabled = false;
          form.reset();
        }, 3000);
      });
    });
  }

  /* ==========================================================
     10. Smooth Scroll for Anchor Links
  ========================================================== */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    var nav = document.getElementById('mainNav');

    anchors.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Close mobile menu if open
        var mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('is-active')) {
          mobileMenu.classList.remove('is-active');
          document.body.style.overflow = '';
        }

        // Close modal if open
        var openModal = document.querySelector('.v2-modal-overlay.is-open');
        if (openModal) {
          openModal.classList.remove('is-open');
          document.body.style.overflow = '';
        }

        var navHeight = nav ? nav.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ==========================================================
     11. Footer Stars (Canvas)
  ========================================================== */
  function initFooterStars() {
    var canvas = document.getElementById('footerStars');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var stars = [];
    var STAR_COUNT = 40;

    function resize() {
      canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
    }

    function createStars() {
      stars = [];
      for (var i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 0.5 + Math.random(),                       // 0.5-1.5
          alpha: 0.05 + Math.random() * 0.15            // 0.05-0.2
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + s.alpha + ')';
        ctx.fill();
      }
    }

    function twinkle() {
      // Randomly change opacity of a few stars
      var count = 5 + Math.floor(Math.random() * 5);
      for (var i = 0; i < count; i++) {
        var idx = Math.floor(Math.random() * stars.length);
        stars[idx].alpha = 0.05 + Math.random() * 0.15;
      }
      draw();
    }

    resize();
    createStars();
    draw();

    // Twinkle every 2 seconds
    setInterval(twinkle, 2000);

    window.addEventListener('resize', debounce(function () {
      resize();
      createStars();
      draw();
    }, 100));
  }

  /* ==========================================================
     12. Form Modal (Overlay Close + Escape Key)
  ========================================================== */
  function initModal() {
    var overlays = document.querySelectorAll('.v2-modal-overlay');

    overlays.forEach(function (overlay) {
      // Close when clicking the overlay background, not the modal content
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          overlay.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var open = document.querySelector('.v2-modal-overlay.is-open');
        if (open) {
          open.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      }
    });
  }

  /* ==========================================================
     Initialize Everything on DOM Ready
  ========================================================== */
  function init() {
    initAnnounceBar();
    initNavScroll();
    initMobileMenu();
    initScrollAnimations();
    initTypewriter();
    initHeroParticles();
    initCounters();
    initIndustryTabs();
    initTestimonials();
    initForms();
    initSmoothScroll();
    initFooterStars();
    initModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
