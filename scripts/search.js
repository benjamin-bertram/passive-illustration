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

    // Function to fetch and process filenames from a given source
    function fetchAndProcessData(filePath) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                imageData = data.split('\n').filter(filename => filename.trim() !== '').map(filename => {
                    const parts = filename.split('-');
                    return {
                        filename: filename,
                        token: parts[2].split('.')[0].toLowerCase(),
                        url: `public/token/${filename}`
                    };
                });
                filteredImageData = [...imageData]; // Reset filtered data to full data set
                
                // Reset pagination variables
                currentIndex = 0;
                currentPage = 0;
                
                totalPages = Math.ceil(filteredImageData.length / maxImages); // Calculate total pages
                displayImages();
                updateNavigation();
                console.log(`Loaded ${imageData.length} images`);
                resultCount.innerText = `Loaded ${imageData.length / 4} tokens in total`; // Initial count display
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Initial fetch from the main source
    fetchAndProcessData('/benjaminbertram_com/filenames2.txt');

    function search() {
        const searchTerm = searchInput.value.toLowerCase();
        imageContainer.innerHTML = ''; // Clear previous results
        currentIndex = 0; // Reset the index
        currentPage = 0; // Reset the current page

        filteredImageData = imageData.filter(img => img.token.includes(searchTerm)); // Filtered results
        totalPages = Math.ceil(filteredImageData.length / maxImages); // Recalculate total pages based on filtered results

        displayImages(); // Display filtered results
        updateNavigation(); // Update navigation based on new filtered data

        console.log(`Found ${filteredImageData.length} matches`);
        
        if (filteredImageData.length > 4) {
            resultCount.innerText = `Found ${filteredImageData.length / 4} matches`; 
        } 
        else {
            resultCount.innerText = `Found ${filteredImageData.length / 4} match`; 
        }
    }

    function displayImages() {
        imageContainer.innerHTML = ''; // Clear previous results every time
    
        const start = currentPage * maxImages;
        const end = Math.min(start + maxImages, filteredImageData.length); // Ensure we don't go out of bounds
    
        const results = filteredImageData.slice(start, end);
    
        imageContainer.innerHTML += results.map(img =>
            `<div class="image-item")">
                <img src="${img.url}" alt="${img.token}" loading="lazy" width="150" height="150">
                <p>${img.token}</p>
            </div>`
        ).join('');
    
        updatePageIndex();
    }

    function updateNavigation() {

        const pageIndex = document.getElementById('page-index');
    
        if (filteredImageData.length <= maxImages) {

            pageIndex.style.display = 'none';
        } else {
            pageIndex.style.display = 'flex'; // Show page index if there are multiple pages
        }
    }
    
    function updatePageIndex() {
        const pageIndex = document.getElementById('page-index');
        pageIndex.innerHTML = ''; // Clear previous page numbers
    
        if (filteredImageData.length <= maxImages) return; // No need to display page numbers if all results fit on one page
    
        const maxPageButtons = 10; // Maximum number of page buttons to display
        const startPage = Math.max(currentPage - 2, 0);
        const endPage = Math.min(startPage + maxPageButtons, totalPages);
    
        // Add '...' before the first page if there are hidden pages
        if (startPage > 0) {
            const ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            pageIndex.appendChild(ellipsis);
        }
    
        // Create page buttons
        for (let i = startPage; i < endPage; i++) {
            const pageButton = document.createElement('span');
            pageButton.innerText = i + 1;
            pageButton.className = 'page-number';
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayImages();
            });
            pageIndex.appendChild(pageButton);
        }
    
        // Add '...' after the last page if there are hidden pages
        if (endPage < totalPages) {
            const ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            pageIndex.appendChild(ellipsis);
        }
    }

    // listeners for buttons with concets
    document.getElementById('countriesButton').addEventListener('click', () => fetchAndProcessData('benjaminbertram_com/countries_filenames.txt'));
    document.getElementById('namesButton').addEventListener('click', () => fetchAndProcessData('benjaminbertram_com/names_filenames.txt'));
    document.getElementById('colorsButton').addEventListener('click', () => fetchAndProcessData('benjaminbertram_com/colors_filenames.txt'));
    document.getElementById('occupationsButton').addEventListener('click', () => fetchAndProcessData('benjaminbertram_com/occupations_filenames.txt'));
    document.getElementById('materialsButton').addEventListener('click', () => fetchAndProcessData('benjaminbertram_com/materials_filenames.txt'));
    document.getElementById('unusualButton').addEventListener('click', () => fetchAndProcessData('benjaminbertram_com/unusual_filenames.txt'));

    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(search, 300);
        fetchAndProcessData('/benjaminbertram_com/filenames2.txt');
    });
});
