/**
 * ============================================================
 * MUHAMMAD SAMI ULLAH — PORTFOLIO JAVASCRIPT
 * Author: Muhammad Sami Ullah
 * Description: All interactive functionality for the portfolio
 * ============================================================
 */

'use strict';

/* ============================================================
   1. LOADING SCREEN
   ============================================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after page load (minimum 2s for animation to finish)
  const minLoadTime = 2200;
  const startTime = Date.now();

  function hideLoader() {
    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, minLoadTime - elapsed);
    setTimeout(() => {
      loader.classList.add('hidden');
      // Remove from DOM after transition
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 700);
    }, delay);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
})();


/* ============================================================
   2. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress(); // Initial call
})();


/* ============================================================
   3. NAVBAR — SCROLL EFFECT & ACTIVE LINK HIGHLIGHTING
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  // Scroll effect — add blur/glass when scrolled
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  }

  // Highlight active nav link based on scroll position
  function highlightActiveLink() {
    let currentSection = '';
    const scrollY = window.scrollY + 120; // Offset for navbar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial call
})();


/* ============================================================
   4. HAMBURGER MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    // Prevent body scroll when menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
})();


/* ============================================================
   5. TYPING EFFECT — HERO SECTION
   ============================================================ */
(function initTypingEffect() {
  const typedEl = document.getElementById('typedText');
  if (!typedEl) return;

  const words = [
    'Computer Science Student',
    'AI/ML Engineer',
    'C++ Developer',
    'Python Developer',
    'Problem Solver',
    'Aspiring Innovator'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  const TYPING_SPEED = 80;       // ms per character when typing
  const DELETING_SPEED = 45;     // ms per character when deleting
  const PAUSE_AFTER_WORD = 2000; // ms pause after full word
  const PAUSE_BEFORE_NEXT = 400; // ms pause before typing next word

  function type() {
    if (isPaused) return;

    const currentWord = words[wordIndex];

    if (!isDeleting) {
      // Typing forward
      typedEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        // Pause at end of word
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          type();
        }, PAUSE_AFTER_WORD);
        return;
      }
    } else {
      // Deleting
      typedEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          type();
        }, PAUSE_BEFORE_NEXT);
        return;
      }
    }

    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    setTimeout(type, speed);
  }

  // Start with a delay
  setTimeout(type, 800);
})();


/* ============================================================
   6. PARTICLE CANVAS — HERO BACKGROUND
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouseX = -9999;
  let mouseY = -9999;

  const CONFIG = {
    count: 300,
    minRadius: 1,
    maxRadius: 2.5,
    minSpeed: 0.15,
    maxSpeed: 0.55,
    connectionDistance: 100,
    mouseRepelRadius: 500,
    mouseRepelStrength: 1.5,
    colors: ['rgba(99,102,241,', 'rgba(139,92,246,', 'rgba(59,130,246,', 'rgba(34,211,238,']
  };

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
      this.speed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
      this.dirX = (Math.random() - 0.5) * 2;
      this.dirY = (Math.random() - 0.5) * 2;
      const colorBase = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.opacity = 0.3 + Math.random() * 0.5;
      this.color = colorBase + this.opacity + ')';
    }

    update() {
      // Mouse repel effect
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.mouseRepelRadius && dist > 0) {
        const force = (CONFIG.mouseRepelRadius - dist) / CONFIG.mouseRepelRadius;
        this.x += (dx / dist) * force * CONFIG.mouseRepelStrength;
        this.y += (dy / dist) * force * CONFIG.mouseRepelStrength;
      }

      // Move
      this.x += this.dirX * this.speed;
      this.y += this.dirY * this.speed;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.dirX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.dirY *= -1;

      // Clamp
      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDistance) {
          const alpha = (1 - dist / CONFIG.connectionDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  // Track mouse for repel effect
  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });
  }

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      resize();
      createParticles();
      animate();
    }, 200);
  });

  // Initialize
  resize();
  createParticles();
  animate();
})();


/* ============================================================
   7. SCROLL REVEAL — INTERSECTION OBSERVER
   ============================================================ */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .slide-left, .slide-right');

  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
})();


/* ============================================================
   8. ANIMATED COUNTERS — STATISTICS SECTION
   ============================================================ */
(function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let countersStarted = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startVal = 0;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentVal = Math.floor(startVal + (target - startVal) * easedProgress);

      el.textContent = currentVal + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNumbers.forEach(el => animateCounter(el));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
})();


/* ============================================================
   9. SKILL PROGRESS BARS ANIMATION
   ============================================================ */
(function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        // Small delay for staggered effect
        setTimeout(() => {
          bar.style.width = `${width}%`;
        }, 150);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => observer.observe(bar));
})();


/* ============================================================
   10. PROJECT FILTER
   ============================================================ */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card, index) => {
        const category = card.getAttribute('data-category') || '';
        const matches = filter === 'all' || category.includes(filter);

        if (matches) {
          card.style.display = 'flex';
          // Staggered animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 80);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });
})();


