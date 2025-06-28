// Dark mode toggle with localStorage
const toggleBtn = document.getElementById('toggle-dark');

// Check for saved user preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  toggleBtn.textContent = '☀️';
  updateDarkModeElements(); // Call this to fix existing elements
} else {
  document.body.classList.remove('dark-mode');
  toggleBtn.textContent = '🌙';
}

// Function to update all dark mode elements
function updateDarkModeElements() {
  const containers = document.querySelectorAll('.contact-container, .project, .skill-category');
  containers.forEach(container => {
    if (document.body.classList.contains('dark-mode')) {
      container.style.backgroundColor = '#1e1e1e';
      container.style.color = '#e0e0e0';
    } else {
      container.style.backgroundColor = '';
      container.style.color = '';
    }
  });
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  updateDarkModeElements(); // Update elements when toggling
});

// Call this after new elements are added to the page
window.updateDarkModeElements = updateDarkModeElements;s

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Animation on scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.project, .skill-category');
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (elementPosition < screenPosition) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
};

// Set initial state for animation
window.addEventListener('load', () => {
  const elements = document.querySelectorAll('.project, .skill-category');
  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Trigger animation after a short delay
  setTimeout(animateOnScroll, 300);
});

window.addEventListener('scroll', animateOnScroll);

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('#submit-btn');
    const responseMessage = document.getElementById('response-message');
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || 'Not provided',
        subject: document.getElementById('subject').value || 'No subject',
        message: document.getElementById('message').value
    };

    // Change button text and disable it
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Using FormSubmit.co for email submission (free service)
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
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            responseMessage.textContent = 'Thank you! Your message has been sent successfully.';
            responseMessage.className = 'response-message success';
            
            // Reset form
            document.getElementById('contact-form').reset();
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
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.disabled = false;
    });
});