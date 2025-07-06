// Enhanced Dark Mode Toggle with localStorage
const toggleBtn = document.getElementById('toggle-dark');

// Check for saved user preference or system preference
const currentTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Apply the theme
if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  toggleBtn.textContent = '☀️';
} else {
  document.body.classList.remove('dark-mode');
  toggleBtn.textContent = '🌙';
}

// Update all theme-sensitive elements
function updateThemeElements() {
  const elements = document.querySelectorAll('.project, .skill-category, .about-content, .contact-item, .contact-form');
  elements.forEach(element => {
    if (document.body.classList.contains('dark-mode')) {
      element.style.backgroundColor = '#1e1e1e';
      element.style.color = '#e0e0e0';
    } else {
      element.style.backgroundColor = '';
      element.style.color = '';
    }
  });
}

// Toggle theme on button click
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  updateThemeElements();
});

// Initialize theme elements
updateThemeElements();

// Make function available globally
window.updateThemeElements = updateThemeElements;

// Enhanced Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Calculate the position to scroll to, accounting for fixed header
      const headerHeight = document.querySelector('nav').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without page jump
      if (history.pushState) {
        history.pushState(null, null, targetId);
      } else {
        location.hash = targetId;
      }
    }
  });
});

// Enhanced Animation on Scroll with Intersection Observer
const animateElementsOnScroll = () => {
  const elements = document.querySelectorAll('.project, .skill-category');
  const windowHeight = window.innerHeight;
  const triggerPoint = windowHeight / 5;
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    
    if (elementPosition < windowHeight - triggerPoint) {
      element.classList.add('visible');
    }
  });
};

// Initialize animation state
window.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.project, .skill-category');
  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Use Intersection Observer for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(element => {
    observer.observe(element);
  });
});

// Enhanced Contact Form Submission
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const submitBtn = this.querySelector('button[type="submit"]');
  const responseMessage = document.getElementById('response-message');
  
  // Get form values
  const formData = {
    name: this.querySelector('#name').value.trim(),
    email: this.querySelector('#email').value.trim(),
    phone: this.querySelector('#phone')?.value.trim() || 'Not provided',
    subject: this.querySelector('#subject')?.value.trim() || 'No subject',
    message: this.querySelector('#message').value.trim()
  };

  // Validate form
  if (!formData.name || !formData.email || !formData.message) {
    responseMessage.textContent = 'Please fill in all required fields.';
    responseMessage.className = 'response-message error';
    responseMessage.style.display = 'block';
    return;
  }

  // Change button state
  submitBtn.innerHTML = '<div class="loading-spinner"></div> Sending...';
  submitBtn.disabled = true;

  // Using FormSubmit.co for email submission
  fetch('https://formsubmit.co/ajax/singamtarak011@gmail.com', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      _replyto: formData.email,
      _subject: `New message from ${formData.name}: ${formData.subject}`,
      _template: 'table'
    })
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    if (data.success) {
      responseMessage.textContent = 'Thank you! Your message has been sent successfully.';
      responseMessage.className = 'response-message success';
      this.reset();
    } else {
      throw new Error('Failed to send message');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    responseMessage.textContent = 'Oops! Something went wrong. Please try again later or contact me directly at singamtarak011@gmail.com';
    responseMessage.className = 'response-message error';
  })
  .finally(() => {
    responseMessage.style.display = 'block';
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    submitBtn.disabled = false;
    
    // Hide message after 5 seconds
    setTimeout(() => {
      responseMessage.style.display = 'none';
    }, 5000);
  });
});

// Mobile menu toggle (if needed)
function setupMobileMenu() {
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
  
  const nav = document.querySelector('nav');
  if (nav) {
    nav.parentNode.insertBefore(mobileMenuBtn, nav);
    
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('mobile-menu-active');
    });
    
    // Close menu when clicking on a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('mobile-menu-active');
      });
    });
  }
}

// Initialize mobile menu on small screens
if (window.innerWidth <= 768) {
  setupMobileMenu();
}

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.remove('mobile-menu-active');
  }
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all elements that should appear on scroll
document.querySelectorAll('.project, .skill-category').forEach(el => {
  observer.observe(el);
});

// Dark mode toggle functionality
const toggleDark = document.getElementById('toggle-dark');
toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // Save preference to localStorage
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  // Update button icon
  toggleDark.textContent = isDark ? '☀️' : '🌙';
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') {
  document.body.classList.add('dark-mode');
  toggleDark.textContent = '☀️';
}

