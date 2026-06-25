const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const loader = document.getElementById('loader');
const typingText = document.getElementById('typingText');
const counters = document.querySelectorAll('.counter');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const faqItems = document.querySelectorAll('.faq-item');
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterMessage = document.getElementById('newsletterMessage');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const revealElements = document.querySelectorAll('.reveal, .reveal-on-scroll');

let mouseX = 0;
let mouseY = 0;
const floatingCards = document.querySelectorAll('.floating-card');

const domains = [
  'Web Development',
  'Java Development',
  'AI/ML',
  'Data Science',
  'Cyber Security',
];
let domainIndex = 0;
let charIndex = 0;
let typingForward = true;

const testimonials = Array.from(testimonialCards);
let testimonialIndex = 0;
let testimonialTimer = null;

function setTheme(theme) {
  body.classList.toggle('dark', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
  localStorage.setItem('technova-theme', theme);
}

function loadTheme() {
  const storedTheme = localStorage.getItem('technova-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(storedTheme || (prefersDark ? 'dark' : 'light'));
}

function toggleMenu() {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
}

function smoothScroll(event) {
  if (event.target.matches('a[href^="#"]')) {
    event.preventDefault();
    const targetId = event.target.getAttribute('href').slice(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }
}

function runTypingAnimation() {
  const currentDomain = domains[domainIndex];
  if (typingForward) {
    charIndex += 1;
    typingText.textContent = currentDomain.slice(0, charIndex);
    if (charIndex === currentDomain.length) {
      typingForward = false;
      setTimeout(runTypingAnimation, 1200);
      return;
    }
  } else {
    charIndex -= 1;
    typingText.textContent = currentDomain.slice(0, charIndex);
    if (charIndex === 0) {
      typingForward = true;
      domainIndex = (domainIndex + 1) % domains.length;
    }
  }
  setTimeout(runTypingAnimation, typingForward ? 120 : 70);
}

const projectDetails = {
  portfolio: {
    title: 'Portfolio Website',
    badge: 'Web Development',
    description: 'A clean, modern personal portfolio website built with semantic HTML5, fluid layouts in CSS, and subtle javascript interactive scroll states. Designed to showcase work experience, projects, and custom layouts.',
    features: [
      'Responsive design fitting all mobile, tablet, and desktop screens',
      'Interactive work showcase with filtering mechanisms',
      'Smooth scroll reveals and custom page navigation effects',
      'Fully accessible inputs and semantic metadata structure'
    ],
    stack: 'HTML5 • CSS3 • JavaScript',
    duration: '1 Week'
  },
  calculator: {
    title: 'Calculator App',
    badge: 'UI Design & JS',
    description: 'A premium calculator app featuring basic and scientific notation modes, history logs, and instant calculation feeds. The UI uses glassmorphism and neat micro-animations for keystrokes.',
    features: [
      'Interactive scientific formula inputs and output handling',
      'Calculation tracking history panel with localStorage support',
      'Modern glassmorphic aesthetic with custom active state colors',
      'Keyboard input binding and layout flexibility'
    ],
    stack: 'JavaScript • HTML5 • CSS Grid',
    duration: '1 Week'
  },
  gallery: {
    title: 'Image Gallery',
    badge: 'UX & CSS Grid',
    description: 'A premium masonry image grid displaying dynamic media. Users can filter categories, preview full-resolution images via a custom built lightbox, and search assets instantly.',
    features: [
      'Custom lightbox container with prev/next navigations',
      'Animated tag filtering for seamless layout adjustments',
      'Smooth image load lazy states and zoom hover effects',
      'Adaptive screen resizing and accessibility handling'
    ],
    stack: 'CSS Grid • JavaScript • SVG Icons',
    duration: '2 Weeks'
  },
  todo: {
    title: 'To-Do Application',
    badge: 'State & Storage',
    description: 'A dashboard task tracker application featuring list separations, category tags, sorting rules, and localStorage persistence. Offers interactive swipe actions or toggle flags to complete items.',
    features: [
      'Local state management for offline accessibility',
      'Task categorizing with color-coded custom labels',
      'Dynamic progression trackers and statistics boards',
      'Bulk cleanups and custom drag-and-drop support'
    ],
    stack: 'JavaScript • LocalStorage • Flexbox',
    duration: '2 Weeks'
  },
  quiz: {
    title: 'Quiz Application',
    badge: 'Interactivity & UI',
    description: 'A gamified multi-choice knowledge application. Built with scoring calculations, progress timelines, and custom result dashboards with downloadable review stats.',
    features: [
      'Interactive timers and transition states for pacing',
      'Score analysis with responsive radial progression circles',
      'Shuffle arrays for questions and dynamic choice loads',
      'Category selection screens and high score records'
    ],
    stack: 'JavaScript • CSS Animations • LocalStorage',
    duration: '2 Weeks'
  },
  weather: {
    title: 'Weather Dashboard',
    badge: 'API & JavaScript',
    description: 'A meteorological analytics portal displaying real-time weather stats, multi-day forecasting, search memory logs, and theme adjustments tailored to environmental conditions.',
    features: [
      'Fetch operations parsing weather indicators',
      'Interactive charts illustrating wind speed or UV trends',
      'Autocomplete search suggestions for thousands of locations',
      'Animated climate widgets based on temperature outputs'
    ],
    stack: 'API Integration • Fetch API • JSON Parsing',
    duration: '2 Weeks'
  }
};

function initIntersectionObserver() {
  // Counters observer
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const countersList = entry.target.querySelectorAll('.counter');
        countersList.forEach((counter) => {
          const target = +counter.dataset.target;
          const duration = 1600;
          const startTime = performance.now();
          const update = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            counter.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target;
          };
          if (!counter.dataset.animated) {
            counter.dataset.animated = 'true';
            requestAnimationFrame(update);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const statsSection = document.querySelector('#programs');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  // Scroll reveal observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
}

function showBackToTop() {
  if (window.scrollY > 520) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

function initTestimonials() {
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  
  if (!dotsContainer || !testimonials.length) return;
  
  dotsContainer.innerHTML = '';
  testimonials.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
    dot.addEventListener('click', () => {
      goToTestimonial(i);
      resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });
  
  const dots = document.querySelectorAll('.testimonial-dot');

  function goToTestimonial(index) {
    testimonials[testimonialIndex].classList.remove('active');
    dots[testimonialIndex].classList.remove('active');
    
    testimonialIndex = (index + testimonials.length) % testimonials.length;
    
    testimonials[testimonialIndex].classList.add('active');
    dots[testimonialIndex].classList.add('active');
  }

  function startAutoSlide() {
    testimonialTimer = setInterval(() => {
      goToTestimonial(testimonialIndex + 1);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(testimonialTimer);
    startAutoSlide();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToTestimonial(testimonialIndex - 1);
      resetAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToTestimonial(testimonialIndex + 1);
      resetAutoSlide();
    });
  }

  startAutoSlide();
}

function initDomainCardClicks() {
  const domainCards = document.querySelectorAll('.domain-card');
  const domainSelect = document.getElementById('domain');
  
  domainCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const title = card.querySelector('h3').textContent.trim();
      
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      if (domainSelect) {
        for (let i = 0; i < domainSelect.options.length; i++) {
          const option = domainSelect.options[i];
          if (option.text.toLowerCase().includes(title.toLowerCase()) || 
              title.toLowerCase().includes(option.text.toLowerCase())) {
            domainSelect.selectedIndex = i;
            break;
          }
        }
        domainSelect.dispatchEvent(new Event('change'));
      }
    });
  });
}

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  const projectButtons = document.querySelectorAll('.project-btn');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalStack = document.getElementById('modalStack');
  const modalDuration = document.getElementById('modalDuration');
  const modalApplyBtn = document.getElementById('modalApplyBtn');
  const domainSelect = document.getElementById('domain');

  if (!modal) return;

  function openModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    
    modalFeatures.innerHTML = '';
    data.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      modalFeatures.appendChild(li);
    });
    
    modalStack.textContent = data.stack;
    modalDuration.textContent = data.duration;
    
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    modalApplyBtn.onclick = () => {
      closeModal();
      
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (domainSelect) {
        for (let i = 0; i < domainSelect.options.length; i++) {
          const option = domainSelect.options[i];
          if (option.text.toLowerCase().includes(data.badge.toLowerCase()) || 
              data.badge.toLowerCase().includes(option.text.toLowerCase()) ||
              (data.badge.includes('UI') && option.text.includes('UI')) ||
              (data.badge.includes('Web') && option.text.includes('Web'))) {
            domainSelect.selectedIndex = i;
            break;
          }
        }
        domainSelect.dispatchEvent(new Event('change'));
      }
    };
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.removeProperty('overflow');
  }

  projectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.dataset.project;
      openModal(projectId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function initFaqAccordion() {
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    button.addEventListener('click', () => {
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', isOpen);
    });
  });
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function handleContactValidation(event) {
  event.preventDefault();
  const fields = Array.from(contactForm.querySelectorAll('input, textarea, select'));
  let valid = true;

  fields.forEach((field) => {
    const error = field.nextElementSibling;
    const value = field.type === 'file' ? field.files.length : field.value.trim();
    if (!value) {
      error.textContent = 'This field is required.';
      valid = false;
    } else if (field.type === 'email' && !validateEmail(value)) {
      error.textContent = 'Please enter a valid email address.';
      valid = false;
    } else if (field.type === 'url' && !/^https?:\/\//.test(value)) {
      error.textContent = 'Please enter a valid link starting with https://.';
      valid = false;
    } else {
      error.textContent = '';
    }
  });

  if (!valid) {
    formMessage.textContent = 'Please fix the errors above before submitting.';
    formMessage.style.color = '#f87171';
    return;
  }

  const resumeInput = document.getElementById('resume');
  const file = resumeInput.files[0];
  const reader = new FileReader();
  
  formMessage.textContent = 'Uploading resume and submitting application...';
  formMessage.style.color = '#7c3aed';

  reader.onload = function(e) {
    const base64Data = e.target.result.split(',')[1];
    const payload = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      github: document.getElementById('github').value.trim(),
      linkedin: document.getElementById('linkedin').value.trim(),
      leetcode: document.getElementById('leetcode').value.trim(),
      domain: document.getElementById('domain').value,
      message: document.getElementById('message').value.trim(),
      resumeName: file.name,
      resumeData: base64Data
    };

    fetch('/api/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          formMessage.textContent = result.message;
          formMessage.style.color = '#34d399';
          contactForm.reset();
          checkApplicantStatus();
        } else {
          formMessage.textContent = result.message || 'Unable to submit application.';
          formMessage.style.color = '#f87171';
        }
      })
      .catch(() => {
        formMessage.textContent = 'Unable to submit application. Please try again later.';
        formMessage.style.color = '#f87171';
      });
  };

  reader.onerror = function() {
    formMessage.textContent = 'Error reading resume file. Please try again.';
    formMessage.style.color = '#f87171';
  };

  reader.readAsDataURL(file);
}

