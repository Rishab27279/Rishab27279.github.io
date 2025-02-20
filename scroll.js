document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        rootMargin: '-100px 0px', // Start animation 100px before element enters view
        threshold: 0.15 // 15% of element visible
    });

    // Observe all scroll-animation elements
    document.querySelectorAll('.scroll-animation').forEach(element => {
        observer.observe(element);
    });
});
function showPopup(title, content) {
    const popup = document.getElementById('popup-1');
    if (popup) {
        document.getElementById('popupTitle').textContent = title;
        document.getElementById('popupContent').textContent = content;
        popup.classList.add('active');
    }
}

function togglePopup() {
    const popup = document.getElementById('popup-1');
    if (popup) {
        popup.classList.toggle('active');
    }
}
