let scene, camera, renderer, grainTexture;
const tiles = [];
const textureLoader = new THREE.TextureLoader();

function init() {
    scene = new THREE.Scene();
    // Create fog with a specified color, near distance, and far distance
    // The color should typically match the background color of your scene
    const fogColor = 0xffffff; // Light gray fog color
    const near = 2;  // The distance at which the fog starts
    const far = 20;  // The distance at which the fog becomes fully opaque
    scene.fog = new THREE.Fog(fogColor, near, far);
    scene.background = new THREE.Color(fogColor);

    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;

    // Setup renderer with antialiasing
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    document.getElementById('threejs-container').appendChild(renderer.domElement);

    //Add ambient light
    const ambientLight = new THREE.AmbientLight(0x888888, 0.5); // Soft white light
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5 , 10, 7).normalize();
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 2048; // default
    directionalLight.shadow.mapSize.height = 2048; // default
    directionalLight.shadow.camera.near = 0; // default
    directionalLight.shadow.camera.far = 500; // default

    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
}

function createTile(x, y, z, textureUrl) {

/*     // Safe Zone Definition (example: circular)
    const safeZoneRadius = 2;  
    const centerX = 0;
    const centerY = 0;

    // Ensure tile position is outside the safe zone
    while (true) { // Loop until a valid position is found
        x = Math.random() * 10 - 5 ; // Generate random x within scene bounds
        y = Math.random() * 10 - 5; // Generate random y within scene bounds

        const distanceFromCenter = Math.sqrt((x - centerX) ** 3 + (y - centerY) ** 3);
        if (distanceFromCenter >= safeZoneRadius) { 
            break; // Position is outside the safe zone
        }
    } */

    textureLoader.load(textureUrl, (texture) => {

        // Set texture repeat if necessary
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        // Translate the texture (offset along U and V axes)
        texture.offset.set(0.5, 0.5); // Move the texture 50% to the right and 50% up

        const extrudeSettings = {
            steps: 5,
            depth: 0.01,
            bevelEnabled: true,
            bevelThickness: 0.005,
            bevelSize: 0.001,
            bevelSegments: 2,
        };

        // Define a rectangular shape equivalent to a plane with width 1.5 and height 2.3
        const width = 1.5;
        const height = 2.0;

        const shape = new THREE.Shape();
        shape.moveTo(-width / 4, -height / 4); // Start at the bottom left corner
        shape.lineTo(width / 4, -height / 4);  // Bottom right
        shape.lineTo(width / 4, height / 4);   // Top right
        shape.lineTo(-width / 4, height / 4);  // Top left
        shape.lineTo(-width / 4, -height / 4); // Close the shape back to the starting point

        //const plane = new THREE.PlaneGeometry( 1.5, 2.3 );
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // Combine the grain texture with the image texture
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.4,
            roughness: 0.5,
            fog: true,
        });

        const tile = new THREE.Mesh(geometry, material);
        tile.position.set(x, y, z);
        tile.userData.originalPosition = { x: x, y: y, z: z };

        scene.add(tile);
        tiles.push(tile);
    });
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001; // Get the current time in seconds

    tiles.forEach((tile, index) => {
        // Apply a slight back-and-forth movement along the x-axis and y-axis
        const frequency = 0.005; // The speed of the oscillation
        const radius = 1; // Adjust the radius as needed

        const angle = time * 0.05 + index; // Angle for each tile, changes over time
        tile.position.x = tile.userData.originalPosition.x + Math.cos(angle) * radius;
        tile.position.y = tile.userData.originalPosition.y + Math.sin(angle) * radius;
        tile.position.z = tile.userData.originalPosition.y + Math.sin(angle) * radius;

        // Alternatively, you can add subtle rotation if desired
        tile.rotation.x += Math.sin(time * frequency + index) * 0.001;
        tile.rotation.y += Math.cos(time * frequency + index) * 0.001;
    });

    renderer.render(scene, camera);
}

// Fetch image URLs dynamically from a file or server
fetch('public/experiments.json')
    .then(response => response.json())
    .then(data => {
        // Iterate through each experiment and extract the image URL
        data.experiments.forEach((experiment, index) => {
            const url = experiment.image;  // Get the image URL
            const x = Math.random() * 10 - 5;
            const y = Math.random() * 10 - 5;
            const z = Math.random() * 10 - 5;
            createTile(x, y, z, url);  // Use the image URL in your tile creation function
        });
        animate(); // Start the animation loop after tiles are created
    })
    .catch(error => console.error('Error loading experiments:', error));

// Initialize Three.js
init();

