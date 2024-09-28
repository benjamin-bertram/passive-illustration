document.addEventListener("DOMContentLoaded", async function() {
    // Cache DOM elements to minimize lookups
    const videoElement = document.getElementById('how-diffusion-works-animation');
    const chapterTitleElement = document.getElementById('how-diffusion-works-chapter-title');
    const chapterTextElement = document.getElementById('how-diffusion-works-chapter-text');
    const sliderElement = document.getElementById('how-diffusion-works-slider');
    const sliderValueDisplay = document.getElementById('how-diffusion-works-slider-value');
    const settingsContainer = document.getElementById('how-diffusion-works-chapters');

    let currentSliderValues = []; // Store the current slider values

    try {
        const response = await fetch('public/settings.json');
        const data = await response.json();
        initializeSettings(data);
        loadChapterContent(data, 0); // Load the first chapter by default
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }

    function initializeSettings(data) {
        const fragment = document.createDocumentFragment(); // Use document fragment to minimize reflows
        data.forEach((chapter, index) => {
            const chapterSpan = document.createElement('span');
            chapterSpan.innerText = chapter.title;
            chapterSpan.className = 'page-number';
            chapterSpan.addEventListener('click', () => {
                loadChapterContent(data, index);
            });
            fragment.appendChild(chapterSpan);
        });
        settingsContainer.appendChild(fragment); // Batch append operation
    }

    function loadChapterContent(data, chapterIndex) {
        const chapter = data[chapterIndex];
        chapterTitleElement.textContent = chapter.title;
        chapterTextElement.innerHTML = chapter.text;

        // Update video source and reload only if different to avoid unnecessary reloads
        const videoSource = videoElement.querySelector('source');
        if (videoSource.src !== chapter.video) {
            videoSource.src = chapter.video;
            videoElement.load();

            // Once the video is loaded, set the initial frame based on initialSliderIndex
            videoElement.onloadeddata = function() {
                const initialIndex = chapter.initialSliderIndex;
                updateVideoFrame(videoElement, initialIndex);
            };
        }

        // Update slider values dynamically without rebuilding it
        updateSlider(chapter.slidervalue, chapter.initialSliderIndex);
    }

    function updateSlider(sliderValues, initialSliderIndex) {
        // Store the current slider values for later use
        currentSliderValues = sliderValues;

        // Set up the slider range based on the length of the sliderValues array
        sliderElement.min = 0;
        sliderElement.max = sliderValues.length - 1;
        sliderElement.step = 1;

        // Set the initial value of the slider
        sliderElement.value = initialSliderIndex;

        // Display the current slider value
        sliderValueDisplay.textContent = sliderValues[initialSliderIndex];
    }

    // Event listener that will handle slider input and update the video
    sliderElement.addEventListener('input', () => {
        const currentIndex = parseInt(sliderElement.value, 10); // Convert slider value to an integer index
        const currentValue = currentSliderValues[currentIndex]; // Get the value at the current index

        // Update the displayed slider value
        sliderValueDisplay.textContent = currentValue;

        // Update the video frame based on the index
        updateVideoFrame(videoElement, currentIndex);
    });

    function updateVideoFrame(video, frameIndex) {
        // Assuming 29.97 FPS, update the video to the correct time
        video.currentTime = frameIndex / 29.97;
    }
});
