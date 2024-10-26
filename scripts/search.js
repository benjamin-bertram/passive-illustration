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
    let isFilterActive = false;
    let debounceTimer;

    // Image cache with a size limit (e.g., 100 images) using a Map for LRU caching
    const cacheLimit = 100;
    const imageCache = new Map();

    // Token index map for faster searching
    const tokenIndexMap = new Map();

    async function fetchAndProcessData(filePath, isInitialLoad = false) {
        try {
            const response = await fetch(filePath);
            const data = await response.text();
            const newData = data.split('\n').filter(filename => filename.trim() !== '').map(filename => {
                const parts = filename.split('-');
                return {
                    filename: filename,
                    token: parts[1].split('.')[0].toLowerCase(),
                    url: `public/token/${filename}`
                };
            });

            if (isInitialLoad) {
                imageData = newData;
                filteredImageData = [...imageData];
                indexTokens(imageData); // Index tokens on initial load
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

    // Build an index for faster search filtering
    function indexTokens(data) {
        data.forEach(img => {
            if (!tokenIndexMap.has(img.token)) {
                tokenIndexMap.set(img.token, []);
            }
            tokenIndexMap.get(img.token).push(img);
        });
    }

    function resetPagination() {
        currentIndex = 0;
        currentPage = 0;
        totalPages = Math.ceil(filteredImageData.length / maxImages);
    }

    // Optimized search using the index map
    function search() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredImageData = isFilterActive ? filteredImageData : imageData;
        filteredImageData = filteredImageData.filter(img => img.token.includes(searchTerm));
        
        resetPagination();
        displayImages();
        updateNavigation();
        updateResultCount();
    }

    // Virtualized rendering - only render visible images in the viewport
    function displayImages() {
        imageContainer.innerHTML = ''; 
        const fragment = document.createDocumentFragment();
        const start = currentPage * maxImages;
        const end = Math.min(start + maxImages, filteredImageData.length);

        filteredImageData.slice(start, end).forEach(img => {
            const div = document.createElement('div');
            div.className = 'image-item';

            if (imageCache.has(img.url)) {
                div.innerHTML = `
                    <img src="${imageCache.get(img.url)}" alt="${img.token}" width="150" height="150">
                    <p>${img.token}</p>
                `;
            } else {
                const imageElement = new Image();
                imageElement.src = img.url;
                imageElement.onload = () => {
                    if (imageCache.size >= cacheLimit) {
                        // Remove the oldest item in the cache
                        const oldestKey = imageCache.keys().next().value;
                        imageCache.delete(oldestKey);
                    }
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
        resultCount.innerText = `Found ${filteredImageData.length} match${filteredImageData.length !== 1 ? 'es' : ''}`;
    }

    // Add event listeners to filter buttons
    document.querySelectorAll('.page-number').forEach(span => {
        span.addEventListener('click', (event) => {
            const filePath = event.target.dataset.file; // Ensure this data attribute is set correctly in HTML
            fetchAndProcessData(filePath);
            isFilterActive = true; // Mark the filter as active
        });
    });

    // Debounced search input for optimized typing response
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            isFilterActive = false;
            search();
        }, 300);
    });

    await fetchAndProcessData('benjaminbertram_com/filenames.txt', true);
});
