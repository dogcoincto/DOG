const fs = require('fs');
const path = require('path');

// Path to the artwork JSON file and output directory
const artworkJsonPath = './artwork.json';
const outputDir = './public/artwork-pages';

const baseUrl = 'https://dogcoincto.s3.us-east-2.amazonaws.com';

function generateHtml(image, outputPath) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:image" content="${baseUrl}/${image}">
    <meta property="og:title" content="Check out this DOG Coin artwork!">
    <meta property="og:description" content="Amazing DOG Coin artwork. Share it with the world!">
    <meta property="og:type" content="website">
    <title>DOG Coin Artwork</title>
</head>
<body>
    <p>Redirecting...</p>
</body>
</html>`;
    fs.writeFileSync(outputPath, htmlContent, 'utf8');
}

function generatePages() {
    const images = JSON.parse(fs.readFileSync(artworkJsonPath, 'utf8'));

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    images.forEach((image, index) => {
        const outputPath = path.join(outputDir, `image-${index + 1}.html`);
        generateHtml(image, outputPath);
        console.log(`Generated page for ${image}`);
    });
}

generatePages();
