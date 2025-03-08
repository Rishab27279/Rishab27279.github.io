
document.addEventListener('DOMContentLoaded', function() {
    // Scroll Animation
    function checkScroll() {
        const elements = document.querySelectorAll('.scroll-animation');
        const windowHeight = window.innerHeight;

        elements.forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            // Add stagger effect to skills grid
            if (element.closest('.skills-grid')) {
                element.style.setProperty('--i', index);
            }
            if (elementPosition < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }

    // Initial check on page load
    checkScroll();

    // Check on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                checkScroll();
                scrollTimeout = null;
            }, 50);
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Portfolio Filtering System
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.classList.add('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                }
            });
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically handle the form submission
            // For now, just log the form data
            const formData = new FormData(contactForm);
            console.log('Form submitted:', Object.fromEntries(formData));
            // You can add your form submission logic here
            contactForm.reset();
            alert('Thank you for your message! I will get back to you soon.');
        });
    }

    // Popup System
    const detailButtons = document.querySelectorAll('.show-details-btn');

    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const popupId = this.getAttribute('data-popup-trigger');
            const popup = document.getElementById(popupId);

            if (popup) {
                // Fill the popup with the data from the button
                const heading = this.getAttribute('data-heading');
                const subheading = this.getAttribute('data-subheading');
                const body = this.getAttribute('data-body');
                const github = this.getAttribute('data-github');

                popup.querySelector('.popup-heading').textContent = heading;
                popup.querySelector('.popup-subheading').textContent = subheading;
                popup.querySelector('.popup-body').textContent = body;

                if (github) {
                    const githubLink = popup.querySelector('.popup-github');
                    githubLink.href = github;
                    githubLink.style.display = 'inline-flex';
                } else {
                    popup.querySelector('.popup-github').style.display = 'none';
                }

                // Show the popup
                popup.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close popup when close button is clicked
    document.querySelectorAll('.popup-close').forEach(button => {
        button.addEventListener('click', function() {
            const popup = this.closest('.popup');
            popup.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close popup when clicking outside content
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Theme toggle functionality
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        console.log('Initializing theme, saved theme:', savedTheme);
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            const icon = document.querySelector('#themeToggle i');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            console.log('Applied light theme');
        }
    }

    // Initialize theme on page load
    initializeTheme();

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const icon = this.querySelector('i');
            const isLightTheme = document.body.classList.contains('light-theme');
            console.log('Theme toggled, is light theme:', isLightTheme);

            if (isLightTheme) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            }
            console.log('Theme saved to localStorage:', localStorage.getItem('theme'));
        });
    } else {
        console.warn('Theme toggle button not found');
    }
});
