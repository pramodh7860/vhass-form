// Navigation menu functionality
const menuBtn = document.querySelector('.nav__menu__btn');
const navLinks = document.querySelector('.nav__links');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav__menu__btn') && !e.target.closest('.nav__links')) {
    navLinks.classList.remove('open');
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      navLinks.classList.remove('open');
    }
  });
});

// Course card hover effects
document.querySelectorAll('.course__card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// Contact form handling
const contactForm = document.querySelector('.contact__form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to your server
    console.log('Contact form submission:', data);
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
  });
}

// Initialize ScrollReveal for animations
const sr = ScrollReveal({
  origin: 'bottom',
  distance: '60px',
  duration: 1000,
  delay: 200,
  reset: true
});

// Animate elements on scroll
sr.reveal('.header__content', { delay: 200 });
sr.reveal('.course__card', { interval: 200 });
sr.reveal('.about__content', { delay: 200 });
sr.reveal('.stat', { interval: 200 });
sr.reveal('.contact__grid', { delay: 200 });

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for fade-in
document.querySelectorAll('.course__card, .stat, .contact__item').forEach(el => {
  observer.observe(el);
});

// Add CSS class for fade-in animation
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    animation: fadeIn 0.5s ease-in forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__image__content ", {
  duration: 1000,
  delay: 1500,
});

ScrollReveal().reveal(".product__image img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".product__card", {
  ...scrollRevealOption,
  delay: 500,
  interval: 500,
});

const swiper = new Swiper(".swiper", {
  loop: true,
  effect: "coverflow",
  grabCursor: true,
  centerSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    depth: 250,
    modifier: 1,
    scale: 0.75,
    slideShadows: false,
    stretch: -100,
  },

  pagination: {
    el: ".swiper-pagination",
  },
});

// ENROLL NOW FLOW FOR CEH PAGE

// Modal elements
const enrollBtn = document.getElementById('enroll-btn');
const enrollmentModal = document.getElementById('enrollmentModal');
const closeButtons = document.querySelectorAll('.modal .close');

// Show enrollment form modal
if (enrollBtn) {
  enrollBtn.onclick = () => {
    enrollmentModal.style.display = 'flex';
    // Reset form and show QR step
    const qrStep = document.getElementById('qrStep');
    const cehForm = document.getElementById('cehForm');
    const thankYou = document.getElementById('thankYou');
    if (qrStep) qrStep.style.display = 'block';
    if (cehForm) {
      cehForm.style.display = 'none';
      cehForm.reset();
    }
    if (thankYou) thankYou.style.display = 'none';
  };
}

// Close modals on X click
if (closeButtons) {
  closeButtons.forEach(btn => {
    btn.onclick = () => {
      const modal = btn.closest('.modal');
      if (modal) modal.style.display = 'none';
    };
  });
}

// Close modals on outside click
window.onclick = function(event) {
  if (event.target === enrollmentModal) {
    enrollmentModal.style.display = 'none';
  }
};

// MongoDB Atlas configuration
const MONGODB_API_URL = 'YOUR_MONGODB_DATA_API_URL'; // Replace with your MongoDB Atlas Data API URL
const MONGODB_API_KEY = 'YOUR_MONGODB_API_KEY'; // Replace with your MongoDB Atlas API Key

// Handle enrollment form submission
document.getElementById('enrollmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        phone: document.getElementById('phone').value,
        occupation: document.getElementById('Occupation').value,
        courseName: document.getElementById('courseName').value,
        coursePrice: document.getElementById('coursePrice').value,
        registrationDate: new Date().toISOString(),
        paymentId: null // Will be updated when payment is made
    };

    try {
        // Store form data in MongoDB
        const response = await fetch(MONGODB_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': MONGODB_API_KEY
            },
            body: JSON.stringify({
                dataSource: 'Cluster0',
                database: 'course_registrations',
                collection: 'registrations',
                document: formData
            })
        });

        if (!response.ok) {
            throw new Error('Failed to store registration');
        }

        // Store the registration ID in sessionStorage for payment
        const result = await response.json();
        sessionStorage.setItem('currentRegistrationId', result.insertedId);
        
        // Close enrollment modal and show QR modal
        document.getElementById('enrollmentModal').style.display = 'none';
        document.getElementById('qrModal').style.display = 'block';
        
        // Start QR timer
        startQRTimer();
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed. Please try again or contact support.');
    }
});

// Handle payment ID submission
document.getElementById('submitPaymentId').addEventListener('click', async function() {
    const paymentId = document.getElementById('paymentId').value;
    if (!paymentId) {
        alert('Please enter a payment ID');
        return;
    }

    try {
        const registrationId = sessionStorage.getItem('currentRegistrationId');
        if (!registrationId) {
            throw new Error('No registration found');
        }

        // Update registration with payment ID in MongoDB
        const response = await fetch(MONGODB_API_URL, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'api-key': MONGODB_API_KEY
            },
            body: JSON.stringify({
                dataSource: 'Cluster0',
                database: 'course_registrations',
                collection: 'registrations',
                filter: { _id: { $oid: registrationId } },
                update: {
                    $set: { paymentId: paymentId }
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update payment ID');
        }

        alert('Registration successful! Your payment ID has been recorded.');
        // Clear the registration ID from session storage
        sessionStorage.removeItem('currentRegistrationId');
        // Close payment ID modal
        document.getElementById('paymentIdModal').style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
        alert('Payment ID update failed. Please try again or contact support.');
    }
});

// QR Modal logic
let qrTimerInterval;
function showQRModal() {
  qrModal.style.display = 'block';
  let timeLeft = 3 * 60; // 3 minutes
  const timerDisplay = document.getElementById('qr-timer');
  timerDisplay.textContent = 'Time remaining: 3:00';
  clearQRTimer();
  qrTimerInterval = setInterval(() => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timerDisplay.textContent = `Time remaining: ${min}:${sec.toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearQRTimer();
      qrModal.style.display = 'none';
      failModal.style.display = 'block';
    }
    timeLeft--;
  }, 1000);
}
function clearQRTimer() {
  if (qrTimerInterval) clearInterval(qrTimerInterval);
}

// Done and Fail buttons in QR modal
const doneBtn = document.getElementById('doneBtn');
const failBtn = document.getElementById('failBtn');
if (doneBtn) {
  doneBtn.onclick = () => {
    qrModal.style.display = 'none';
    clearQRTimer();
    paymentIdModal.style.display = 'block';
  };
}
if (failBtn) {
  failBtn.onclick = () => {
    qrModal.style.display = 'none';
    clearQRTimer();
    failModal.style.display = 'block';
  };
}

// Payment ID submit
const submitPaymentId = document.getElementById('submitPaymentId');
if (submitPaymentId) {
  submitPaymentId.onclick = () => {
    const paymentId = document.getElementById('paymentId').value.trim();
    if (!paymentId) {
      alert('Please enter your Payment ID.');
      return;
    }
    paymentIdModal.style.display = 'none';
    alert('Thank you! Your payment will be verified and you will receive course access soon.');
  };
}

// Fail modal close
const failCloseBtn = document.getElementById('failCloseBtn');
if (failCloseBtn) {
  failCloseBtn.onclick = () => {
    failModal.style.display = 'none';
  };
}
