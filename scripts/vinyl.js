function vinylSketch(p) {
    let zoom = 1, zoomTarget = 1;
    let albumImage, alphaImage, vinyl;
    let w = 150, h = 150;
    let resizedTexture, maskedOverlay;

    p.preload = function() {
        albumImage = p.loadImage(window.globalImageSrc); // Use the global variable for the initial load
        alphaImage = p.loadImage('assets/CoverVinyl.webp');
        vinyl = p.loadImage('assets/Vinyl.png');
    };

    p.setup = function() {
        let canvas = p.createCanvas(300, 500, p.WEBGL);
        canvas.parent('vinyl-container');
        p.noStroke();

        // Initialize overlay and textures
        p.updateOverlay();
    };

    // Function to update overlays and textures based on the current albumImage
    p.updateOverlay = function() {
        let avgBrightness = calculateAverageBrightness(albumImage);

        let overlayImage = p.createGraphics(albumImage.width, albumImage.height);
        overlayImage.background(avgBrightness < 155 ? 255 : 15);

        maskedOverlay = overlayImage.get();
        maskedOverlay.mask(alphaImage);

        resizedTexture = p.createGraphics(768, 768);
        let newHeight = albumImage.width;
        let yOffset = (albumImage.height - newHeight) / 3;
        resizedTexture.image(albumImage, 0, -yOffset, albumImage.width, albumImage.height, 0, 0, 768, 1024);
    };

    function calculateAverageBrightness(img) {
        img.loadPixels();
        let totalBrightness = 0;
        let pixelCount = img.width * img.height;

        for (let i = 0; i < pixelCount; i++) {
            let r = img.pixels[i * 4];
            let g = img.pixels[i * 4 + 1];
            let b = img.pixels[i * 4 + 2];
            totalBrightness += (r + g + b) / 3;
        }
        return totalBrightness / pixelCount;
    }

    p.draw = function() {
        p.clear();
        p.ambientLight(255);

        // Smooth zoom transition
        zoom += (zoomTarget - zoom) * 0.2;
        p.scale(zoom);

        // Subtle left and right movement
        let xMove = p.cos(p.millis() / 5000) * 0.5;
        let yMove = p.sin(p.millis() / 5000) * -0.9;

        p.translate(-8, 0, 0);
        p.rotateY(xMove);
        p.rotateX(yMove / 2);

        let moveX = p.map(zoom, 1, 1.55, 0, 20);
        let moveZ = p.map(zoom, 1, 1.55, 0, 60);

        // Plate
        p.push();
        p.texture(vinyl);
        p.translate(moveX, -moveZ, 0);
        p.rotateZ(p.frameCount / 100);
        p.circle(0, 0, 150);
        p.pop();

        // Label
        p.push();
        p.texture(albumImage);
        p.translate(moveX, -moveZ, 0.5);
        p.rotateZ(p.frameCount / 100);
        p.circle(0, 0, 60);
        p.pop();

        // Box
        p.push();
        p.texture(resizedTexture);
        p.box(w, h, 2);
        p.texture(maskedOverlay);
        p.box(w, h, 2);
        p.pop();
    };

    document.getElementById('vinyl-container').addEventListener('click', function() {
        zoomTarget = zoomTarget === 1 ? 1.55 : 1;
    });

    p.updateImage = function(newImageUrl) {
        albumImage = p.loadImage(newImageUrl, () => {
            p.updateOverlay(); // Update the overlay once the new image is loaded
        });
    };
}

// Instantiate the vinyl sketch
window.p5Instances = window.p5Instances || [];
let p5InstanceVinyl = new p5(vinylSketch);
window.p5Instances.push(p5InstanceVinyl);
