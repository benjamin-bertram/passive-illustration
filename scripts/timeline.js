fetch('public/timeline.json')
    .then(response => response.json())
    .then(chapters => {
        const earliestYear = Math.min(...chapters.map(ch => ch.year));
        const latestYear = Math.max(...chapters.map(ch => ch.year));
        const yearRange = latestYear - earliestYear;
        const baseExponent = 1.05, curveFactor = 7;
        const timelineContainer = document.getElementById('timeline');
        const svgContainer = document.getElementById('timeline-svg');
        const markers = [];
        let currentChapter = 0;

        // Function to calculate positions
        function calculateLeftPosition(year) {
            const normalizedYear = (year - earliestYear) / yearRange; 
            return Math.pow(normalizedYear, baseExponent) * 100;
        }

        function calculateTopPosition(year) {
            const normalizedYear = (year - earliestYear) / yearRange;
            const exponentialPosition = Math.pow(normalizedYear, baseExponent);
            const curvedPosition = Math.pow(normalizedYear, curveFactor) * (exponentialPosition + 0.5);
            return (1 - curvedPosition) * 80;
        }

        const fragment = document.createDocumentFragment(); // Fragment for batching

        // Loop to create markers and labels
        chapters.forEach((chapter, index) => {
            const marker = document.createElement('div');
            marker.className = 'timeline-marker';
            marker.dataset.chapter = index + 1;

            const left = calculateLeftPosition(chapter.year);
            const top = calculateTopPosition(chapter.year);
            marker.style.left = `${left}%`;
            marker.style.top = `${top}%`;

            const yearLabel = document.createElement('div');
            yearLabel.className = 'timeline-year';
            const truncatedYear = Math.floor(chapter.year);
            yearLabel.innerText = truncatedYear;
            yearLabel.style.left = `${left}%`;
            yearLabel.style.top = `${top}%`;

            marker.addEventListener('click', () => {
                currentChapter = index;
                updateContent(currentChapter);
            });

            fragment.appendChild(marker);
            fragment.appendChild(yearLabel);
            markers.push(marker);
        });

        timelineContainer.appendChild(fragment); // Append all at once

        // Function to draw lines between markers
        function drawLines() {
            markers.forEach((marker, i) => {
                if (i < markers.length - 1) {
                    const x1 = parseFloat(marker.style.left);
                    const y1 = parseFloat(marker.style.top);
                    const x2 = parseFloat(markers[i + 1].style.left);
                    const y2 = parseFloat(markers[i + 1].style.top);

                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute('x1', `${x1}%`);
                    line.setAttribute('y1', `${y1}%`);
                    line.setAttribute('x2', `${x2}%`);
                    line.setAttribute('y2', `${y2}%`);
                    line.setAttribute('stroke', 'black');
                    line.setAttribute('stroke-width', 2);

                    svgContainer.appendChild(line);
                }
            });
        }

        drawLines();

        // Update content based on the clicked chapter
        function updateContent(index) {
            const chapter = chapters[index];
            document.getElementById("chapter-title").innerText = chapter.title;
            document.getElementById("chapter-text").innerHTML = chapter.text;

            const imgElement = document.getElementById('timeline-animation');
            if (imgElement) imgElement.src = chapter.image;

            highlightActiveDot(index);
        }

        // Highlight the active dot on the timeline
        function highlightActiveDot(activeIndex) {
            markers.forEach((marker, index) => {
                marker.classList.toggle('active', index === activeIndex);
            });
        }

        // Initial content load
        updateContent(0);
    })
    .catch(error => console.error('Error loading chapters:', error));
