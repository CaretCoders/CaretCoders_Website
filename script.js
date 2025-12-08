
document.addEventListener('DOMContentLoaded', () => {

  // --- 0. Loading Screen ---
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.querySelector('main');
  
  // Function to hide the loader
  const hideLoader = () => {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      mainContent.classList.add('visible');
      // Optional: remove from DOM after transition
      setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.remove();
        }
      }, 500);
    }
  };

  // Show loader immediately
  if (mainContent) mainContent.classList.remove('visible');

  // We want the loader to show for a minimum amount of time, AND for the content to be loaded.
  const minDisplayTime = 2500; // 2.5 seconds
  let pageLoaded = false;
  let timerElapsed = false;

  const tryHideLoader = () => {
      // Hide only if both conditions are met
      if(pageLoaded && timerElapsed) {
          hideLoader();
      }
  }

  // Set a timer for the minimum display duration
  setTimeout(() => {
    timerElapsed = true;
    tryHideLoader();
  }, minDisplayTime);

  // Listen for when the window and all its assets are fully loaded
  window.addEventListener('load', () => {
      pageLoaded = true;
      tryHideLoader();
  });


  // --- 1. Custom Cursor ---
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    window.addEventListener('mousemove', e => {
      // Subtract half the cursor's size to center it
      cursor.style.top = (e.clientY - 12) + 'px';
      cursor.style.left = (e.clientX - 12) + 'px';
    });
  }


  // --- 2. Parallax Effect for Hero Section ---
  const parallaxItems = document.querySelectorAll('.hero-parallax-item');
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      parallaxItems.forEach(item => {
        const speedX = parseFloat(item.dataset.speedX || '0');
        const speedY = parseFloat(item.dataset.speedY || '0');
        
        const moveX = speedX * 50 * -x; 
        const moveY = speedY * 50 * -y;
        
        item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });
  }


  // --- 3. Side Navigation Active State & Smooth Scroll ---
  const navDots = document.querySelectorAll('.side-nav-button');
  const sections = document.querySelectorAll('main > section');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.4 // Section is considered active when 40% is visible
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        navDots.forEach(item => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Smooth scroll for nav links and other internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
      }
    });
  });

  // Hover-to-reveal side nav
  const sideNavHotspot = document.getElementById('side-nav-hotspot');
  const sideNav = document.querySelector('.side-nav');

  if(sideNavHotspot && sideNav){
    sideNavHotspot.addEventListener('mouseenter', () => {
        sideNav.classList.add('visible');
    });
    sideNavHotspot.addEventListener('mouseleave', () => {
        sideNav.classList.remove('visible');
    });
  }


  // --- 4. Projects Section Slider ---
  const sliderContainer = document.querySelector('.projects-slider');
  const slides = document.querySelectorAll('.project-slide');
  const nextButton = document.getElementById('next-project');
  const prevButton = document.getElementById('prev-project');

  if (sliderContainer && slides.length > 0 && nextButton && prevButton) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    const updateSlider = () => {
      sliderContainer.style.transform = `translateX(-${currentSlide * 100}vw)`;
      prevButton.disabled = currentSlide === 0;
      nextButton.disabled = currentSlide === totalSlides - 1;
    };

    nextButton.addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlider();
      }
    });

    prevButton.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
      }
    });

    updateSlider();
  }
  
  // --- 5. Simple Fade-in-up Animation on Scroll ---
  const animateOnScrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(element => {
      animateOnScrollObserver.observe(element);
  });


  // --- 6. Contact Form Submission ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      setTimeout(() => {
        alert('Message Sent! (This is a simulation)');
        submitButton.disabled = false;
        // Restore button text and icon
        submitButton.innerHTML = 'Send Message <i data-lucide="send" class="send-icon"></i>';
        lucide.createIcons(); // Re-render Lucide icons
        contactForm.reset();
      }, 1000);
    });
  }

  // --- 7. Theme Toggle ---
  const themeToggle = document.getElementById('theme-checkbox');
  const htmlElement = document.documentElement;

  const applyTheme = (theme) => {
      if (theme === 'dark') {
          htmlElement.classList.add('dark');
          if (themeToggle) themeToggle.checked = true;
      } else {
          htmlElement.classList.remove('dark');
          if (themeToggle) themeToggle.checked = false;
      }
  };

  // On load, check for saved theme in localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
      applyTheme(savedTheme);
  } else if (systemPrefersDark) {
      applyTheme('dark');
  } else {
      applyTheme('light');
  }

  // Add event listener for the toggle
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
  }

});