/* ============================================================
   11. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
})();


/* ============================================================
   12. SCROLL TO TOP BUTTON
   ============================================================ */
(function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  function toggleVisibility() {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
})();


/* ============================================================
   13. FOOTER YEAR
   ============================================================ */
(function initFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();


/* ============================================================
   14. CONTACT FORM — CLIENT-SIDE HANDLING
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (!form || !statusEl) return;

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`;
    setTimeout(() => {
      statusEl.className = 'form-status';
    }, 5000);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fname = form.fname.value.trim();
    const femail = form.femail.value.trim();
    const fsubject = form.fsubject.value.trim();
    const fmessage = form.fmessage.value.trim();
    const submitBtn = form.querySelector('.form-submit-btn');

    // Validation
    if (!fname) {
      showStatus('Please enter your full name.', 'error');
      return;
    }
    if (!femail || !validateEmail(femail)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }
    if (!fsubject) {
      showStatus('Please enter a subject.', 'error');
      return;
    }
    if (!fmessage || fmessage.length < 10) {
      showStatus('Please enter a message (minimum 10 characters).', 'error');
      return;
    }

    // Simulate sending (replace with actual backend/EmailJS/Formspree)
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';

    setTimeout(() => {
      showStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
    }, 1800);
  });

  // Live input focus animations
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.01)';
    });
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = 'scale(1)';
    });
  });
})();


/* ============================================================
   15. CARD HOVER GLOW EFFECT (Mouse Tracking)
   ============================================================ */
(function initCardGlow() {
  const cards = document.querySelectorAll('.glass-card, .project-card, .stat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      card.style.background = `
        radial-gradient(circle at ${xPercent}% ${yPercent}%, 
          rgba(99,102,241,0.08) 0%, 
          rgba(10, 15, 30, 0.6) 60%)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ============================================================
   16. NAVBAR LINK SMOOTH TRANSITION ON PAGE LOAD
   ============================================================ */
(function initPageLoad() {
  // Fade in main content after loader
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 300);
  });
})();


/* ============================================================
   17. FLOATING TAGS INTERACTION — HERO VISUAL
   ============================================================ */
(function initFloatingTags() {
  const tags = document.querySelectorAll('.float-tag');

  tags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = 'translateY(-12px) scale(1.05)';
      tag.style.borderColor = 'rgba(99, 102, 241, 0.5)';
      tag.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.3)';
    });

    tag.addEventListener('mouseleave', () => {
      tag.style.transform = '';
      tag.style.borderColor = '';
      tag.style.boxShadow = '';
    });
  });
})();


/* ============================================================
   18. SECTION TAG ANIMATION — STAGGERED REVEAL
   ============================================================ */
(function initSectionHeaders() {
  const sectionTags = document.querySelectorAll('.section-tag');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  sectionTags.forEach(tag => {
    tag.style.opacity = '0';
    observer.observe(tag);
  });
})();


/* ============================================================
   19. KEYBOARD ACCESSIBILITY — ESC TO CLOSE MENU
   ============================================================ */
(function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close mobile menu
      const mobileMenu = document.getElementById('mobileMenu');
      const hamburger = document.getElementById('hamburger');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }
  });
})();


/* ============================================================
   20. PERFORMANCE — PASSIVE SCROLL LISTENERS
   ============================================================ */
(function initPassiveListeners() {
  // Add passive touch listeners for better mobile performance
  document.addEventListener('touchstart', () => {}, { passive: true });
  document.addEventListener('touchmove', () => {}, { passive: true });
})();


/* ============================================================
   21. TECH CHIP HOVER COLORS
   ============================================================ */
(function initTechChips() {
  const techChips = document.querySelectorAll('.tech-chip');
  const colors = [
    'rgba(99,102,241,0.15)',
    'rgba(139,92,246,0.15)',
    'rgba(59,130,246,0.15)',
    'rgba(34,211,238,0.15)'
  ];
  const borderColors = [
    'rgba(99,102,241,0.4)',
    'rgba(139,92,246,0.4)',
    'rgba(59,130,246,0.4)',
    'rgba(34,211,238,0.4)'
  ];
  const textColors = [
    '#818cf8',
    '#a78bfa',
    '#60a5fa',
    '#22d3ee'
  ];

  techChips.forEach((chip, i) => {
    const colorIdx = i % colors.length;
    chip.addEventListener('mouseenter', () => {
      chip.style.background = colors[colorIdx];
      chip.style.borderColor = borderColors[colorIdx];
      chip.style.color = textColors[colorIdx];
      chip.style.transform = 'translateY(-2px)';
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.background = '';
      chip.style.borderColor = '';
      chip.style.color = '';
      chip.style.transform = '';
    });
  });
})();


/* ============================================================
   22. OTHER SKILL CARD STAGGER ANIMATION
   ============================================================ */
