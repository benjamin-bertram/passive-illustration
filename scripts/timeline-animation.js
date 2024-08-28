function timelineAnimation(p) {
    let timelineImage;
    let w, h; // Default size
    let isImageLoaded = false; // To track if the new image is fully loaded

    p.setup = function() {
        const columnWidth = document.querySelector('.column-1').clientWidth; // Get width of the first column
        const columnHeight = document.querySelector('.column-1').clientHeight; // Get height of the first column

        let canvas = p.createCanvas(columnWidth, columnHeight, p.WEBGL);
        canvas.parent('timeline-animation');
        p.noStroke();

        window.addEventListener('resize', resizeCanvasToColumn);

    };

    p.draw = function() {
        //p.background(233);
        p.clear();
        // Subtle left and right movement for animation
        let xMove = p.cos(p.millis() / 5000) * 0.125;
        let yMove = p.sin(p.millis() / 5000) * -0.25;

        p.rotateY(xMove);
        p.rotateX(yMove / 2);

        // Draw the image only if it is fully loaded
        if (isImageLoaded && timelineImage) {
            p.push();
            p.texture(timelineImage);
            p.plane(w, h);
            p.pop();
        }
    };

    // Function to update the image dynamically
    p.updateImage = function(newImageUrl) {
        if (newImageUrl.includes('timeline')) {
            isImageLoaded = false; // Set to false before loading new image
            p.loadImage(newImageUrl, (img) => {
                timelineImage = img; // Update timelineImage only when the new image is successfully loaded
                updateBoxSize(img); // Update box size based on the loaded image
                isImageLoaded = true; // Set to true after the image has been loaded
                console.log(`Image updated to ${newImageUrl}`);
            }, () => {
                console.error(`Failed to load image: ${newImageUrl}`); // Handle error in loading
            });
        }
    };

    function updateBoxSize(img) {
        const maxSize = 600; // Desired size for the longest side
    
        if (img.width > img.height) {
            // Image is wider than it is tall
            w = maxSize;  // Set width to 400
            h = (img.height / img.width) * maxSize; // Scale height proportionally
        } else {
            // Image is taller than it is wide or a square
            h = maxSize;  // Set height to 400
            w = (img.width / img.height) * maxSize; // Scale width proportionally
        }
    }

    // Function to resize the canvas based on the first column's size
    function resizeCanvasToColumn() {
        const columnElement = document.querySelector('.column-1');
        const columnWidth = columnElement.clientWidth;
        const columnHeight = columnElement.clientHeight;

        p.resizeCanvas(columnWidth, columnHeight);
    }
}

// Instantiate the p5 sketch for the timeline animation
window.p5Instances = window.p5Instances || [];
let p5InstanceTimeline = new p5(timelineAnimation);
window.p5Instances.push(p5InstanceTimeline);

// Expose the update function globally
window.p5InstanceTimeline = p5InstanceTimeline;
