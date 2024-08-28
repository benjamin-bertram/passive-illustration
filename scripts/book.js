function bookSketch(p) {
    let zoom = 1, zoomTarget = 1, pages = [], openBook = false;
    let coverImage, alphaImage, maskedOverlay, w = 150, h = 200;

    p.preload = function() {
        // Load images initially
        coverImage = p.loadImage(window.globalImageSrc);
        alphaImage = p.loadImage('assets/CoverBuch.webp');
    };

    p.setup = function() {
        let canvas = p.createCanvas(300, 500, p.WEBGL);
        canvas.parent('book-container');  // Attach the p5 canvas to the book container
        p.noStroke();
        p.updateOverlay();  // Create initial overlay with the loaded image

        for (let i = 0; i < 20; i++) {
            let offset = p.map(i, 0, 19, 2, 0);
            pages.push({ angle: 0, targetAngle: 0, xOffset: offset, isMoving: false });
        }
    };

    p.updateOverlay = function() {
        // Calculate average brightness
        let avgBrightness = calculateAverageBrightness(coverImage);

        // Create an overlay image (white or black) based on the brightness
        let overlayImage = p.createGraphics(coverImage.width, coverImage.height);
        overlayImage.background(avgBrightness < 155 ? 255 : 15);

        // Create a masked overlay using the alpha image
        maskedOverlay = overlayImage.get();
        maskedOverlay.mask(alphaImage);
    };

    function calculateAverageBrightness(img) {
        img.loadPixels();
        let totalBrightness = 0, pixelCount = img.width * img.height;

        for (let i = 0; i < pixelCount; i++) {
            let r = img.pixels[i * 4], g = img.pixels[i * 4 + 1], b = img.pixels[i * 4 + 2];
            totalBrightness += (r + g + b) / 3;
        }
        return totalBrightness / pixelCount;
    }

    p.draw = function() {
        p.clear();
        p.ambientLight(255);
        zoom += (zoomTarget - zoom) * 0.2;
        p.scale(zoom);

        let xMove = p.cos(p.millis() / 5000) * 0.20;
        let yMove = p.sin(p.millis() / 5000) * -0.50;

        p.rotateY(xMove);
        p.rotateX(yMove / 2);

        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            if (page.isMoving) page.angle += (page.targetAngle - page.angle) * 0.1;

            p.push();
            p.translate(page.xOffset, 0, i);
            p.translate(-w / 2, 0, 0);
            p.rotateY(p.radians(-page.angle));
            p.translate(w / 2, 0, 0);

            if (i == 19) {
                p.texture(coverImage);
                p.plane(w, h);
                p.texture(maskedOverlay);
                p.plane(w, h);
            } else {
                p.fill(155 + i * 5);
            }
            p.plane(w, h);
            p.pop();
        }
    };

    document.getElementById('book-container').addEventListener('click', function() {
        zoomTarget = zoomTarget === 1 ? 1.40 : 1;
        openBook = zoomTarget !== 1;
    
        for (let i = 0; i < pages.length; i++) {
            pages[i].isMoving = true;
            pages[i].targetAngle = openBook ? p.map(i, 0, pages.length - 1, 0, i * 2) : 0;
        }
    });

    p.updateImage = function(newImageUrl) {
        coverImage = p.loadImage(newImageUrl, () => {
            p.updateOverlay(); // Update the overlay once the new image is loaded
        });
    };
}

// Instantiate the book sketch and ensure it's globally accessible
window.p5Instances = window.p5Instances || [];
let p5InstanceBook = new p5(bookSketch);
window.p5Instances.push(p5InstanceBook);