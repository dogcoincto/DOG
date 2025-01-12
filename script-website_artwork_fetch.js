document.addEventListener("DOMContentLoaded", () => {
    const artworkDisplay = document.getElementById("artwork-display");
    fetchArtwork();
});

async function fetchArtwork() {
    try {
        const response = await fetch("https://dogcoincto.s3.amazonaws.com/website_artwork_cache/artwork.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const images = await response.json();
        populateArtwork(images);
    } catch (error) {
        console.error("Error fetching artwork:", error);
        artworkDisplay.innerHTML = "<p>Failed to load artwork. Please try again later.</p>";
    }
}

function populateArtwork(images) {
    artworkDisplay.innerHTML = ""; // Clear current content
    images.forEach((image) => {
        const imageLink = document.createElement("a");
        imageLink.href = `https://twitter.com/intent/tweet?text=Check out this amazing artwork!&url=${encodeURIComponent(image)}`;
        imageLink.target = "_blank";
        imageLink.title = "Post to X";

        const img = document.createElement("img");
        img.src = image;
        img.alt = "DogCoin Artwork";
        img.classList.add("artwork-image");

        imageLink.appendChild(img);
        artworkDisplay.appendChild(imageLink);
    });
}
