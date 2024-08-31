document.addEventListener("DOMContentLoaded", async function() {
    // Cache DOM elements to minimize lookups
    const videoElement = document.getElementById('controlability-animation');
    const chapterTitleElement = document.getElementById('controlability-chapter-title');
    const chapterTextElement = document.getElementById('controlability-chapter-text');
    const sliderElement = document.querySelector('.controlability-slider');
    const sliderValueDisplay = document.querySelector('.controlability-slider-value');
    const settingsContainer = document.getElementById('controlability-chapters');

    try {
        const response = await fetch('public/controlability.json');
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

        // Update text content
        chapterTitleElement.textContent = chapter.title;
        chapterTextElement.innerHTML = chapter.text;

        // Update video source and reload only if necessary
        const videoSource = videoElement.querySelector('source');
        if (videoSource.src !== chapter.video) {
            videoSource.src = chapter.video;
            videoElement.load();
        }

        // Update slider values dynamically
        buildSlider(chapter.slidervalue);
    }

    function buildSlider(sliderValues) {
        sliderElement.min = 0;
        sliderElement.max = sliderValues.length - 1;
        sliderElement.value = 0;

        sliderValueDisplay.textContent = sliderValues[0];

        // Debounce slider input handling to avoid excessive updates
        const debouncedSliderInput = debounce(() => {
            const currentIndex = sliderElement.value;
            const currentValue = sliderValues[currentIndex];

            sliderValueDisplay.textContent = currentValue;
            updateVideoFrame(videoElement, currentValue);
        }, 100);

        sliderElement.removeEventListener('input', debouncedSliderInput); // Prevent multiple listeners
        sliderElement.addEventListener('input', debouncedSliderInput);
    }

    function updateVideoFrame(video, frameNumber) {
        video.currentTime = frameNumber;
    }

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
});
