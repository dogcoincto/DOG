// Main Function: Initialize artwork loading on DOMContentLoaded
// Sets up the display area and calls fetchArtwork to load artwork data

document.addEventListener("DOMContentLoaded", () => {
    const artworkDisplay = document.getElementById("artwork-display");
    const logDisplay = document.getElementById("log-display") || null; // Allow logDisplay to be null

    if (logDisplay) {
        addLog(logDisplay, "Initializing artwork loading...");
    }
    artworkDisplay.innerHTML = "<p>Loading artwork...</p>";
    fetchArtwork(artworkDisplay, logDisplay);
});

// Fetch Artwork: Retrieves artwork metadata from the artwork.json file stored in S3
// - artworkDisplay: Element to display artwork
// - logDisplay: Optional element for logging messages
async function fetchArtwork(artworkDisplay, logDisplay) {
    const bucketBaseUrl = "https://dogcoincto.s3.us-east-2.amazonaws.com/";
    const jsonURL = `${bucketBaseUrl}artwork/artwork.json`;

    try {
        if (logDisplay) addLog(logDisplay, `Fetching artwork.json from: ${jsonURL}`);
        const response = await fetch(jsonURL);

        if (logDisplay) {
            addLog(logDisplay, `Artwork response status: ${response.status}`);
        }

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

        populateArtwork(images, artworkDisplay, logDisplay, bucketBaseUrl);
    } catch (error) {
        artworkDisplay.innerHTML = `<p>Error loading artwork: ${error.message}</p>`;
        if (logDisplay) addLog(logDisplay, `Error: ${error.message}`);
        console.error("Fetch error:", error);
    }
}

// Populate Artwork: Dynamically creates HTML elements to display artwork
// - images: Array of artwork file keys from artwork.json
// - artworkDisplay: Element to append artwork images
// - logDisplay: Optional element for logging messages
// - bucketBaseUrl: Base URL of the S3 bucket
function populateArtwork(images, artworkDisplay, logDisplay, bucketBaseUrl) {
    artworkDisplay.innerHTML = ""; // Clear previous content
    if (logDisplay) addLog(logDisplay, "Populating artwork...");

    images.forEach((image, index) => {
        if (!image) {
            if (logDisplay) addLog(logDisplay, `Skipping invalid image at index ${index}.`);
            return;
        }

        const img = document.createElement("img");
        img.src = `${bucketBaseUrl}${image}`;
        img.alt = `Artwork ${index + 1}`;
        img.classList.add("artwork-image");

        artworkDisplay.appendChild(img);
        if (logDisplay) {
            addLog(logDisplay, `Added artwork image: ${img.src}`);
        }
    });

    if (logDisplay) addLog(logDisplay, "Artwork successfully populated.");
}

// Add Log: Appends log messages to a log display element
// - logDisplay: Element to append log messages to
// - message: Message to log
function addLog(logDisplay, message) {
    if (!logDisplay) return; // Skip logging if logDisplay is null
    const logEntry = document.createElement("div");
    logEntry.textContent = message;
    logDisplay.appendChild(logEntry);
}
