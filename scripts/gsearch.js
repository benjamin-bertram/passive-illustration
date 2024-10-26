const apiKey = 'AIzaSyAun6KhUmvA6V6j98JVHZMu2152_yx0kBw';
const cx = '2467dc33db5af4459';
const predefinedQuery = 'Stable Diffusion Resources'; 

// Function to perform search using the query from the input field or the predefined one
function performSearch(query) {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=10`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                displayResults(data.items);
            } else {
                console.log('No results found');
                document.getElementById('gsearchResults-left').innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(error => console.error('Error fetching search results:', error));
}

// Function to display results in the grid
function displayResults(results) {
    if (!results || results.length === 0) {
        console.log('No results found');
        return;
    }

    const leftColumn = document.getElementById('gsearchResults-left');
    const rightColumn = document.getElementById('gsearchResults-right');

    // Clear previous results
    leftColumn.innerHTML = '';
    rightColumn.innerHTML = '';

    // Divide results into two columns: first 10 in left column, next 10 in right column
    const firstTenResults = results.slice(0, 4);
    const nextTenResults = results.slice(4, 10);

    // Function to format and display individual result
    function createResultElement(result) {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('search-result'); // Add a class for styling
        resultDiv.innerHTML = `
            <h3><a href="${result.link}" target="_blank">${result.title}</a></h3>
            <p>${result.snippet}</p>
        `;
        return resultDiv;
    }

    // Add the first 10 results to the left column
    firstTenResults.forEach(result => {
        leftColumn.appendChild(createResultElement(result));
    });

    // Add the next 10 results to the right column
    nextTenResults.forEach(result => {
        rightColumn.appendChild(createResultElement(result));
    });
}

// Attach event listener to the search button to trigger the search
document.getElementById('gsearchButton').addEventListener('click', function() {
    const query = document.getElementById('gsearchInput').value;
    if (query.trim() !== '') {
        performSearch(query); // Perform search if input is not empty
    }
});

// Optionally, trigger search by pressing Enter
document.getElementById('gsearchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = document.getElementById('gsearchInput').value;
        if (query.trim() !== '') {
            performSearch(query); // Perform search if input is not empty
        }
    }
});

// Perform the predefined search when the page loads
window.onload = function() {
    document.getElementById('gsearchInput').value = predefinedQuery; // Set the predefined query in the search input
    performSearch(predefinedQuery); // Perform the search with the predefined query
};
