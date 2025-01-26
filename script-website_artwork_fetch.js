document.addEventListener("DOMContentLoaded", () => {
    const artworkDisplay = document.getElementById("artwork-display");
    artworkDisplay.innerHTML = "<p>Loading artwork...</p>";
    fetchArtwork(artworkDisplay);
});

async function fetchArtwork(artworkDisplay) {
    try {
        const response = await fetch("https://dogcoincto.s3.us-east-2.amazonaws.com/artwork/artwork.json");
        if (!response.ok) {
            throw new Error(`Failed to fetch artwork.json: ${response.status}`);
        }

        const images = await response.json();
        if (!images || images.length === 0) {
            artworkDisplay.innerHTML = "<p>No artwork available.</p>";
            return;
        }

        populateArtwork(images, artworkDisplay);
    } catch (error) {
        artworkDisplay.innerHTML = `<p>Error loading artwork: ${error.message}</p>`;
        console.error("Artwork fetch error:", error);
    }
}

function populateArtwork(images, artworkDisplay) {
    artworkDisplay.innerHTML = ""; // Clear previous content

    images.forEach((image, index) => {
        if (!image) return;

        const imageLink = document.createElement("a");
        const imageUrl = `https://dogcoincto.s3.us-east-2.amazonaws.com/${image}`;
        const tweetText = encodeURIComponent(`Check out this artwork! #DOGCoin #CryptoMeme`);

        imageLink.href = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(imageUrl)}`;
        imageLink.target = "_blank";
        imageLink.title = `Post to X (Image ${index + 1})`;

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `Artwork ${index + 1}`;
        img.classList.add("artwork-image");

        imageLink.appendChild(img);
        artworkDisplay.appendChild(imageLink);
    });

    console.log("Artwork successfully loaded and displayed.");
}
