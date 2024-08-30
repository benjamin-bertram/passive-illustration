document.addEventListener("DOMContentLoaded", function() {
    const videoElement = document.getElementById('how-diffusion-works-animation');
    const chapterTitleElement = document.getElementById('how-diffusion-works-chapter-title');
    const chapterTextElement = document.getElementById('how-diffusion-works-chapter-text');
    const sliderElement = document.querySelector('.hdw-slider');  // Select the slider using the class
    const sliderValueDisplay = document.querySelector('.hdw-slider-value'); // Select the value display using the class

    // Load JSON data
    fetch('public/settings.json')
        .then(response => response.json())
        .then(data => {
            initializeSettings(data);
            loadChapterContent(data, 0); // Load the first chapter by default
        })
        .catch(error => console.error('Error fetching JSON:', error));

        function initializeSettings(data) {
            const settingsContainer = document.getElementById('how-diffusion-works-chapters');
        
            data.forEach((chapter, index) => {
                // Create a span for each chapter
                const chapterSpan = document.createElement('span');
                chapterSpan.innerText = chapter.title;
                chapterSpan.className = 'page-number';
                chapterSpan.addEventListener('click', () => {
                    currentChapter = index;
                    loadChapterContent(data, currentChapter);
                });
        
                settingsContainer.appendChild(chapterSpan);
            });
        }

    function loadChapterContent(data, chapterIndex) {
        const chapter = data[chapterIndex];

        // Update text content
        chapterTitleElement.textContent = chapter.title;
        chapterTextElement.innerHTML = chapter.text;

        // Update video source
        videoElement.querySelector('source').src = chapter.video;
        videoElement.load(); // Reload the video with the new source

        // Update slider values dynamically
        buildSlider(chapter.slidervalue);
    }

    function buildSlider(sliderValues) {
        // Update slider range and reset its value
        sliderElement.min = 0;
        sliderElement.max = sliderValues.length - 1;
        sliderElement.value = 0;

        // Display the initial slider value
        sliderValueDisplay.textContent = sliderValues[0];

        // Handle slider input changes
        sliderElement.addEventListener('input', function() {
            const currentIndex = sliderElement.value;
            const currentValue = sliderValues[currentIndex];

            // Update the display with the current value
            sliderValueDisplay.textContent = currentValue;

            // Call the function to update the video frame
            updateVideoFrame(videoElement, currentValue);
        });
    }

    // Optional: Function to handle video frame updates based on slider value
    function updateVideoFrame(video, frameNumber) {
        // This function can be customized to control video based on the value from slider
        video.currentTime = frameNumber; // Example: assume frameNumber correlates to time
    }
});
