fetch('/public/experiments.json')
    .then(response => response.json())
    .then(data => {
        // Initialize variables
        let currentExperimentIndex = 0;
        const experiments = data.experiments;

        // Get DOM elements
        const imgElement = document.querySelector('#experiment-image img');
        const textElement = document.getElementById('experiment-text');
        const titleElement = document.getElementById('experiment-title');
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');

        // Function to update the experiment display
        function updateExperiment(index) {
            currentExperimentIndex = index;
            const experiment = experiments[currentExperimentIndex];

            // Update image
            window.globalImageSrc = experiment.image;
            imgElement.src = window.globalImageSrc;

            // Update all p5 sketches with the new image
            if (window.p5Instances && window.p5Instances.length > 0) {
                window.p5Instances.forEach(p5Instance => {
                    if (typeof p5Instance.updateImage === 'function') {
                        p5Instance.updateImage(window.globalImageSrc);
                    }
                });
            }

            // Update text
            textElement.innerHTML = experiment.text || '';

            // Update text
            titleElement.innerHTML = experiment.title || '';

            // Update button states
            prevButton.disabled = currentExperimentIndex === 0;
            nextButton.disabled = currentExperimentIndex === experiments.length - 1;
        }

        // Event listeners for navigation buttons
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

        // Initialize with the first experiment
        updateExperiment(0);
    })
    .catch(error => {
        console.error('Error loading experiments:', error);
        // You can display an error message to the user here if desired
    });
