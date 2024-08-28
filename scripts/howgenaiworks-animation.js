function howgenaiworksAnimation(p) {
    let howitworksImage;
    let w, h; // Default size
    let isImageLoaded = false; // To track if the new image is fully loaded

    p.setup = function() {
        const columnWidth = document.querySelector('.column-2').clientWidth; // Get width of the first column
        const columnHeight = document.querySelector('.column-2').clientHeight; // Get height of the first column

        let canvas = p.createCanvas(columnWidth, columnHeight, p.WEBGL);
        canvas.parent('how-genai-works-animation'); // Correct ID used here
        p.noStroke();

        window.addEventListener('resize', resizeCanvasToColumn);
    };

    p.draw = function() {
        p.clear(); // Clear the background for every draw call

        let xMove = p.cos(p.millis() / 5000) * 0.125;
        let yMove = p.sin(p.millis() / 5000) * -0.25;

        p.rotateY(xMove);
        p.rotateX(yMove / 2);

        if (isImageLoaded && howitworksImage) {
            p.push();
            p.texture(howitworksImage);
            p.plane(w, h);
            p.pop();
        }
    };

    p.updateImage = function(newImageUrl) {
        isImageLoaded = false; // Reset loading state
        p.loadImage(newImageUrl, (img) => {
            howitworksImage = img; // Set the new image
            updateBoxSize(img); // Adjust size
            isImageLoaded = true; // Mark as loaded
            console.log(`Image updated to ${newImageUrl}`);
        }, () => {
            console.error(`Failed to load image: ${newImageUrl}`);
        });
    };

    function updateBoxSize(img) {
        const maxSize = 600;
        if (img.width > img.height) {
            w = maxSize;
            h = (img.height / img.width) * maxSize;
        } else {
            h = maxSize;
            w = (img.width / img.height) * maxSize;
        }
    }

    function resizeCanvasToColumn() {
        const columnElement = document.querySelector('.column-1');
        const columnWidth = columnElement.clientWidth;
        const columnHeight = columnElement.clientHeight;

        p.resizeCanvas(columnWidth, columnHeight);
    }
}

// Remove any existing p5 instance
if (window.p5InstanceHowGenAiWorks) {
    window.p5InstanceHowGenAiWorks.remove();
}

// Create a new p5 instance
window.p5InstanceHowGenAiWorks = new p5(howgenaiworksAnimation);