// p5.js sketch
const s = (p) => {
    let centerX, centerY; // Center position for circular movement
    let bounceDuration = 1500;  // Duration for one full bounce cycle in ms
    let amplitude = 0.2;    // Initial amplitude for the bouncing effect (height of the bounce)
    let startTime; 
    let isBouncing = true; // State variable to control bounce vs pause
    let pauseDuration = 2000;  // Pause duration between bounces
    let pauseStartTime; 

    p.setup = () => {
        let canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        canvas.id('p5-canvas'); // Set the ID for the p5.js canvas
        canvas.position(0, 0);  // Position it at the top-left corner
        p.textFont('Poppins');
        p.textStyle(p.NORMAL);    // Apply bold weight
        p.fill('black');
        p.textSize(120);
        p.textAlign(p.CENTER, p.CENTER);

        centerX = p.width / 2;  // Center X position for the text
        centerY = p.height - 50; // Base Y position for the text
        startTime = p.millis();  // Capture the start time
    };


    // Easing function (ease in-out cubic)
    p.easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    p.draw = () => {
        // Clear the entire canvas completely
        p.clear();

        // Split the text into words
        let blurValuePassive = p.map(p.mouseY, 0, p.height, 0, 20);
        let blurValueIllustration = p.map(p.mouseY, 0, p.height, 20, 0);

        // Draw "passive" with the blur effect
        p.push();
        p.drawingContext.filter = `blur(${blurValuePassive}px)`;
        p.fill(0);
        p.text("PASSIVE", p.width / 2, p.height / 2 - 30);
        p.pop();

        // Draw "illustration" with the opposite blur effect
        p.push();
        p.drawingContext.filter = `blur(${blurValueIllustration}px)`;
        p.fill(0);
        p.text("ILLUSTRATION", p.width / 2, p.height / 2 + 40);
        p.pop();
        

        if (isBouncing) {
            // Calculate elapsed time since the start of the bounce
            let elapsedTime = p.millis() - startTime;
            let t = elapsedTime / bounceDuration; // Time factor normalized to [0, 1]
            
            if (t > 1) t = 1; // Ensure it stays within the bounce duration
            
            // Apply easing to the time factor (ease out effect)
            let easedT = p.easeInOutCubic(t);

            // Use the eased time to calculate the phase of the sine wave
            let phase = easedT * p.TWO_PI * -3; // Map to [0, 2PI] for one full sine wave
            let bounce = amplitude * p.sin(phase); // Damped sine wave for the bounce effect

        p.push();
        p.translate(centerX, centerY);  // Apply bouncing movement to the Y position
        p.rotate(bounce); // Apply rotation around the center
        p.fill('#fe8149');
        p.textSize(50);
        p.text("START", 0, 0);  // Draw at (0, 0) since we already translated to the center
        p.pop();

        p.push();
        p.translate(centerX, centerY-40);  // Apply bouncing movement to the Y position
        p.fill('#fe8149');
        p.textSize(20);
        p.text("Optimized for Desktop", 0, 0);  // Draw at (0, 0) since we already translated to the center
        p.pop();
 
        // If the bounce duration has passed, start the pause
        if (elapsedTime > bounceDuration) {
            isBouncing = false;  // Stop bouncing
            pauseStartTime = p.millis();  // Capture the start of the pause
        }
        } else {
        // Calculate elapsed time since the pause started
        let pauseElapsed = p.millis() - pauseStartTime;

        // If the pause duration has passed, restart the bouncing effect
        if (pauseElapsed > pauseDuration) {
            isBouncing = true;   // Resume bouncing
            startTime = p.millis();  // Reset start time for the bounce
            amplitude = 0.1;      // Reset amplitude to its initial value
        }

        // Optionally, you can draw the static "START" text during the pause
        p.push();
        p.translate(centerX, centerY);  // Keep text in the center during the pause
        p.fill('#fe8149');
        p.textSize(50);
        p.text("START", 0, 0);  // Draw at (0, 0)
        p.pop();
        }
    };

    p.mousePressed = () => {
        // Check if the click is within the "Start" text area
        const startTextWidth = p.textWidth("Start");
        const xMin = (p.width / 2) - (startTextWidth / 2);
        const xMax = (p.width / 2) + (startTextWidth / 2);
        const yMin = p.height - 50 - 30; // Considering text size and offset
        const yMax = p.height - 50 + 30;

        if (p.mouseX >= xMin && p.mouseX <= xMax && p.mouseY >= yMin && p.mouseY <= yMax) {
            // Scroll to the div with id "table-of-contents"
            document.getElementById("table-of-contents").scrollIntoView({ behavior: "smooth" });
        }
    };
};

new p5(s);