(function initOtherSkillCards() {
  const cards = document.querySelectorAll('.other-skill-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards2 = entry.target.querySelectorAll('.other-skill-card');
        cards2.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const grid = document.querySelector('.other-skills-grid');
  if (grid) {
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(15px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    observer.observe(grid);
  }
})();


/* ============================================================
   23. RESPONSIBILITY ITEMS STAGGER ANIMATION
   ============================================================ */
(function initResponsibilityItems() {
  const items = document.querySelectorAll('.responsibility-item');
  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-15px)';
    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionItems = entry.target.querySelectorAll('.responsibility-item');
        sectionItems.forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, i * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const expCard = document.querySelector('.experience-card');
  if (expCard) observer.observe(expCard);
})();


/* ============================================================
   24. CONSOLE EASTER EGG
   ============================================================ */
(function initConsoleEasterEgg() {
  const styles = [
    'color: #6366f1; font-size: 18px; font-weight: bold;',
    'color: #a78bfa; font-size: 13px;',
    'color: #94a3b8; font-size: 12px;',
    'color: #22d3ee; font-size: 12px;'
  ];

  console.log('%c👨‍💻 Muhammad Sami Ullah — Portfolio', styles[0]);
  console.log('%c Computer Science Student | AI/ML Engineer | C++ & Python Developer', styles[1]);
  console.log('%c Interested in collaborating? muhammadsamiyt5@gmail.com', styles[2]);
  console.log('%c GitHub: https://github.com/Muhammad-Sami-Ullah53', styles[3]);
  console.log('%c LinkedIn: https://www.linkedin.com/in/sami-ullah-sarfraz-b5a0b7394', styles[3]);
})();


const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("fname").value;
    const email = document.getElementById("femail").value;
    const subject = document.getElementById("fsubject").value;
    const message = document.getElementById("fmessage").value;

    const body =
`Name: ${name}

Email: ${email}

Message:
${message}`;

    const mailtoLink =
`mailto:muhammadsamiyt5@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
});

const contactToggle = document.getElementById("contactToggle");
const contactMenu = document.getElementById("contactMenu");

contactToggle.addEventListener("click", () => {
    contactMenu.classList.toggle("show");
});

// Close when clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".floating-contact")) {
        contactMenu.classList.remove("show");
    }
});


/* ============================================================
   22. WHATSAPP CONTACT POPUP
============================================================ */

(function initWhatsappPopup(){

    const modal=document.getElementById("whatsappModal");
    const openBtn=document.getElementById("openWhatsappModal");
    const closeBtn=document.getElementById("closeWhatsappModal");
    const sendBtn=document.getElementById("sendWhatsapp");

    if(!modal || !openBtn || !closeBtn || !sendBtn) return;

    openBtn.addEventListener("click",()=>{

        modal.style.display="flex";

    });

    closeBtn.addEventListener("click",()=>{

        modal.style.display="none";

    });

    modal.addEventListener("click",(e)=>{

        if(e.target===modal){

            modal.style.display="none";

        }

    });

    sendBtn.addEventListener("click",()=>{

        const name=document.getElementById("visitorName").value.trim();
        const email=document.getElementById("visitorEmail").value.trim();
        const message=document.getElementById("visitorMessage").value.trim();

        if(name==="" || message===""){

            alert("Please enter your name and message.");

            return;
        }

        const whatsappMessage=`Hello Sami,

My Name: ${name}

Email: ${email || "Not Provided"}

Message:
${message}

Sent from your Portfolio Website.`;

        const phone="923296370164";

        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`,
            "_blank"
        );
    });

})();

/* ============================================================
   25. RESIZE HANDLER — DEBOUNCED
   ============================================================ */
(function initResizeHandler() {
  let resizeTimeout;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Re-check mobile menu on resize
      const mobileMenu = document.getElementById('mobileMenu');
      const hamburger = document.getElementById('hamburger');
      if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    }, 250);
  });



})();

// document.querySelectorAll(".project-media").forEach(media => {

//     const video = media.querySelector(".project-video");

//     // Desktop
//     media.addEventListener("mouseenter", () => {
//         if (window.innerWidth > 768) {
//             video.currentTime = 0;
//             video.play().catch(err => console.log(err));
//         }
//     });

//     media.addEventListener("mouseleave", () => {
//         if (window.innerWidth > 768) {
//             video.pause();
//             video.currentTime = 0;
//         }
//     });

//     // Mobile
//     media.addEventListener("click", () => {
//         if (window.innerWidth <= 768) {
//             if (video.paused) {
//                 video.play().catch(err => console.log(err));
//             } else {
//                 video.pause();
//             }
//         }
//     });

// });

// const videos = document.querySelectorAll(".project-video");

// const observer = new IntersectionObserver((entries) => {

//     entries.forEach(entry => {

//         const video = entry.target;

//         if(entry.isIntersecting){

//             video.play().catch(()=>{});

//         }else{

//             video.pause();

//         }

//     });

// },{threshold:0.4});

// videos.forEach(video => observer.observe(video));