/*
================================================================================
MOTION & INTERACTION ENGINE FOR SYAMRAJ R'S PORTFOLIO
================================================================================
Features:
- High-Performance HTML5 Canvas Particles Background
- Mouse Tracking Spotlight Glow Effect
- Dynamic Typing Banner Animation
- Magnetic Button Physics (GSAP-like fluid elastic pull in vanilla JS)
- Staggered IntersectionObserver Scroll Reveals
- Viewport-triggered Statistical Count-Up
- Mobile Navigation & Smooth Anchors Tracker
================================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initCanvasParticles();
  initTypingEffect();
  initMagneticButtons();
  initScrollReveals();
  initStatsCounters();
  initMobileNav();
  initContactForm();
});

/* ==========================================
1. CURSOR GLOW EFFECT
========================================== */
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;

  // Track coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp (linear interpolation) for sluggish, ultra-premium follow feel
  function updateGlowPosition() {
    const dx = mouseX - glowX;
    const dy = mouseY - glowY;
    
    // Lerp factor: 0.08 for extremely smooth lag glow
    glowX += dx * 0.08;
    glowY += dy * 0.08;

    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;

    requestAnimationFrame(updateGlowPosition);
  }
  
  updateGlowPosition();
}

/* ==========================================
2. CANVAS PARTICLES SYSTEM
========================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
  });

  // Track mouse coordinates for subtle interactive particle repulsion
  let mouse = { x: null, y: null, radius: 120 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
      // Distribute particles across canvas initially
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 10; // Start slightly below viewport
      this.size = Math.random() * 2.5 + 0.5; // Small, elegant dots
      this.speedY = -(Math.random() * 0.5 + 0.2); // Slow upward float
      this.speedX = Math.random() * 0.4 - 0.2; // Gentle horizontal drift
      this.alpha = Math.random() * 0.4 + 0.1; // Soft transparency
      this.baseAlpha = this.alpha;
      this.color = Math.random() > 0.5 ? '59, 130, 246' : '96, 165, 250'; // Primary / Secondary accents
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let angle = Math.atan2(dy, dx);
          
          this.x += Math.cos(angle) * force * 2;
          this.y += Math.sin(angle) * force * 2;
          this.alpha = Math.min(0.8, this.baseAlpha + force * 0.4);
        } else {
          this.alpha = this.alpha > this.baseAlpha ? this.alpha - 0.02 : this.baseAlpha;
        }
      }

      // Reset when particle floats off-screen
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  // Cap particles at 80 to maintain 60 FPS on lower-end devices
  const particleCount = Math.min(80, Math.floor((width * height) / 18000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw very subtle lines connecting close particles for structural feel
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================
3. DYNAMIC TYPING EFFECT
========================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-header');
  if (!typingElement) return;

  const words = ["Python Django Full-Stack Developer", "Django Developer", "Ecommerce Entrepreneur"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletes faster
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Natural typing speed
    }

    // Word completely typed
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2500; // Pause at full word
    } 
    // Word completely deleted
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Small pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

/* ==========================================
4. MAGNETIC BUTTONS PHYSICS ENGINE
========================================== */
function initMagneticButtons() {
  const magneticEls = document.querySelectorAll('.btn-magnetic');
  
  magneticEls.forEach(el => {
    el.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      // Mouse coordinates relative to target element
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull button slightly toward cursor (max 12px translation)
      this.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      this.style.boxShadow = `0 12px 30px rgba(59, 130, 246, 0.35)`;
      
      // Magnetic pull on icon inside button if exists
      const icon = this.querySelector('.magnetic-icon');
      if (icon) {
        icon.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      }
    });

    el.addEventListener('mouseleave', function() {
      // Elastic return to original position
      this.style.transform = 'translate(0px, 0px)';
      this.style.boxShadow = '';
      
      const icon = this.querySelector('.magnetic-icon');
      if (icon) {
        icon.style.transform = 'translate(0px, 0px)';
      }
    });
  });
}

/* ==========================================
5. SCROLL REVEALS & ACTIVE STATE TRACKING
========================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.12, // Element must be 12% in viewport before revealing
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element leaves bottom boundary
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Track active section and update floating navigation classes
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    // Header scrolled state
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link update
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140; // Offset for sticky navbar
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================
6. STATS COUNTER ANIMAION
========================================== */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseInt(target.getAttribute('data-target'));
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        
        let currentValue = 0;
        const duration = 2000; // 2 seconds total count animation
        const interval = 30; // 30ms step updates
        const increment = Math.ceil(targetValue / (duration / interval));

        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
          }
          target.textContent = `${prefix}${currentValue}${suffix}`;
        }, interval);

        observer.unobserve(target); // Animate only once
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(num => {
    countObserver.observe(num);
  });
}

/* ==========================================
7. MOBILE NAVIGATION SYSTEM
========================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav ul li a');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    // Toggle menu icon between list and close
    const isOpened = nav.classList.contains('active');
    toggle.innerHTML = isOpened 
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  });

  // Close nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });
  });

  // Smooth scroll links alignment
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================
8. DYNAMIC CONTACT FORM FEEDBACK
========================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const statusMsg = document.getElementById('form-status');
  
  if (!form || !statusMsg) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending message <svg class="animate-spin" style="animation: spin 1s linear infinite; width: 16px; height: 16px; margin-left: 8px; display: inline;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

    if (!document.getElementById('spin-keyframe')) {
      const style = document.createElement('style');
      style.id = 'spin-keyframe';
      style.innerHTML = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    const formData = new FormData(form);

    fetch('/contact/', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      statusMsg.style.display = 'block';

      if (data.status === 'success') {
        statusMsg.className = 'form-status-msg success';
        statusMsg.textContent = 'Message sent successfully.';
      } else {
        statusMsg.className = 'form-status-msg error';
        statusMsg.textContent = data.message || 'Failed to send message. Please try again.';
      }

      setTimeout(() => {
        statusMsg.style.display = 'none';
        statusMsg.className = 'form-status-msg';
      }, 5000);
    })
    .catch(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      statusMsg.style.display = 'block';
      statusMsg.className = 'form-status-msg error';
      statusMsg.textContent = 'Failed to send message. Please try again.';

      setTimeout(() => {
        statusMsg.style.display = 'none';
        statusMsg.className = 'form-status-msg';
      }, 5000);
    });
  });
}
