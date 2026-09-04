/**
 * KISHOR J PORTFOLIO - SENIOR FRONTEND ENGINEERING SCRIPT
 * Handles Typewriter, Theme Toggle, Navbar Scroll Tracking, Skill Filtering,
 * Form Validation, Copy to Clipboard, and Toast Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // 1. DYNAMIC TYPEWRITER EFFECT
  // ----------------------------------------------------
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const words = [
      "AI & Python Full Stack Developer",
      "FastAPI & React.js Developer",
      "Enterprise SaaS & AI Engineer",
      "Semantic Matching & NLP Specialist"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 1800; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 300; // Pause before starting new word
      }

      setTimeout(type, typeSpeed);
    }

    setTimeout(type, 500);
  }

  // ----------------------------------------------------
  // 2. THEME SWITCHER (DARK / LIGHT MODE)
  // ----------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    htmlElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} mode`, 'fa-adjust');
    });
  }

  // ----------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER
  // ----------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking nav links
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside header
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----------------------------------------------------
  // 4. SCROLL SPY / ACTIVE NAV INDICATOR
  // ----------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function activateNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', activateNavOnScroll);

  // ----------------------------------------------------
  // 5. SKILLS FILTERING & REAL-TIME SEARCH
  // ----------------------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  const skillSearchInput = document.getElementById('skill-search-input');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  function filterSkills() {
    skillCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardName = (card.getAttribute('data-name') || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all') || cardCategory.includes(currentCategory);
      const matchesSearch = cardName.includes(currentSearchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentCategory = btn.getAttribute('data-filter');
      filterSkills();
    });
  });

  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      filterSkills();
    });
  }

  // ----------------------------------------------------
  // 6. COPY EMAIL TO CLIPBOARD
  // ----------------------------------------------------
  const emailStr = 'gowdakishor457@gmail.com';

  function copyEmailToClipboard() {
    navigator.clipboard.writeText(emailStr).then(() => {
      showToast('Email address copied to clipboard!', 'fa-copy');
    }).catch(err => {
      showToast(`Copy failed: ${emailStr}`, 'fa-envelope');
    });
  }

  const heroCopyEmailBtn = document.getElementById('hero-copy-email');
  if (heroCopyEmailBtn) {
    heroCopyEmailBtn.addEventListener('click', copyEmailToClipboard);
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', copyEmailToClipboard);
  }

  // ----------------------------------------------------
  // 7. CONTACT FORM INTERACTIVITY & VALIDATION
  // ----------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('form-submit-btn');
  const responseMsg = document.getElementById('form-response-msg');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (responseMsg) {
        responseMsg.style.display = 'none';
        responseMsg.className = 'form-response-msg';
      }

      // Validate Name
      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) nameInput.closest('.form-group').classList.add('error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('error');
      }

      // Validate Email
      if (!emailInput || !emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        if (emailInput) emailInput.closest('.form-group').classList.add('error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('error');
      }

      // Validate Message
      if (!messageInput || !messageInput.value.trim()) {
        if (messageInput) messageInput.closest('.form-group').classList.add('error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('error');
      }

      if (isValid) {
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending message...`;

        const payload = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          _subject: subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : 'Portfolio Contact Inquiry',
          message: messageInput.value.trim()
        };

        fetch('https://formsubmit.co/ajax/6eb29659d0eb4da66e1ad8d18dd665e', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;

          if (responseMsg) {
            responseMsg.className = 'form-response-msg success';
            responseMsg.innerHTML = `<i class="fas fa-check-circle" style="font-size: 18px;"></i> <span>Thank you! Your message has been sent directly to Kishor J.</span>`;
            responseMsg.style.display = 'flex';
          }

          showToast('Thank you! Message sent successfully.', 'fa-paper-plane');
          contactForm.reset();
        })
        .catch(err => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;

          // Direct mailto trigger fallback (without _blank popup block)
          const subject = encodeURIComponent(payload._subject);
          const body = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`);
          window.location.href = `mailto:gowdakishor457@gmail.com?subject=${subject}&body=${body}`;

          if (responseMsg) {
            responseMsg.className = 'form-response-msg success';
            responseMsg.innerHTML = `<i class="fas fa-envelope" style="font-size: 18px;"></i> <span>Opening your email client to send message...</span>`;
            responseMsg.style.display = 'flex';
          }

          showToast('Opening email application...', 'fa-envelope');
        });
      }
    });

    // Clear error class on typing
    [nameInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.closest('.form-group').classList.remove('error');
        });
      }
    });
  }

  // ----------------------------------------------------
  // 8. FLOATING BACK TO TOP BUTTON
  // ----------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------------------------------
  // 9. DYNAMIC FOOTER YEAR
  // ----------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ----------------------------------------------------
  // 10. TOAST NOTIFICATION HELPER
  // ----------------------------------------------------
  function showToast(message, iconClass = 'fa-check-circle') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});