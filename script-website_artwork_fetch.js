document.addEventListener("DOMContentLoaded", () => {
    const artworkDisplay = document.getElementById("artwork-display");
    fetchArtwork(artworkDisplay);
});

document.addEventListener("DOMContentLoaded", () => {
    const artworkDisplay = document.getElementById("artwork-display");
    const testImages = [
        "https://dogcoincto.s3.amazonaws.com/website_artwork_cache/image-1736679308703-3.jpeg",
        "https://dogcoincto.s3.amazonaws.com/website_artwork_cache/image-1736679126637-0.svg"
    ];
    populateArtwork(testImages, artworkDisplay);
});

/*
async function fetchArtwork(artworkDisplay) {
    try {
        const response = await fetch("https://dogcoincto.s3.amazonaws.com/website_artwork_cache/artwork.json");
        console.log("Fetch response:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const images = await response.json();
        console.log("Fetched images:", images); // Log images array
        populateArtwork(images, artworkDisplay);
    } catch (error) {
        console.error("Error fetching artwork:", error);
        artworkDisplay.innerHTML = "<p>Failed to load artwork. Please try again later.</p>";
    }
}
*/

function populateArtwork(images, artworkDisplay) {
    console.log("Populating artwork with images:", images);
    artworkDisplay.innerHTML = ""; // Clear current content
    images.forEach((image) => {
        console.log("Adding image:", image); // Log each image URL
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
    console.log("Artwork population complete.");
}
