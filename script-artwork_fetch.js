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

// Function to generate random hashtags
// - categories: The hashtag categories and their values from the JSON
// - logDisplay: Optional element for logging messages
function getRandomHashtags(categories, logDisplay) {
    const categoryKeys = Object.keys(categories);
    const selectedKeys = categoryKeys.sort(() => 0.5 - Math.random()).slice(0, 2); // Pick up to 2 random categories

    if (logDisplay) addLog(logDisplay, `Selected categories: ${selectedKeys}`);

    const hashtags = selectedKeys
        .map(key => {
            const values = categories[key];
            if (logDisplay) addLog(logDisplay, `Hashtags in category '${key}': ${values}`);
            return values.sort(() => 0.5 - Math.random()).slice(0, 1 + Math.floor(Math.random() * 2)); // Pick 1-3 hashtags
        })
        .flat();

    if (logDisplay) addLog(logDisplay, `Generated hashtags: ${hashtags}`);

    return hashtags;
}

// Function to get a random Twitter post
// - posts: Array of preloaded Twitter posts
// - logDisplay: Optional element for logging messages
function getRandomTwitterPost(posts, logDisplay) {
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    if (logDisplay) addLog(logDisplay, `Selected random Twitter post: ${randomPost}`);
    return randomPost;
}

// Fetch Artwork: Retrieves artwork metadata from the artwork.json file stored in S3
// - artworkDisplay: Element to display artwork
// - logDisplay: Optional element for logging messages
async function fetchArtwork(artworkDisplay, logDisplay) {
    const bucketBaseUrl = "https://dogcoincto.s3.us-east-2.amazonaws.com/";
    const jsonURL = `https://dogcoincto.s3.us-east-2.amazonaws.com/artwork/artwork.json`;
    const hashtagsURL = `./hashtags.json`;
    const twitterPostsURL = `./twitterposts.json`;

    try {
        if (logDisplay) addLog(logDisplay, `Fetching artwork.json from: ${jsonURL}`);
        const [response, hashtagsResponse, twitterPostsResponse] = await Promise.all([
            fetch(jsonURL),
            fetch(hashtagsURL),
            fetch(twitterPostsURL)
        ]);

        if (logDisplay) {
            addLog(logDisplay, `Artwork response status: ${response.status}`);
            addLog(logDisplay, `Hashtags response status: ${hashtagsResponse.status}`);
            addLog(logDisplay, `Twitter posts response status: ${twitterPostsResponse.status}`);
        }

        if (!response.ok || !hashtagsResponse.ok || !twitterPostsResponse.ok) {
            throw new Error(
                `Failed to fetch artwork.json, hashtags.json, or twitterposts.json: HTTP ${response.status}, ${hashtagsResponse.status}, ${twitterPostsResponse.status}`
            );
        }

        const [images, categories, twitterPosts] = await Promise.all([
            response.json(),
            hashtagsResponse.json(),
            twitterPostsResponse.json()
        ]);
        if (logDisplay) addLog(logDisplay, `Artwork data fetched: ${JSON.stringify(images)}`);

        if (!images || images.length === 0) {
            artworkDisplay.innerHTML = "<p>No artwork available.</p>";
            if (logDisplay) addLog(logDisplay, "No artwork data found in JSON.");
            return;
        }

        populateArtwork(images, artworkDisplay, logDisplay, bucketBaseUrl, categories, twitterPosts);
    } catch (error) {
        artworkDisplay.innerHTML = `<p>Error loading artwork: ${error.message}</p>`;
        if (logDisplay) addLog(logDisplay, `Error: ${error.message}`);
        console.error("Fetch error:", error);
    }
}

// Populate Artwork: Dynamically creates HTML elements to display artwork and tweet links
// - images: Array of artwork file keys from artwork.json
// - artworkDisplay: Element to append artwork links and images
// - logDisplay: Optional element for logging messages
// - bucketBaseUrl: Base URL of the S3 bucket
// - categories: Hashtag categories fetched from hashtags.json
// - twitterPosts: Array of preloaded Twitter posts from twitterposts.json
function populateArtwork(images, artworkDisplay, logDisplay, bucketBaseUrl, categories, twitterPosts) {
    artworkDisplay.innerHTML = ""; // Clear previous content
    if (logDisplay) addLog(logDisplay, "Populating artwork...");

    images.forEach((image, index) => {
        if (!image) {
            if (logDisplay) addLog(logDisplay, `Skipping invalid image at index ${index}.`);
            return;
        }

        const filename = image.split('/').pop().replace(/\.[^/.]+$/, '');
        const htmlUrl = `${bucketBaseUrl}artwork/${filename}.html`;
        const hashtags = getRandomHashtags(categories, logDisplay).slice(0, 3);
        const twitterPost = getRandomTwitterPost(twitterPosts, logDisplay);
        const tweetText = encodeURIComponent(`${twitterPost} @dogcoincto ${hashtags.join(' ')}`);

        if (logDisplay) {
            addLog(logDisplay, `Processing image: ${image}`);
            addLog(logDisplay, `Filename extracted: ${filename}`);
            addLog(logDisplay, `Generated HTML URL: ${htmlUrl}`);
            addLog(logDisplay, `Generated tweet text: ${tweetText}`);
        }

        const imageLink = document.createElement("a");
        imageLink.href = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(htmlUrl)}`;
        imageLink.target = "_blank";
        imageLink.title = `Post to X (Image ${index + 1})`;

        const img = document.createElement("img");
        img.src = `${bucketBaseUrl}${image}`;
        img.alt = `Artwork ${index + 1}`;
        img.classList.add("artwork-image");

        imageLink.appendChild(img);
        artworkDisplay.appendChild(imageLink);
        if (logDisplay) {
            addLog(logDisplay, `Added artwork image with link to Twitter: ${imageLink.href}`);
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