function handleNewsletterSubmit(event) {
  event.preventDefault();
  const emailValue = newsletterEmail.value.trim();
  if (!emailValue) {
    newsletterMessage.textContent = 'Please enter your email address.';
    newsletterMessage.style.color = '#f87171';
    return;
  }
  if (!validateEmail(emailValue)) {
    newsletterMessage.textContent = 'Enter a valid email address.';
    newsletterMessage.style.color = '#f87171';
    return;
  }
  
  newsletterMessage.textContent = 'Subscribing...';
  newsletterMessage.style.color = '#7c3aed';

  fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: emailValue })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        newsletterMessage.textContent = data.message || 'Subscribed successfully!';
        newsletterMessage.style.color = '#34d399';
        newsletterForm.reset();
      } else {
        newsletterMessage.textContent = data.message || 'Subscription failed.';
        newsletterMessage.style.color = '#f87171';
      }
    })
    .catch(() => {
      newsletterMessage.textContent = 'Subscription failed. Please try again later.';
      newsletterMessage.style.color = '#f87171';
    });
}

function handleMouseMove(event) {
  mouseX = event.clientX / window.innerWidth;
  mouseY = event.clientY / window.innerHeight;

  floatingCards.forEach((card, index) => {
    const moveX = (mouseX - 0.5) * 30 * (index % 2 === 0 ? 1 : -1);
    const moveY = (mouseY - 0.5) * 30 * (index % 2 === 0 ? 1 : -1);
    card.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
}

function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
    }, 900);
  });
}

