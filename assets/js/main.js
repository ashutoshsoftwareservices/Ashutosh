/* ==========================================================================
   MAIN APPLICATION ORCHESTRATOR (FOUNDER MODE DEFAULT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Preloader Initialization
  const preloader = document.getElementById('preloader');
  const loaderBar = document.getElementById('loader-bar');
  let progress = 0;

  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('hidden');
      }, 300);
    }
    if (loaderBar) loaderBar.style.width = progress + '%';
  }, 50);

  // 2. Custom Cursor Movement (Desktop Only)
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');

  if (cursor && follower && window.innerWidth > 992) {
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;
      follower.style.left = `${posX}px`;
      follower.style.top = `${posY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverTargets = document.querySelectorAll('a, button, .glass-card, .opt-btn, .filter-btn, .mode-btn');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        if (window.SoundFX) window.SoundFX.hover();
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // 3. Navbar Sticky & Scroll Active Links
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Mobile Menu Navigation Drawer Toggle with Backdrop Overlay
  const mobileTrigger = document.getElementById('nav-mobile-trigger');
  const navMenu = document.getElementById('nav-links');

  const mobileBackdrop = document.createElement('div');
  mobileBackdrop.className = 'nav-backdrop';
  mobileBackdrop.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
    z-index: 999; opacity: 0; visibility: hidden; transition: all 0.3s ease;
  `;
  document.body.appendChild(mobileBackdrop);

  function toggleMobileMenu(forceClose = false) {
    if (!mobileTrigger || !navMenu) return;
    const isOpening = forceClose ? false : !navMenu.classList.contains('active');
    
    if (isOpening) {
      navMenu.classList.add('active');
      mobileBackdrop.style.opacity = '1';
      mobileBackdrop.style.visibility = 'visible';
      const icon = mobileTrigger.querySelector('i');
      if (icon) icon.className = 'fas fa-xmark';
    } else {
      navMenu.classList.remove('active');
      mobileBackdrop.style.opacity = '0';
      mobileBackdrop.style.visibility = 'hidden';
      const icon = mobileTrigger.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  }

  if (mobileTrigger) {
    mobileTrigger.addEventListener('click', () => toggleMobileMenu());
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => toggleMobileMenu(true));
  }

  navLinks.forEach(l => {
    l.addEventListener('click', () => toggleMobileMenu(true));
  });

  // 5. Dual Role Mode Switcher (DEFAULT: FOUNDER MODE)
  const modeEngineerBtn = document.getElementById('mode-engineer');
  const modeFounderBtn = document.getElementById('mode-founder');

  function setMode(mode) {
    if (mode === 'engineer') {
      document.body.classList.remove('mode-founder');
      if (modeFounderBtn) modeFounderBtn.classList.remove('active');
      if (modeEngineerBtn) modeEngineerBtn.classList.add('active');
    } else {
      document.body.classList.add('mode-founder');
      if (modeEngineerBtn) modeEngineerBtn.classList.remove('active');
      if (modeFounderBtn) modeFounderBtn.classList.add('active');
    }

    if (window.SoundFX) window.SoundFX.modeSwitch();
    window.dispatchEvent(new CustomEvent('modeChanged', { detail: { mode } }));
    showToast(`Switched view mode to: ${mode.toUpperCase()}`);
  }

  if (modeEngineerBtn) modeEngineerBtn.addEventListener('click', () => setMode('engineer'));
  if (modeFounderBtn) modeFounderBtn.addEventListener('click', () => setMode('founder'));

  // 6. Mute Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', function () {
      const isMuted = window.SoundFX ? window.SoundFX.toggleMute() : true;
      const icon = this.querySelector('i');
      if (icon) {
        icon.className = isMuted ? 'fas fa-volume-xmark' : 'fas fa-volume-high';
      }
      showToast(isMuted ? 'Sound Effects Muted' : 'Sound Effects Enabled');
    });
  }

  // 7. Project Gallery Filter System
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });

      if (window.SoundFX) window.SoundFX.click();
    });
  });

  // 8. Contact Form Submission Handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      if (window.SoundFX) window.SoundFX.success();

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffb703', '#ff0055', '#00f0ff', '#00f5a0']
        });
      }

      showToast(`Thank you ${name}! Your inquiry has been sent to Ashutosh Software Services.`);
      contactForm.reset();
    });
  }

  // 9. Toast Notification Helper
  window.showToast = function (msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-circle-check" style="color:var(--accent-primary);"></i> <span>${msg}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  };

  // 10. Scroll Reveal Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.glass-card, .section-header, .timeline-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.innerHTML = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);
});
