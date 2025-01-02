document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.dog-character-container');
    const images = Array.from(document.querySelectorAll('.dog-character'));

    const shuffleImages = () => {
        // Shuffle the images array
        const shuffledImages = images.sort(() => Math.random() - 0.5);

        // Clear the container
        container.innerHTML = '';

        // Append the shuffled images
        shuffledImages.forEach((image) => {
            container.appendChild(image);
        });
    };

    const updateVisibility = () => {
        const containerRect = container.getBoundingClientRect();

        images.forEach((image) => {
            const imageRect = image.getBoundingClientRect();

            // Check if the image is fully within the container
            if (
                imageRect.left >= containerRect.left &&
                imageRect.right <= containerRect.right
            ) {
                image.style.display = 'block'; // Show the image
            } else {
                image.style.display = 'none'; // Hide the image
            }
        });

        // Recalculate spacing to recenter remaining images
        container.style.justifyContent = 'center';
    };

    // Shuffle images and update visibility on page load
    shuffleImages();
    updateVisibility();

    // Update visibility on resize
    window.addEventListener('resize', updateVisibility);
});
