// PARTICLE NETWORK - MIND-BLOWING EFFECT
class ParticleNetwork {
  constructor() {
    this.canvas = document.getElementById('particleNetwork');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0, radius: 100 };
    
    this.init();
    this.animate();
    
    // Mouse move event
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    // Window resize
    window.addEventListener('resize', () => this.init());
  }
  
  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.particles = [];
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 10));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(255, 107, 53, ${Math.random() * 0.5 + 0.1})`
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    for (let particle of this.particles) {
      // Mouse interaction
      const dx = particle.x - this.mouse.x;
      const dy = particle.y - this.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        
        particle.x += Math.cos(angle) * force * 2;
        particle.y += Math.sin(angle) * force * 2;
      }
      
      // Move particles
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off walls
      if (particle.x <= 0 || particle.x >= this.canvas.width) particle.speedX *= -1;
      if (particle.y <= 0 || particle.y >= this.canvas.height) particle.speedY *= -1;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
    }
    
    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const opacity = 1 - distance / 100;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(255, 107, 53, ${opacity * 0.3})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// === TYPING ANIMATION ===
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.txtElement.textContent = this.txt;

    let typeSpeed = 100;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// === CIRCULAR METERS ANIMATION - FIXED FOR MOBILE ===
function animateCircularMeters() {
  const circles = document.querySelectorAll('.progress-ring-circle');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const circle = entry.target;
        const percent = parseInt(circle.getAttribute('data-percent'));
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        
        // Set initial state
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        // Animate after a short delay
        setTimeout(() => {
          circle.style.transition = 'stroke-dashoffset 1.2s ease-in-out';
          circle.style.strokeDashoffset = offset;
        }, 200);
        
        // Animate percentage counter
        const percentElement = circle.closest('.circular-meter').querySelector('.circle-percent');
        if (percentElement) {
          animateCounter(percentElement, 0, percent, 1200);
        }
        
        observer.unobserve(circle);
      }
    });
  }, { threshold: 0.3 });
  
  circles.forEach(circle => observer.observe(circle));
}

function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value + '%';
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// === MOBILE MENU FUNCTIONALITY ===
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar a');

  if (mobileMenuBtn && navbar) {
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.toggle('active');
      mobileMenuBtn.innerHTML = navbar.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenuBtn.contains(e.target) && navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
  document.querySelectorAll('.navbar a, .hero-buttons a').forEach(link => {
    link.addEventListener('click', e => {
      if(link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          window.scrollTo({
            top: targetEl.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// === RESUME MODAL ===
function initResumeModal() {
  const resumeBtn = document.querySelector(".resume-btn");
  const resumeModal = document.getElementById("resumeModal");
  const closeResume = document.querySelector(".resume-close");

  if(resumeBtn && resumeModal) {
    resumeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resumeModal.style.display = "flex";
    });
  }

  if(closeResume && resumeModal) {
    closeResume.addEventListener("click", () => {
      resumeModal.style.display = "none";
    });
  }

  if(resumeModal) {
    window.addEventListener("click", (e) => {
      if (e.target === resumeModal) {
        resumeModal.style.display = "none";
      }
    });
  }
}

// === HEADER SCROLL EFFECT ===
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

// === ACTIVE NAV LINK ON SCROLL ===
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar a');
  
  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 100)) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
          link.classList.add('active');
        }
      });
    });
  }
}

// === CONTACT FORM ===
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! I will get back to you soon.');
      contactForm.reset();
    });
  }
}

// === TYPING INITIALIZATION ===
function initTyping() {
  const txtElement = document.querySelector('.typed-text');
  if (txtElement) {
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
  }
}

// === MAIN INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new ParticleNetwork();
  initTyping();
  initMobileMenu();
  initSmoothScroll();
  initResumeModal();
  initHeaderScroll();
  initActiveNavLinks();
  initContactForm();
  
  // Initialize circular meters with a small delay to ensure DOM is ready
  setTimeout(() => {
    animateCircularMeters();
  }, 500);
});

// === WINDOW RESIZE HANDLER ===
window.addEventListener('resize', () => {
  // Re-initialize circular meters on resize to handle mobile/desktop transitions
  setTimeout(() => {
    animateCircularMeters();
  }, 300);
});