function initEventListeners() {
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.classList.contains('dark') ? 'light' : 'dark';
    setTheme(nextTheme);
  });
  navToggle.addEventListener('click', toggleMenu);
  document.addEventListener('click', smoothScroll);
  contactForm.addEventListener('submit', handleContactValidation);
  newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    showBackToTop();
  });
  document.addEventListener('mousemove', handleMouseMove);
}

let currentApplication = null;

function checkApplicantStatus() {
  const statusBar = document.getElementById('statusBar');
  const statusLabel = document.getElementById('statusLabel');
  const viewOfferBtn = document.getElementById('viewOfferBtn');
  
  if (!statusBar || !statusLabel) return;
  
  fetch('/api/status')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        statusBar.style.display = 'block';
        const status = data.status || 'none';
        
        statusLabel.textContent = status;
        statusLabel.className = '';
        statusLabel.classList.add(status);
        
        if (status === 'approved' || status === 'accepted') {
          currentApplication = data.application;
          viewOfferBtn.style.display = 'inline-block';
          viewOfferBtn.textContent = status === 'accepted' ? 'View Onboarding Tasks' : 'View Offer & Tasks';
        } else {
          viewOfferBtn.style.display = 'none';
        }
      }
    })
    .catch(err => console.error('Error fetching status:', err));
}

