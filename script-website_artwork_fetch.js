document.addEventListener("DOMContentLoaded", () => {
    const artworkDisplay = document.getElementById("artwork-display");
    const logDisplay = document.getElementById("log-display");

    addLog(logDisplay, "Initializing artwork loading...");
    artworkDisplay.innerHTML = "<p>Loading artwork...</p>";
    fetchArtwork(artworkDisplay, logDisplay);
});

async function fetchArtwork(artworkDisplay, logDisplay) {
    const jsonURL = "https://dogcoincto.s3.us-east-2.amazonaws.com/artwork/artwork.json";

    try {
        addLog(logDisplay, `Fetching artwork.json from: ${jsonURL}`);
        const response = await fetch(jsonURL);
        addLog(logDisplay, `Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch artwork.json: HTTP ${response.status}`);
        }

        const images = await response.json();
        addLog(logDisplay, `Artwork data fetched: ${JSON.stringify(images)}`);

        if (!images || images.length === 0) {
            artworkDisplay.innerHTML = "<p>No artwork available.</p>";
            addLog(logDisplay, "No artwork data found in JSON.");
            return;
        }

        populateArtwork(images, artworkDisplay, logDisplay);
    } catch (error) {
        artworkDisplay.innerHTML = `<p>Error loading artwork: ${error.message}</p>`;
        addLog(logDisplay, `Error: ${error.message}`);
        console.error("Fetch error:", error);
    }
}

function populateArtwork(images, artworkDisplay, logDisplay) {
    artworkDisplay.innerHTML = ""; // Clear previous content
    addLog(logDisplay, "Populating artwork...");

    images.forEach((image, index) => {
        if (!image) {
            addLog(logDisplay, `Skipping invalid image at index ${index}.`);
            return;
        }

        const imageUrl = `https://dogcoincto.s3.us-east-2.amazonaws.com/${image}`;
        const tweetText = encodeURIComponent("Check out this artwork! #DOGCoin #CryptoMeme");

        const imageLink = document.createElement("a");
        imageLink.href = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(imageUrl)}`;
        imageLink.target = "_blank";
        imageLink.title = `Post to X (Image ${index + 1})`;

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `Artwork ${index + 1}`;
        img.classList.add("artwork-image");

        imageLink.appendChild(img);
        artworkDisplay.appendChild(imageLink);
        addLog(logDisplay, `Added artwork image: ${imageUrl}`);
    });

    addLog(logDisplay, "Artwork successfully populated.");
}

function addLog(logDisplay, message) {
    const logEntry = document.createElement("div");
    logEntry.textContent = message;
    logDisplay.appendChild(logEntry);
}
