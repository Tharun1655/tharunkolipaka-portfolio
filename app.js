// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initProjectFilters();
    initContactForm();
    initBackToTop();
    initIntersectionObserver();
    
    // Fix hero section HTML rendering
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && heroTitle.innerHTML.includes('&lt;')) {
            heroTitle.innerHTML = 'Hi, I\'m <span class="text-primary">Kolipaka Tharun</span>';
        }
    }, 100);
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('mainNavbar');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButtons = document.querySelectorAll('a[href^="#"]');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for all internal links
    const allInternalLinks = document.querySelectorAll('a[href^="#"]');
    allInternalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.stat-card, .skill-item, .service-card, .project-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
}

// Skill progress bars animation
function initSkillBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    let skillsAnimated = false;
    
    function animateSkills() {
        if (skillsAnimated) return;
        
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;
        
        const skillsTop = skillsSection.getBoundingClientRect().top;
        
        if (skillsTop < window.innerHeight - 100) {
            skillsAnimated = true;
            
            progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                }, index * 100);
            });
        }
    }
    
    window.addEventListener('scroll', animateSkills);
    animateSkills(); // Run once on load
}

// Project filtering
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Ensure form inputs are properly configured
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.style.pointerEvents = 'auto';
        input.style.userSelect = 'auto';
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        
        // Add focus handlers
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e9ecef';
            this.style.boxShadow = 'none';
        });
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Validate form
        if (!validateForm(name, email, message)) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Hide loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Message sent successfully! Thank you for contacting me.', 'success');
            
            // Reset form
            contactForm.reset();
        }, 2000);
    });
    
    function validateForm(name, email, message) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!name || !name.trim()) {
            showNotification('Please enter your name.', 'error');
            return false;
        }
        
        if (!email || !email.trim() || !emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return false;
        }
        
        if (!message || !message.trim()) {
            showNotification('Please enter your message.', 'error');
            return false;
        }
        
        return true;
    }
    
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" style="background:none;border:none;color:white;font-size:1.2rem;cursor:pointer;">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#43e97b' : '#f5576c'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            max-width: 400px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Append to body
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for different elements
                if (entry.target.classList.contains('stat-card')) {
                    animateCounter(entry.target);
                }
                
                if (entry.target.classList.contains('service-card')) {
                    const icon = entry.target.querySelector('.service-icon');
                    if (icon) {
                        setTimeout(() => {
                            icon.style.transform = 'scale(1.1)';
                            setTimeout(() => {
                                icon.style.transform = 'scale(1)';
                            }, 200);
                        }, 300);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToObserve = document.querySelectorAll('.stat-card, .service-card, .project-card, .contact-item');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// Animate counter numbers
function animateCounter(card) {
    const number = card.querySelector('.stat-number');
    if (!number || number.classList.contains('animated')) return;
    
    number.classList.add('animated');
    const target = parseInt(number.textContent);
    let current = 0;
    const increment = target / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        number.textContent = Math.floor(current);
    }, 30);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mouse movement parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    hero.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const heroContent = hero.querySelector('.hero-content');
        if (!heroContent) return;
        
        const translateX = (mouseX - 0.5) * 20;
        const translateY = (mouseY - 0.5) * 20;
        
        heroContent.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
    
    hero.addEventListener('mouseleave', function() {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = 'translate(0, 0)';
        }
    });
}

// Initialize parallax effect
initParallax();

// Smooth reveal animations for project cards
function initProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize project animations
initProjectAnimations();

// Add loading animation to page
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Fade in page content
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Performance optimization: Throttle scroll events
const throttledScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', throttledScrollHandler);

// Add error handling for external resources
window.addEventListener('error', function(e) {
    console.warn('Resource loading error:', e.target.src || e.target.href);
});

// Preload important images
function preloadImages() {
    const images = [
        'https://via.placeholder.com/400x250/667eea/ffffff?text=Portfolio+Website',
        'https://via.placeholder.com/400x250/f093fb/ffffff?text=E-commerce+App',
        'https://via.placeholder.com/400x250/4facfe/ffffff?text=Task+Manager',
        'https://via.placeholder.com/400x250/43e97b/ffffff?text=Weather+App',
        'https://via.placeholder.com/400x250/764ba2/ffffff?text=Student+System',
        'https://via.placeholder.com/400x250/38f9d7/ffffff?text=REST+API'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals or menus
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if (navbarCollapse) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    }
});

// Add focus management for accessibility
const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #667eea';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

console.log('Portfolio website loaded successfully! 🚀');