// Navigation and Page Management
class SunsetShadesApp {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupContactForm();
        this.setupSmoothScrolling();
        this.setupProductHovers();
    }

    setupNavigation() {
        // Get all navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        const footerLinks = document.querySelectorAll('.footer-links a');
        
        // Add click event listeners to navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('href').substring(1);
                this.navigateToPage(targetPage);
            });
        });

        // Add click event listeners to footer links
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetPage = href.substring(1);
                    this.navigateToPage(targetPage);
                }
            });
        });

        // Add click event listeners to buttons that navigate
        const ctaButtons = document.querySelectorAll('.btn[href^="#"]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = button.getAttribute('href').substring(1);
                this.navigateToPage(targetPage);
            });
        });
    }

    navigateToPage(pageId) {
        // Hide all pages
        const allPages = document.querySelectorAll('.page');
        allPages.forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Update navigation active state
        this.updateNavActiveState(pageId);

        // Scroll to top
        window.scrollTo(0, 0);

        // Close mobile menu if open
        this.closeMobileMenu();
    }

    updateNavActiveState(activePageId) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page link
        const activeLink = document.querySelector(`.nav-link[href="#${activePageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mainNav = document.querySelector('.main-nav');

        if (mobileMenuToggle && mainNav) {
            mobileMenuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('mobile-open');
                mobileMenuToggle.classList.toggle('active');
            });
        }
    }

    closeMobileMenu() {
        const mainNav = document.querySelector('.main-nav');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (mainNav && mobileMenuToggle) {
            mainNav.classList.remove('mobile-open');
            mobileMenuToggle.classList.remove('active');
        }
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmission(contactForm);
            });

            // Remove any existing input event listeners that might cause progressive validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                // Clear any existing validation styling
                input.classList.remove('error');
                input.style.borderColor = '';
            });
        }
    }

    handleContactFormSubmission(form) {
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();

        // Clear any existing error styling
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('error');
            input.style.borderColor = '';
        });

        // Validate form
        let hasErrors = false;
        
        if (!name) {
            this.setFieldError(form.querySelector('#name'), 'Name is required');
            hasErrors = true;
        }
        
        if (!email) {
            this.setFieldError(form.querySelector('#email'), 'Email is required');
            hasErrors = true;
        } else if (!this.isValidEmail(email)) {
            this.setFieldError(form.querySelector('#email'), 'Please enter a valid email address');
            hasErrors = true;
        }
        
        if (!subject) {
            this.setFieldError(form.querySelector('#subject'), 'Subject is required');
            hasErrors = true;
        }
        
        if (!message) {
            this.setFieldError(form.querySelector('#message'), 'Message is required');
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        // Simulate form submission
        this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
    }

    setFieldError(field, message) {
        if (field) {
            field.style.borderColor = '#ef4444';
            field.classList.add('error');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, type) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message--${type}`;
        messageEl.textContent = message;
        
        // Style the message
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1001;
            max-width: 400px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateX(100%);
        `;

        if (type === 'success') {
            messageEl.style.backgroundColor = '#10b981';
            messageEl.style.color = 'white';
        } else if (type === 'error') {
            messageEl.style.backgroundColor = '#ef4444';
            messageEl.style.color = 'white';
        } else if (type === 'info') {
            messageEl.style.backgroundColor = '#3b82f6';
            messageEl.style.color = 'white';
        }

        // Add to DOM
        document.body.appendChild(messageEl);

        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 4 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 4000);
    }

    setupSmoothScrolling() {
        // Already handled by CSS scroll-behavior: smooth
        // This method can be extended for more complex scroll behaviors
    }

    setupProductHovers() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const viewDetailsBtn = card.querySelector('.btn');
            
            if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productName = card.querySelector('.product-name').textContent;
                    this.showProductDetails(productName);
                });
            }
        });
    }

    showProductDetails(productName) {
        this.showMessage(`${productName} - Coming soon! Visit our store for more information.`, 'info');
    }

    // Add utility methods
    addScrollEffects() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(255, 248, 220, 0.98)';
            } else {
                header.style.backgroundColor = 'rgba(255, 248, 220, 0.95)';
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new SunsetShadesApp();
    
    // Add scroll effects
    app.addScrollEffects();
    
    // Add some interactive enhancements
    addInteractiveEnhancements();
    
    // Store app instance globally
    window.sunsetShadesApp = app;
});

// Additional interactive enhancements
function addInteractiveEnhancements() {
    // Add hover effects to benefit items
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });

    // Add hover effects to value items
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });

    // Add click effects to testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
}

// Add mobile menu styles dynamically
function addMobileMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .main-nav {
                position: fixed;
                top: 80px;
                left: 0;
                right: 0;
                background: rgba(255, 248, 220, 0.98);
                backdrop-filter: blur(10px);
                transform: translateY(-100%);
                transition: transform 0.3s ease;
                z-index: 999;
                border-bottom: 1px solid var(--color-border);
            }
            
            .main-nav.mobile-open {
                transform: translateY(0);
            }
            
            .nav-list {
                flex-direction: column;
                padding: var(--space-20);
                gap: var(--space-16);
            }
            
            .mobile-menu-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize mobile menu styles
addMobileMenuStyles();

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (window.sunsetShadesApp) {
            window.sunsetShadesApp.closeMobileMenu();
        }
    }
});