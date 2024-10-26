fetch('public/experiments.json')
    .then(response => response.json())
    .then(data => {
        let currentExperimentIndex = 0;
        const experiments = data.experiments;

        const imgElement = document.getElementById('experiment-image');
        const textElement = document.getElementById('experiment-text');
        const titleElement = document.getElementById('experiment-title');
        const prevButton = document.getElementById('previous');
        const nextButton = document.getElementById('next');
        const gallery = document.getElementById('gallery');

        window.globalImageObject = new Image();

        function updateExperiment(index) {
            currentExperimentIndex = index;
            const experiment = experiments[currentExperimentIndex];

            // Update image source
            window.globalImageObject.src = experiment.image;

            window.globalImageObject.onload = () => {
                imgElement.src = window.globalImageObject.src;

                // Set global src variable
                window.globalImageSrc = window.globalImageObject.src;

                // Ensure all p5 instances update after the image has loaded
                if (window.p5Instances && window.p5Instances.length > 0) {
                    window.p5Instances.forEach(p5Instance => {
                        if (typeof p5Instance.updateImage === 'function') {
                            p5Instance.updateImage(window.globalImageObject);
                        }
                    });
                }
            };

            textElement.innerHTML = experiment.text || '';
            titleElement.innerHTML = experiment.title || '';

            prevButton.disabled = currentExperimentIndex === 0;
            nextButton.disabled = currentExperimentIndex === experiments.length - 1;
        }

        prevButton.addEventListener('click', () => {
            if (currentExperimentIndex > 0) {
                updateExperiment(currentExperimentIndex - 1);
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentExperimentIndex < experiments.length - 1) {
                updateExperiment(currentExperimentIndex + 1);
            }
        });

        updateExperiment(0);

        // Dynamically load each image from the JSON file
        experiments.forEach((experiment, index) => {
            const img = document.createElement('img');
            img.src = experiment.image;  // Fetching the image path from JSON
            img.alt = experiment.title || 'Experiment Image';  // Optional: Add alt text from JSON
            img.loading = 'lazy';  // Lazy load images for performance
            
            // Attach click event listener to trigger updateExperiment
            img.addEventListener('click', () => {
                updateExperiment(index);  // Trigger update with the clicked image index
            });

            gallery.appendChild(img);  // Append image to the gallery
        });

    })
    
    .catch(error => {
        console.error('Error loading experiments:', error);
    });
