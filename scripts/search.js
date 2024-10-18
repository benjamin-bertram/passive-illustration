document.addEventListener("DOMContentLoaded", async function() {
    let imageData = [];
    let filteredImageData = [];
    const searchInput = document.getElementById('searchInput');
    const imageContainer = document.getElementById('searchResults');
    const resultCount = document.getElementById('resultCount');
    const maxImages = 16; 
    let currentIndex = 0;
    let currentPage = 0; 
    let totalPages = 0;
    let isFilterActive = false; // To check if a filter is active
    let debounceTimer;

    // Image cache to store already loaded images
    const imageCache = new Map();

    // Fetch and process data once
    async function fetchAndProcessData(filePath, isInitialLoad = false) {
        try {
            const response = await fetch(filePath);
            const data = await response.text();
            const newData = data.split('\n').filter(filename => filename.trim() !== '').map(filename => {
                const parts = filename.split('-');
                return {
                    filename: filename,
                    token: parts[2].split('.')[0].toLowerCase(),
                    url: `public/token/${filename}`
                };
            });

            if (isInitialLoad) {
                imageData = newData;
                filteredImageData = [...imageData];
            } else {
                filteredImageData = newData;
                isFilterActive = true;
            }

            resetPagination();
            displayImages();
            updateNavigation();
            updateResultCount();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function resetPagination() {
        currentIndex = 0;
        currentPage = 0;
        totalPages = Math.ceil(filteredImageData.length / maxImages);
    }

    function search() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredImageData = isFilterActive ? filteredImageData : imageData;
        filteredImageData = filteredImageData.filter(img => img.token.includes(searchTerm));
        
        resetPagination();
        displayImages();
        updateNavigation();
        updateResultCount();
    }

    function displayImages() {
        imageContainer.innerHTML = ''; 
        const fragment = document.createDocumentFragment();
        const start = currentPage * maxImages;
        const end = Math.min(start + maxImages, filteredImageData.length);

        filteredImageData.slice(start, end).forEach(img => {
            const div = document.createElement('div');
            div.className = 'image-item';

            // Check if image is already cached
            if (imageCache.has(img.url)) {
                // Use cached image
                div.innerHTML = `
                    <img src="${imageCache.get(img.url)}" alt="${img.token}" width="150" height="150">
                    <p>${img.token}</p>
                `;
            } else {
                // Load image and cache it
                const imageElement = new Image();
                imageElement.src = img.url;
                imageElement.onload = () => {
                    // Store in cache after loading
                    imageCache.set(img.url, img.url);
                };

                div.innerHTML = `
                    <img src="${img.url}" alt="${img.token}" loading="lazy" width="150" height="150">
                    <p>${img.token}</p>
                `;
            }
            fragment.appendChild(div);
        });

        imageContainer.appendChild(fragment);
        updatePageIndex();
    }

    function updateNavigation() {
        const pageIndex = document.getElementById('page-index');
        pageIndex.style.display = filteredImageData.length <= maxImages ? 'none' : 'flex';
    }

    function updatePageIndex() {
        const pageIndex = document.getElementById('page-index');
        pageIndex.innerHTML = ''; 
        if (filteredImageData.length <= maxImages) return;

        const fragment = document.createDocumentFragment();
        const maxPageButtons = 10;
        const startPage = Math.max(currentPage - 2, 0);
        const endPage = Math.min(startPage + maxPageButtons, totalPages);

        if (startPage > 0) fragment.appendChild(document.createTextNode('...'));

        for (let i = startPage; i < endPage; i++) {
            const pageButton = document.createElement('span');
            pageButton.innerText = i + 1;
            pageButton.className = 'page-number' + (i === currentPage ? ' active' : '');
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayImages();
            });
            fragment.appendChild(pageButton);
        }

        if (endPage < totalPages) fragment.appendChild(document.createTextNode('...'));

        pageIndex.appendChild(fragment);
    }

    function updateResultCount() {
        resultCount.innerText = `Found ${filteredImageData.length/4} match${filteredImageData.length !== 1 ? 'es' : ''}`;
    }

    // Add event listeners to filter buttons
    document.querySelectorAll('.page-number').forEach(span => {
        span.addEventListener('click', (event) => {
            const filePath = event.target.dataset.file; // Ensure this data attribute is set correctly in HTML
            fetchAndProcessData(filePath);
            isFilterActive = true; // Mark the filter as active
        });
    });

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            isFilterActive = false; // Reset to search the full dataset
            search();
        }, 300);
    });

    // Initial data fetch
    await fetchAndProcessData('/benjaminbertram_com/filenames2.txt', true);
});
