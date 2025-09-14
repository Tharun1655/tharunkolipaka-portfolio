// Modern Portfolio JavaScript - 2025
class ModernPortfolio {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.contactForm = document.getElementById('contactForm');
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupTypewriter();
        this.setupContactForm();
        this.setupIntersectionObserver();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupFloatingShapes();
        this.preloadImages();
        
        // Add loading class removal
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    // Navigation functionality
    setupNavigation() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Navbar scroll effect
            if (currentScrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Update active nav link
            this.updateActiveNavLink();
            
            lastScrollY = currentScrollY;
        });
    }

    updateActiveNavLink() {
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

    // Mobile menu functionality
    setupMobileMenu() {
        if (!this.navToggle || !this.navMenu) return;
        
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on nav links
        this.navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for internal links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu if open
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });
    }

    // Typewriter effect for hero
    setupTypewriter() {
        const typewriterElement = document.getElementById('typewriter');
        if (!typewriterElement) return;
        
        const words = ['Tharun', 'a Developer', 'a Creator', 'an Innovator'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 200;
        
        const typeWriter = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                delay = 100;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                delay = 200;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 500;
            }
            
            setTimeout(typeWriter, delay);
        };
        
        // Start typewriter effect after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Contact form handling
    setupContactForm() {
        if (!this.contactForm) return;
        
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Form validation
        const validateEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };
        
        const showNotification = (message, type = 'success') => {
            // Remove existing notifications
            const existing = document.querySelector('.notification');
            if (existing) existing.remove();
            
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                    <span>${message}</span>
                    <button class="notification-close">×</button>
                </div>
            `;
            
            // Styles
            Object.assign(notification.style, {
                position: 'fixed',
                top: '100px',
                right: '20px',
                background: type === 'success' ? 'var(--accent-primary)' : '#ef4444',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                zIndex: '1001',
                maxWidth: '400px',
                animation: 'slideIn 0.3s ease'
            });
            
            // Add notification styles
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            
            // Close functionality
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => notification.remove());
            
            // Auto remove
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
            }, 5000);
        };
        
        this.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const subject = formData.get('subject').trim();
            const message = formData.get('message').trim();
            
            // Validation
            if (!name) {
                showNotification('Please enter your name.', 'error');
                return;
            }
            
            if (!email || !validateEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            if (!message) {
                showNotification('Please enter your message.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Success
                showNotification('Message sent successfully! Thank you for reaching out.', 'success');
                this.contactForm.reset();
                
                // Reset floating labels
                this.contactForm.querySelectorAll('.form-input').forEach(input => {
                    input.blur();
                });
                
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
        
        // Enhanced form interactions
        this.contactForm.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', (e) => {
                if (!e.target.value) {
                    e.target.parentElement.classList.remove('focused');
                }
            });
        });
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    
                    // Special animations for different elements
                    if (entry.target.classList.contains('stat-card')) {
                        this.animateCounter(entry.target);
                    }
                    
                    if (entry.target.classList.contains('skill-card')) {
                        this.animateSkill(entry.target);
                    }
                    
                    if (entry.target.classList.contains('project-card')) {
                        this.animateProject(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements
        const elementsToObserve = document.querySelectorAll(
            '.stat-card, .skill-card, .project-card, .contact-item, .hero-content'
        );
        
        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    }

    // Counter animation for stats
    animateCounter(card) {
        const numberElement = card.querySelector('.stat-number');
        if (!numberElement || numberElement.dataset.animated) return;
        
        numberElement.dataset.animated = 'true';
        const target = parseInt(numberElement.textContent);
        const duration = 2000;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(target * easeOutExpo);
            
            numberElement.textContent = current + (numberElement.textContent.includes('+') ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Skill card animation
    animateSkill(card) {
        if (card.dataset.animated) return;
        card.dataset.animated = 'true';
        
        const icon = card.querySelector('i');
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'scale(1.2) rotate(360deg)';
                icon.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }, 600);
            }, Math.random() * 200);
        }
    }

    // Project card animation
    animateProject(card) {
        if (card.dataset.animated) return;
        card.dataset.animated = 'true';
        
        const image = card.querySelector('.project-image img');
        if (image) {
            image.style.transform = 'scale(1.05)';
            image.style.transition = 'transform 0.6s ease';
            
            setTimeout(() => {
                image.style.transform = 'scale(1)';
            }, 300);
        }
    }

    // Scroll animations setup
    setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-shape');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        });
    }

    // Floating shapes animation
    setupFloatingShapes() {
        const shapes = document.querySelectorAll('.hero-shape');
        
        shapes.forEach((shape, index) => {
            // Random initial positions
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            
            shape.style.left = randomX + '%';
            shape.style.top = randomY + '%';
            
            // Add mouse interaction
            document.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                const translateX = (mouseX - 0.5) * 50 * (index + 1);
                const translateY = (mouseY - 0.5) * 50 * (index + 1);
                
                shape.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });
        });
    }

    // Preload images for better performance
    preloadImages() {
        const imageUrls = [
            'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&h=300&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=300&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop&crop=center'
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
}

// Utility functions
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },
    
    // Get element position relative to viewport
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            right: rect.right + window.scrollX,
            bottom: rect.bottom + window.scrollY
        };
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernPortfolio();
});

// Additional modern interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
    
    // Focus management for accessibility
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '3px solid var(--accent-primary)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`🚀 Portfolio loaded in ${loadTime}ms`);
        });
    }
    
    // Service worker registration for PWA capabilities (optional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Silent fail for demo purposes
        });
    }
});

// Cursor trail effect for modern touch
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--accent-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX - 2}px;
        top: ${e.clientY - 2}px;
        animation: trailFade 0.5s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 500);
});

// Add trail animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(trailStyle);

// Error handling
window.addEventListener('error', (e) => {
    console.warn('Resource loading error:', e.target?.src || e.target?.href || e.message);
});

// Console welcome message
console.log('%c🚀 Modern Portfolio 2025', 'color: #00D4FF; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with modern web technologies', 'color: #8B5CF6; font-size: 12px;');

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModernPortfolio, utils };
}
