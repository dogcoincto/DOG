

document.addEventListener("DOMContentLoaded", () => {
    const artworkDisplay = document.getElementById("artwork-display");
    artworkDisplay.innerHTML = "<p>Initializing artwork display...</p>"; // Debug message
    fetchArtwork(artworkDisplay);
});

// Full populate artwork function
function populateArtwork(images, artworkDisplay) {
    artworkDisplay.innerHTML = ""; // Clear debug messages and content
    let contentAdded = false;

    images.forEach((image, index) => {
        if (!image) return; // Skip invalid URLs

        const imageLink = document.createElement("a");
        imageLink.href = `https://twitter.com/intent/tweet?text=Check out this amazing artwork!&url=${encodeURIComponent(image)}`;
        imageLink.target = "_blank";
        imageLink.title = `Post to X (Image ${index + 1})`;

        const img = document.createElement("img");
        img.src = image;
        img.alt = `Artwork ${index + 1}`;
        img.classList.add("artwork-image");

        imageLink.appendChild(img);
        artworkDisplay.appendChild(imageLink);
        contentAdded = true;
    });

    if (!contentAdded) {
        console.error("Failed to populate artwork: No valid images available.");
    } else {
        console.log("Artwork successfully loaded!");
    }
}

/*
// Test: Load Static Images from s3
document.addEventListener("DOMContentLoaded", () => {
    const artworkDisplay = document.getElementById("artwork-display");
    const testImages = [
        "https://dogcoincto.s3.amazonaws.com/website_artwork_cache/image-1736679308703-3.jpeg",
        "https://dogcoincto.s3.amazonaws.com/website_artwork_cache/image-1736679126637-0.svg"
    ];
    populateArtwork(testImages, artworkDisplay);
});



// Test: Basic Fetch
document.addEventListener("DOMContentLoaded", async () => {
    const artworkDisplay = document.getElementById("artwork-display");
    try {
        artworkDisplay.innerHTML = "<p>Testing fetch...</p>";
        const response = await fetch("https://dogcoincto.s3.amazonaws.com/website_artwork_cache/artwork.json");
        artworkDisplay.innerHTML = `<p>Fetch status: ${response.status}</p>`;
        if (!response.ok) throw new Error("Failed to fetch artwork.json");

        const data = await response.json();
        artworkDisplay.innerHTML = `<p>Fetched ${data.length} images successfully!</p>`;
    } catch (error) {
        artworkDisplay.innerHTML = `<p>Test failed: ${error.message}</p>`;
    }
});



// Test: Simple Fetch Test with onscreen messages
async function fetchArtwork(artworkDisplay) {
    try {
        artworkDisplay.innerHTML = "<p>Attempting to fetch artwork.json...</p>";
        const response = await fetch("https://dogcoincto.s3.amazonaws.com/website_artwork_cache/artwork.json");
        if (!response.ok) {
            artworkDisplay.innerHTML = `<p>Error: Fetch failed with HTTP status ${response.status}.</p>`;
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        artworkDisplay.innerHTML = "<p>Successfully fetched artwork.json. Parsing data...</p>";
        const images = await response.json();

        if (!images || images.length === 0) {
            artworkDisplay.innerHTML = "<p>No artwork found in the data.</p>";
            return;
        }

        artworkDisplay.innerHTML = "<p>Populating artwork...</p>";
        populateArtwork(images, artworkDisplay);
    } catch (error) {
        artworkDisplay.innerHTML = `<p>Error loading artwork: ${error.message}</p>`;
    }
}
*/


// Full Fetch Function
async function fetchArtwork(artworkDisplay) {
    try {
        artworkDisplay.innerHTML = "<p>Fetching artwork data...</p>"; // Debug message
        const response = await fetch("https://dogcoincto.s3.amazonaws.com/website_artwork_cache/artwork.json");

        if (!response.ok) {
            artworkDisplay.innerHTML = `<p>Error: Failed to fetch artwork. HTTP Status: ${response.status}</p>`;
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        artworkDisplay.innerHTML = "<p>Parsing artwork data...</p>"; // Debug message
        const images = await response.json();

        if (!images || images.length === 0) {
            artworkDisplay.innerHTML = "<p>No artwork found in the data.</p>";
            return;
        }

        artworkDisplay.innerHTML = "<p>Populating artwork...</p>"; // Debug message
        populateArtwork(images, artworkDisplay);
    } catch (error) {
        artworkDisplay.innerHTML = `<p>Error loading artwork: ${error.message}</p>`;
    }
}