function initOfferModal() {
  const offerModal = document.getElementById('offerModal');
  const viewOfferBtn = document.getElementById('viewOfferBtn');
  const offerModalClose = document.getElementById('offerModalClose');
  const offerDomain = document.getElementById('offerDomain');
  const offerTasks = document.getElementById('offerTasks');
  const acceptOfferBtn = document.getElementById('acceptOfferBtn');

  if (!offerModal || !viewOfferBtn) return;

  viewOfferBtn.addEventListener('click', () => {
    if (!currentApplication) return;
    
    offerDomain.textContent = currentApplication.domain;
    offerTasks.textContent = currentApplication.tasks || 'Review the onboarding curriculum and follow up with your mentor.';
    
    if (currentApplication.status === 'accepted') {
      acceptOfferBtn.textContent = 'Offer Accepted! ✓';
      acceptOfferBtn.disabled = true;
      acceptOfferBtn.style.background = '#10b981';
      acceptOfferBtn.style.borderColor = '#10b981';
      acceptOfferBtn.style.cursor = 'default';
    } else {
      acceptOfferBtn.textContent = 'Accept Internship Offer';
      acceptOfferBtn.disabled = false;
      acceptOfferBtn.style.removeProperty('background');
      acceptOfferBtn.style.removeProperty('border-color');
      acceptOfferBtn.style.removeProperty('cursor');
    }
    
    offerModal.classList.add('open');
    offerModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  function closeOfferModal() {
    offerModal.classList.remove('open');
    offerModal.setAttribute('aria-hidden', 'true');
    document.body.style.removeProperty('overflow');
  }

  if (offerModalClose) {
    offerModalClose.addEventListener('click', closeOfferModal);
  }

  offerModal.addEventListener('click', (e) => {
    if (e.target === offerModal) {
      closeOfferModal();
    }
  });

  acceptOfferBtn.addEventListener('click', () => {
    acceptOfferBtn.disabled = true;
    acceptOfferBtn.textContent = 'Accepting...';
    
    fetch('/api/accept', {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          acceptOfferBtn.textContent = 'Offer Accepted! ✓';
          acceptOfferBtn.style.background = '#10b981';
          acceptOfferBtn.style.borderColor = '#10b981';
          acceptOfferBtn.style.cursor = 'default';
          
          checkApplicantStatus();
          setTimeout(closeOfferModal, 1200);
        } else {
          acceptOfferBtn.disabled = false;
          acceptOfferBtn.textContent = 'Accept Internship Offer';
          alert('Unable to accept offer. Please try again.');
        }
      })
      .catch(() => {
        acceptOfferBtn.disabled = false;
        acceptOfferBtn.textContent = 'Accept Internship Offer';
        alert('Network error. Please try again later.');
      });
  });
}

function init() {
  loadTheme();
  runTypingAnimation();
  initIntersectionObserver();
  initTestimonials();
  initFaqAccordion();
  initDomainCardClicks();
  initProjectModal();
  checkApplicantStatus();
  initOfferModal();
  initEventListeners();
  initLoader();
}

init();
