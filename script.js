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

function animateCounters() {
  const statsSection = document.querySelector('#programs');
  if (!statsSection) return;
  const sectionTop = statsSection.getBoundingClientRect().top;
  const windowBottom = window.innerHeight;
  if (sectionTop < windowBottom - 120) {
    counters.forEach((counter) => {
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
  }
}

function showBackToTop() {
  if (window.scrollY > 520) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

function revealOnScroll() {
  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight - 90) {
      element.classList.add('active');
    }
  });
}

function initTestimonials() {
  testimonialTimer = setInterval(() => {
    testimonials[testimonialIndex].classList.remove('active');
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    testimonials[testimonialIndex].classList.add('active');
  }, 5000);
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

  const formData = new FormData(contactForm);

  fetch('/api/apply', {
    method: 'POST',
    body: formData
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        formMessage.textContent = result.message;
        formMessage.style.color = '#34d399';
        contactForm.reset();
      } else {
        formMessage.textContent = result.message || 'Unable to submit application.';
        formMessage.style.color = '#f87171';
      }
    })
    .catch(() => {
      formMessage.textContent = 'Unable to submit application. Please try again later.';
      formMessage.style.color = '#f87171';
    });
}

function handleNewsletterSubmit(event) {
  event.preventDefault();
  const emailValue = newsletterEmail.value.trim();
  if (!emailValue) {
    newsletterMessage.textContent = 'Please enter your email address.';
    newsletterMessage.style.color = '#f87171';
  } else if (!validateEmail(emailValue)) {
    newsletterMessage.textContent = 'Enter a valid email address.';
    newsletterMessage.style.color = '#f87171';
  } else {
    newsletterMessage.textContent = 'Subscribed successfully! Check your inbox for updates.';
    newsletterMessage.style.color = '#34d399';
    newsletterForm.reset();
  }
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
    animateCounters();
    revealOnScroll();
  });
  document.addEventListener('mousemove', handleMouseMove);
}

function init() {
  loadTheme();
  runTypingAnimation();
  animateCounters();
  revealOnScroll();
  initTestimonials();
  initFaqAccordion();
  initEventListeners();
  initLoader();
}

init();
