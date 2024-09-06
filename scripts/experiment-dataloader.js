fetch('/public/experiments.json')
    .then(response => response.json())
    .then(data => {
        let currentExperimentIndex = 0;
        const experiments = data.experiments;

        const imgElement = document.querySelector('#experiment-image img');
        const textElement = document.getElementById('experiment-text');
        const titleElement = document.getElementById('experiment-title');
        const prevButton = document.getElementById('previous');
        const nextButton = document.getElementById('next');

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
    })
    .catch(error => {
        console.error('Error loading experiments:', error);
    });
