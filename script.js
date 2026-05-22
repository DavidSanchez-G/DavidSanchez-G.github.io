/* ============================================================
   DAVID SÁNCHEZ GOÑI – PORTFOLIO  |  script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── UTILS ─────────────────────────────────────────────── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ── NAVBAR ─────────────────────────────────────────────── */
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
    toggleBackToTop();
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    $$('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  function updateActiveLink() {
    var scrollPos = window.scrollY + 120;
    $$('section[id]').forEach(function (sec) {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        $$('.nav-link').forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }

  /* ── BACK TO TOP ─────────────────────────────────────────── */
  var backBtn = document.getElementById('backToTop');
  function toggleBackToTop() {
    if (backBtn) backBtn.classList.toggle('visible', window.scrollY > 400);
  }
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── TYPEWRITER ──────────────────────────────────────────── */
  var typeEl = document.getElementById('typewriter');
  if (typeEl) {
    var phrases = [
      'Desarrollador Web Full Stack',
      'Apasionado del código',
      'Estudiante de DAW',
      'Amante de la tecnología',
      'Creador de soluciones web'
    ];
    var phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
      var current = phrases[phraseIdx];
      if (!deleting) {
        typeEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 2200);
          return;
        }
        setTimeout(type, 80);
      } else {
        typeEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
        setTimeout(type, 40);
      }
    }
    setTimeout(type, 800);
  }

  /* ── SCROLL ANIMATIONS (AOS) ─────────────────────────────── */
  var aosEls = $$('[data-aos]');
  if (aosEls.length && 'IntersectionObserver' in window) {
    var aosObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(function () { el.classList.add('aos-animate'); }, delay);
        aosObserver.unobserve(el);
      });
    }, { threshold: 0.08 });
    aosEls.forEach(function (el) { aosObserver.observe(el); });
  } else {
    // Fallback: show everything immediately
    aosEls.forEach(function (el) { el.classList.add('aos-animate'); });
  }

  /* ── SKILLS TABS ─────────────────────────────────────────── */
  var tabBtns = $$('.tab-btn');
  var skillPanels = $$('.skills-panel');

  console.log('Tabs found:', tabBtns.length, '| Panels found:', skillPanels.length);

  function showTab(tabName) {
    // Update buttons
    tabBtns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });
    // Show/hide panels
    skillPanels.forEach(function (panel) {
      var match = panel.id === 'tab-' + tabName;
      panel.style.display = match ? 'block' : 'none';
      if (match) {
        // Animate skill bars
        setTimeout(function () {
          $$('.skill-fill', panel).forEach(function (bar) {
            bar.classList.add('animate');
          });
        }, 80);
      } else {
        $$('.skill-fill', panel).forEach(function (bar) {
          bar.classList.remove('animate');
        });
      }
    });
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      showTab(btn.getAttribute('data-tab'));
    });
  });

  // Animate frontend skill bars when section scrolls into view
  var frontendPanel = document.getElementById('tab-frontend');
  if (frontendPanel && 'IntersectionObserver' in window) {
    var skillObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        $$('.skill-fill', frontendPanel).forEach(function (bar) {
          bar.classList.add('animate');
        });
        skillObs.disconnect();
      }
    }, { threshold: 0.2 });
    skillObs.observe(frontendPanel);
  }

  /* ── COUNTER ANIMATION ───────────────────────────────────── */
  var counters = $$('.stat-number[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var start = performance.now();
        var dur = 1400;
        function update(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObs.observe(c); });
  }

  /* ── CONTACT FORM ────────────────────────────────────────── */
  var form = document.getElementById('contactForm');
  if (form) {
    function validateField(field) {
      var val = field.value.trim();
      if (!val) { field.classList.add('error'); return false; }
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        field.classList.add('error'); return false;
      }
      field.classList.remove('error');
      return true;
    }
    $$('input, textarea', form).forEach(function (f) {
      f.addEventListener('input', function () { validateField(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = $$('input, textarea', form);
      var valid = fields.every(validateField);
      if (!valid) return;

      var btn = document.getElementById('submitBtn');
      var btnText = btn.querySelector('.btn-text');
      var btnLoad = btn.querySelector('.btn-loading');

      btnText.classList.add('hidden');
      btnLoad.classList.remove('hidden');
      btn.disabled = true;

      var formData = new FormData(form);

      // IMPORTANTE: Reemplaza "TU_ID_DE_FORMSPREE" por tu ID real de Formspree (ej. "xvoqabqw")
      fetch('https://formspree.io/f/xlgzkoko', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(function (response) {
        btnText.classList.remove('hidden');
        btnLoad.classList.add('hidden');
        btn.disabled = false;

        if (response.ok) {
          var msg = document.getElementById('formSuccess');
          if (msg) {
            msg.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje enviado con éxito!';
            msg.style.color = ''; // Restaurar color por si hubo error antes
            msg.classList.remove('hidden');
            setTimeout(function () { msg.classList.add('hidden'); }, 5000);
          }
          form.reset();
        } else {
          response.json().then(function (data) {
            if (data && data.errors) {
              alert(data.errors.map(function (err) { return err.message; }).join(", "));
            } else {
              alert("Hubo un problema al enviar tu formulario.");
            }
          });
        }
      }).catch(function (error) {
        btnText.classList.remove('hidden');
        btnLoad.classList.add('hidden');
        btn.disabled = false;
        alert("Error de red. Hubo un problema al intentar enviar el formulario.");
      });
    });
  }

  /* ── SMOOTH SCROLL ───────────────────────────────────────── */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = 70;
      // Sumamos 40px al scroll para "ocultar" parte del padding superior bajo el header
      // y así mostrar más contenido en la parte inferior sin cortar las etiquetas.
      var top = target.getBoundingClientRect().top + window.scrollY - navH + 40;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── COPY EMAIL TO CLIPBOARD ─────────────────────────────── */
  var toast = document.getElementById('copyToast');
  var toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
  }

  $$('[data-copy-email]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var email = link.getAttribute('data-copy-email');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          showToast('✅ Email copiado: ' + email);
        }).catch(function () {
          // Fallback: open mailto
          window.location.href = 'mailto:' + email;
        });
      } else {
        // Fallback for older browsers
        var ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showToast('✅ Email copiado: ' + email); }
        catch (err) { window.location.href = 'mailto:' + email; }
        document.body.removeChild(ta);
      }
    });
  });


  /* ── CUSTOM CURSOR (desktop only) ────────────────────────── */
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
    var mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    })();
    $$('a, button, .project-card, .skill-item, .timeline-content').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.style.width = '56px'; ring.style.height = '56px';
      });
      el.addEventListener('mouseleave', function () {
        ring.style.width = '36px'; ring.style.height = '36px';
      });
    });
  }


  /* ── PROJECTS CAROUSEL ──────────────────────────────────── */
  var carouselTrack   = document.getElementById('carouselTrack');
  var carouselViewport = document.getElementById('carouselViewport');
  var prevBtn         = document.getElementById('carouselPrev');
  var nextBtn         = document.getElementById('carouselNext');
  var dotsWrap        = document.getElementById('carouselDots');

  if (carouselTrack && carouselViewport && prevBtn && nextBtn) {
    var cCards  = Array.from(carouselTrack.querySelectorAll('.project-card'));
    var cTotal  = cCards.length;
    var cIndex  = 0;
    var CGAP    = 28; // must match CSS gap

    // Build dots
    if (dotsWrap) {
      cCards.forEach(function(_, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Proyecto ' + (i + 1));
        dot.addEventListener('click', function() { carouselGoTo(i); });
        dotsWrap.appendChild(dot);
      });
    }

    function carouselRender() {
      var cardW    = cCards[0].getBoundingClientRect().width;
      var vpW      = carouselViewport.getBoundingClientRect().width;
      // Center the active card inside the viewport
      var offset   = (vpW - cardW) / 2;
      var translateX = offset - cIndex * (cardW + CGAP);
      carouselTrack.style.transform = 'translateX(' + translateX + 'px)';

      // Update card classes for visual depth
      cCards.forEach(function(card, i) {
        card.classList.remove('carousel-active', 'carousel-adjacent');
        if (i === cIndex) {
          card.classList.add('carousel-active');
        } else if (Math.abs(i - cIndex) === 1) {
          card.classList.add('carousel-adjacent');
        }
      });

      // Update dots
      if (dotsWrap) {
        Array.from(dotsWrap.querySelectorAll('.carousel-dot')).forEach(function(dot, i) {
          dot.classList.toggle('active', i === cIndex);
        });
      }

      // Update buttons
      prevBtn.disabled = cIndex === 0;
      nextBtn.disabled = cIndex === cTotal - 1;
    }

    function carouselGoTo(idx) {
      cIndex = Math.max(0, Math.min(cTotal - 1, idx));
      carouselRender();
    }

    prevBtn.addEventListener('click', function() { carouselGoTo(cIndex - 1); });
    nextBtn.addEventListener('click', function() { carouselGoTo(cIndex + 1); });

    // Touch / swipe support
    var touchStartX = 0;
    carouselViewport.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carouselViewport.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { carouselGoTo(cIndex + (dx < 0 ? 1 : -1)); }
    }, { passive: true });

    // Keyboard arrow support
    document.addEventListener('keydown', function(e) {
      var projects = document.getElementById('projects');
      if (!projects) return;
      var rect = projects.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); carouselGoTo(cIndex - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); carouselGoTo(cIndex + 1); }
    });

    // Initial render after fonts/layout settle
    requestAnimationFrame(function() {
      requestAnimationFrame(carouselRender);
    });
    window.addEventListener('resize', carouselRender, { passive: true });
  }

  console.log('%c👋 David Sánchez Goñi | Portfolio cargado', 'color:#7c5cfc;font-weight:bold;font-size:14px;');

}); // END DOMContentLoaded
