function canvasSketch(p) {
    let zoom = 1, zoomTarget = 1;
    let canvasImage, alphaImage, person;
    let w = 150, h = 200;
    let maskedOverlay;

    p.preload = function() {
        // Load the initial image
        //canvasImage = p.loadImage(window.globalImageSrc);
        alphaImage = p.loadImage('assets/CoverCanvas.webp');
        person = p.loadModel('assets/betrachter.obj', true);
    };

    p.updateImage = function(globalImageObject) {
        // Check if the global image object has finished loading
        if (globalImageObject.complete && globalImageObject.naturalHeight !== 0) {
            canvasImage = p.createImage(globalImageObject.width, globalImageObject.height);
            canvasImage.drawingContext.drawImage(globalImageObject, 0, 0);
    
            avgBrightness = calculateAverageBrightness(canvasImage);
            setupCanvasImage();
            p.redraw(); // Redraw the canvas after updating the image
        } else {
            console.error('Image not fully loaded or invalid.');
        }
    };
    
    // Instead of using p.preload, initialize the p5 sketch in setup with a default image or wait for the first update
    p.setup = function() {
        let canvas = p.createCanvas(300, 500, p.WEBGL);
        canvas.parent('canvas-container');
        p.noStroke();
        
        canvasImage = p.createImage(globalImageObject.width, globalImageObject.height);
        canvasImage.drawingContext.drawImage(globalImageObject, 0, 0);
    };

    // Function to set up the canvas with the current image
    function setupCanvasImage() {
        let avgBrightness = calculateAverageBrightness(canvasImage);

        let overlayImage = p.createGraphics(canvasImage.width, canvasImage.height);
        overlayImage.background(avgBrightness < 155 ? 255 : 15);

        maskedOverlay = overlayImage.get();
        maskedOverlay.mask(alphaImage);
    }

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
        p.ambientLight(155, 155, 155);
        p.directionalLight(155, 155, 155, 0, 0, -1);

        zoom += (zoomTarget - zoom) * 0.2;
        p.scale(zoom);

        let xMove = p.cos(p.millis() / 5000) * 0.20;
        let yMove = p.sin(p.millis() / 5000) * -0.50;

        p.rotateY(xMove);
        p.rotateX(yMove / 2);

        p.push();
        p.translate(w * -0.475, h * 0.6, 0);
        p.plane(w * 0.1, h * 0.05);
        p.pop();

        p.push();
        p.translate(0, 0, -5);
        p.box(w * 1.05, h * 1.05, 10);
        p.pop();

        p.push();
        p.texture(canvasImage);
        p.box(w, h, 1);
        p.texture(alphaImage);
        p.box(w, h, 1);
        p.pop();

        let c = p.color('white');
        let personOpacity = p.map(zoom, 1, 1.65, 255, 0);
        c.setAlpha(personOpacity);

        p.push();
        p.rotateZ(p.PI);
        p.rotateY(p.PI);
        p.translate(50, -100, -60);
        p.fill(c);
        p.model(person);
        p.pop();
    };

    document.getElementById('canvas-container').addEventListener('click', function() {
        zoomTarget = zoomTarget === 1 ? 1.65 : 1;
    });
}

// Instantiate the canvas sketch and ensure it's globally accessible
window.p5Instances = window.p5Instances || [];
let p5InstanceCanvas = new p5(canvasSketch);
window.p5Instances.push(p5InstanceCanvas);