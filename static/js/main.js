
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    initializeTheme();
    
    // Scroll Animation
    initializeScrollAnimation();
    
    // Popup Functionality
    initializePopups();
});

// Theme Toggle Functionality
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    
    console.log("Initializing theme, saved theme:", savedTheme);
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    themeToggle.addEventListener('click', function() {
        const isLightTheme = document.body.classList.toggle('light-theme');
        const icon = document.querySelector('#themeToggle i');
        
        console.log("Theme toggled, is light theme:", isLightTheme);
        
        if (isLightTheme) {
            localStorage.setItem('theme', 'light');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        } else {
            localStorage.setItem('theme', 'dark');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
        
        console.log("Theme saved to localStorage:", localStorage.getItem('theme'));
    });
}

// Scroll Animation
function initializeScrollAnimation() {
    const scrollElements = document.querySelectorAll('.scroll-animation');
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('show');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('show');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    // Initialize elements that are in view on load
    setTimeout(handleScrollAnimation, 100);
    
    // Listen for scroll events
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
}

// Popup Functionality
function initializePopups() {
    const detailButtons = document.querySelectorAll('.show-details-btn');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const popupId = this.getAttribute('data-popup-trigger');
            const popup = document.getElementById(popupId);
            
            if (popup) {
                // Fill popup with button data attributes
                const heading = this.getAttribute('data-heading');
                const subheading = this.getAttribute('data-subheading');
                const body = this.getAttribute('data-body');
                const github = this.getAttribute('data-github');
                
                popup.querySelector('.popup-heading').textContent = heading;
                popup.querySelector('.popup-subheading').textContent = subheading;
                
                // Use innerHTML instead of textContent to render HTML
                popup.querySelector('.popup-body').innerHTML = body;
                
                const githubLink = popup.querySelector('.popup-github');
                if (githubLink && github) {
                    githubLink.href = github;
                    githubLink.style.display = github && github !== '#' ? 'inline-flex' : 'none';
                }
                
                // Show popup
                popup.classList.add('active');
                
                // Prevent body scrolling when popup is open
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close popup functionality
    const closeButtons = document.querySelectorAll('.popup-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const popup = this.closest('.popup');
            if (popup) {
                popup.classList.remove('active');
                // Restore body scrolling
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close popup when clicking outside content
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                // Restore body scrolling
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activePopup = document.querySelector('.popup.active');
            if (activePopup) {
                activePopup.classList.remove('active');
                // Restore body scrolling
                document.body.style.overflow = '';
            }
        }
    });
}

// Initialize popups when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePopups);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});


//--------------------------------------- Type Animation-------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.querySelector('.typing');
    const phrases = ["Data Science", "Deep Learning", "Computer Vision", "Generative AI", "AI/ML"];
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // milliseconds per character
    let pauseEnd = 1500; // pause at the end of phrase
    let pauseStart = 500; // pause before typing new phrase

    function typeEffect() {
        const currentPhrase = phrases[currentPhraseIndex];
        
        if (isDeleting) {
            // Deleting text
            typingElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            // Typing text
            typingElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100; // Normal speed when typing
        }
        
        // If completed typing the current phrase
        if (!isDeleting && currentCharIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = pauseEnd; // Pause at the end
        } 
        // If completed deleting the current phrase
        else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            typingSpeed = pauseStart; // Pause before typing new phrase
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start the typing animation
    typeEffect();
});


//-------------------------------------------------------------------------


