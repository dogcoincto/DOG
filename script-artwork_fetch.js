// Initialize Runtime
document.addEventListener("DOMContentLoaded", () => {
    const artworkDisplay = document.getElementById("artwork-display");
    const logDisplay = document.getElementById("log-display") || null; // Allow logDisplay to be null

    if (logDisplay) {
        addLog(logDisplay, "Initializing artwork loading...");
    }
    artworkDisplay.innerHTML = "<p>Loading artwork...</p>";
    fetchArtwork(artworkDisplay, logDisplay);
});

// Support Function: Fetch Artwork from S3
async function fetchArtwork(artworkDisplay, logDisplay) {
    const jsonURL = "https://artwork.dogcoincto.io/artwork/artwork.json";

    try {
        if (logDisplay) addLog(logDisplay, `Fetching artwork.json from: ${jsonURL}`);
        const response = await fetch(jsonURL);
        if (logDisplay) addLog(logDisplay, `Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch artwork.json: HTTP ${response.status}`);
        }

        const images = await response.json();
        if (logDisplay) addLog(logDisplay, `Artwork data fetched: ${JSON.stringify(images)}`);

        if (!images || images.length === 0) {
            artworkDisplay.innerHTML = "<p>No artwork available.</p>";
            if (logDisplay) addLog(logDisplay, "No artwork data found in JSON.");
            return;
        }

        populateArtwork(images, artworkDisplay, logDisplay);
    } catch (error) {
        artworkDisplay.innerHTML = `<p>Error loading artwork: ${error.message}</p>`;
        if (logDisplay) addLog(logDisplay, `Error: ${error.message}`);
        console.error("Fetch error:", error);
    }
}

// Support Function: Populate Dynamic Images
function populateArtwork(images, artworkDisplay, logDisplay) {
    artworkDisplay.innerHTML = ""; // Clear previous content
    if (logDisplay) addLog(logDisplay, "Populating artwork...");

    const maxImages = images.length; // Number of images from artwork.json

    images.forEach((_, index) => {
        const imageNumber = (index % maxImages) + 1; // Ensures the image number cycles through
        const imageUrl = `https://artwork.dogcoincto.io/artwork/dogart${imageNumber}.jpg`;
        const shareUrl = `https://dogcoincto.io/dogart${imageNumber}.html`; // Matches static page URL
        const tweetText = encodeURIComponent("Check out this artwork! #DOGCoin #CryptoMeme");

        const imageLink = document.createElement("a");
        imageLink.href = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;
        imageLink.target = "_blank";
        imageLink.title = `Post to X (Image ${imageNumber})`;

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `Artwork ${imageNumber}`;
        img.classList.add("artwork-image");

        imageLink.appendChild(img);
        artworkDisplay.appendChild(imageLink);
        if (logDisplay) addLog(logDisplay, `Added artwork image: ${imageUrl}`);
    });

    if (logDisplay) addLog(logDisplay, "Artwork successfully populated.");
}

// Support Function: Add Logs
function addLog(logDisplay, message) {
    if (!logDisplay) return; // Skip logging if logDisplay is null
    const logEntry = document.createElement("div");
    logEntry.textContent = message;
    logDisplay.appendChild(logEntry);
}
