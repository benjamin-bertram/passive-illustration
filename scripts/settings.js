document.addEventListener("DOMContentLoaded", async function() {
    // Cache DOM elements to minimize lookups
    const videoElement = document.getElementById('how-diffusion-works-animation');
    const chapterTitleElement = document.getElementById('how-diffusion-works-chapter-title');
    const chapterTextElement = document.getElementById('how-diffusion-works-chapter-text');
    const sliderElement = document.querySelector('.hdw-slider');
    const sliderValueDisplay = document.querySelector('.hdw-slider-value');
    const settingsContainer = document.getElementById('how-diffusion-works-chapters');

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
    
        // Set preload attribute based on network conditions or user settings
        videoElement.preload = 'metadata'; // Or 'auto' based on your use case
    
        // Update slider values dynamically and set the initial slider position
        buildSlider(chapter.slidervalue, chapter.initialSliderIndex);
    }

    function buildSlider(sliderValues, initialSliderIndex = 0) {
        sliderElement.min = 0;
        sliderElement.max = sliderValues.length - 1;
        sliderElement.value = initialSliderIndex;

        sliderValueDisplay.textContent = sliderValues[initialSliderIndex];

        // Debounce slider input handling
        const debouncedSliderInput = debounce(() => {
            const currentIndex = sliderElement.value;
            const currentValue = sliderValues[currentIndex];

            sliderValueDisplay.textContent = currentValue;
            updateVideoFrame(videoElement, currentValue);
        }, 100);

        sliderElement.removeEventListener('input', debouncedSliderInput); // Prevent multiple listeners
        sliderElement.addEventListener('input', debouncedSliderInput);
    }

    function updateVideoFrame(video, frameIndex) {
        video.currentTime = frameIndex / 30;
    }

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
});
