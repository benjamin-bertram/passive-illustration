document.addEventListener("DOMContentLoaded", function() {
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

    function fetchAndProcessData(filePath, isInitialLoad = false) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                const newData = data.split('\n').filter(filename => filename.trim() !== '').map(filename => {
                    const parts = filename.split('-');
                    return {
                        filename: filename,
                        token: parts[2].split('.')[0].toLowerCase(),
                        url: `public/token/${filename}`
                    };
                });

                if (isInitialLoad) {
                    imageData = newData;  // Keep the full dataset in memory
                    filteredImageData = [...imageData]; // Initially, filtered data is the same as full data
                } else {
                    filteredImageData = newData; // Set filtered data to the new filtered set
                    isFilterActive = true;  // Mark that a filter is active
                }

                resetPagination();
                displayImages();
                updateNavigation();
                updateResultCount();

                console.log(`Loaded ${newData.length} images from ${filePath}`);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function resetPagination() {
        currentIndex = 0;
        currentPage = 0;
        totalPages = Math.ceil(filteredImageData.length / maxImages);
    }

    function search() {
        const searchTerm = searchInput.value.toLowerCase();

        // If no filter is active, search across the full dataset
        if (!isFilterActive) {
            filteredImageData = imageData.filter(img => img.token.includes(searchTerm));
        } else {
            // Search within the current filtered data
            filteredImageData = filteredImageData.filter(img => img.token.includes(searchTerm));
        }

        resetPagination();
        displayImages();
        updateNavigation();
        updateResultCount();
        console.log(`Found ${filteredImageData.length} matches`);
    }

    function displayImages() {
        imageContainer.innerHTML = ''; 
        const fragment = document.createDocumentFragment();
        const start = currentPage * maxImages;
        const end = Math.min(start + maxImages, filteredImageData.length);
        const results = filteredImageData.slice(start, end);

        results.forEach(img => {
            const div = document.createElement('div');
            div.className = 'image-item';
            div.innerHTML = `
                <img src="${img.url}" alt="${img.token}" loading="lazy" width="150" height="150">
                <p>${img.token}</p>
            `;
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

        if (startPage > 0) {
            fragment.appendChild(document.createTextNode('...'));
        }

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

        if (endPage < totalPages) {
            fragment.appendChild(document.createTextNode('...'));
        }

        pageIndex.appendChild(fragment);
    }

    function updateResultCount() {
        resultCount.innerText = `Found ${filteredImageData.length / 4} match${filteredImageData.length > 4 ? 'es' : ''}`;
    }

    // Initial fetch of the main dataset
    fetchAndProcessData('/benjaminbertram_com/filenames2.txt', true);

    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', () => {
            fetchAndProcessData(button.dataset.file);
            isFilterActive = true; // Mark the filter as active
        });
    });

    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            isFilterActive = false; // Reset to search the full dataset
            search();
        }, 300);
    });
});
