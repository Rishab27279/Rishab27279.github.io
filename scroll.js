document.addEventListener("DOMContentLoaded", function() {
    // ======================
    // Scroll Animations
    // ======================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        rootMargin: '-100px 0px',
        threshold: 0.15
    });

    document.querySelectorAll('.scroll-animation').forEach(element => {
        observer.observe(element);
    });

    // ======================
    // Popup Functionality
    // ======================
    const popup = document.getElementById('popup-1');
    
    // Handle Show Details buttons
    document.querySelectorAll('[data-popup-trigger]').forEach(button => {
        button.addEventListener('click', () => {
            const title = button.dataset.popupTitle;
            const content = button.dataset.popupContent;
            showPopup(title, content);
        });
    });

    // Handle Close button
    const closeButton = document.getElementById('popupClose');
    if (closeButton) {
        closeButton.addEventListener('click', togglePopup);
    }

    // Handle Background Click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) togglePopup();
    });
});

// ======================
// Popup Functions
// ======================
function showPopup(title, subtitle, content) {
    const popup = document.getElementById('popup-1');
    if (popup) {
        // Dynamically set content
        document.getElementById('popupHeading').textContent = title || 'Default Heading';
        document.getElementById('popupSubheading').textContent = subtitle || 'Default Subheading';
        document.getElementById('popupBody').textContent = content || 'Default body text goes here.';
        
        // Show the popup
        popup.classList.add('active');
    }
}

function togglePopup() {
    const popup = document.getElementById('popup-1');
    if (popup) {
        popup.classList.toggle('active');
        document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : 'auto';
    }
}
document.addEventListener("DOMContentLoaded", function() {
    // Handle Show Details buttons
    document.querySelectorAll('[data-popup-trigger]').forEach(button => {
        button.addEventListener('click', () => {
            const popupId = button.dataset.popupTrigger;
            const popup = document.getElementById(popupId);
            
            if(popup) {
                popup.querySelector('.popup-heading').textContent = button.dataset.heading;
                popup.querySelector('.popup-subheading').textContent = button.dataset.subheading;
                popup.querySelector('.popup-body').textContent = button.dataset.body;
                popup.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Handle close buttons and background click
    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('popup-close') || e.target.classList.contains('popup')) {
            document.querySelectorAll('.popup').forEach(popup => {
                popup.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }
    });
});
