// Function to show the popup with dynamic content
function showPopup(heading, subheading, body) {
    const popup = document.getElementById('popup-1');

    // Populate the popup with dynamic content
    document.getElementById('popupHeading').textContent = heading || 'Default Heading';
    document.getElementById('popupSubheading').textContent = subheading || 'Default Subheading';
    document.getElementById('popupBody').textContent = body || 'Default body text goes here.';

    // Show the popup
    popup.classList.add('active');
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById('popup-1');

    // Hide the popup
    popup.classList.remove('active');
}

// Attach event listeners to buttons
document.querySelectorAll('.show-details-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Get data attributes from the clicked button
        const heading = button.getAttribute('data-heading');
        const subheading = button.getAttribute('data-subheading');
        const body = button.getAttribute('data-body');

        // Show the popup with the retrieved data
        showPopup(heading, subheading, body);
    });
});

// Attach event listener to close button
document.getElementById('popupClose').addEventListener('click', closePopup);

// Close popup when clicking outside of it
document.getElementById('popup-1').addEventListener('click', (e) => {
    if (e.target.id === 'popup-1') {
        closePopup();
    }
});
