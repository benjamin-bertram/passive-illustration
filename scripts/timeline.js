fetch('public/timeline.json')
    .then(response => response.json())
    .then(chapters => {
        const earliestYear = Math.min(...chapters.map(chapter => chapter.year));
        const latestYear = Math.max(...chapters.map(chapter => chapter.year));
        const yearRange = latestYear - earliestYear;
        const baseExponent = 1.25; // Adjust this value for the exponential curve
        const curveFactor = 6; // Adjust this value to control the curvature

        let currentChapter = 0;

        function calculateLeftPosition(year) {
            const normalizedYear = (year - earliestYear) / yearRange; 
            const exponentialPosition = Math.pow(normalizedYear, baseExponent);
            return exponentialPosition * 100;
        }

        function calculateTopPosition(year) {
            const normalizedYear = (year - earliestYear) / yearRange;
            const exponentialPosition = Math.pow(normalizedYear, baseExponent);
            const curvedPosition = Math.pow(normalizedYear, curveFactor) * (exponentialPosition +0.5);
            return (1 - curvedPosition) * 80;
        }

        const timelineContainer = document.getElementById('timeline');
        const svgContainer = document.getElementById('timeline-svg');
        const markers = [];

        chapters.forEach((chapter, index) => {
            const marker = document.createElement('div');
            marker.classList.add('timeline-marker');
            marker.setAttribute('data-chapter', index + 1);

            const leftPosition = calculateLeftPosition(chapter.year);
            const topPosition = calculateTopPosition(chapter.year);
            marker.style.left = `${leftPosition}%`;
            marker.style.top = `${topPosition}%`;

            const yearLabel = document.createElement('div');
            yearLabel.classList.add('timeline-year');
            yearLabel.innerText = chapter.year;
            yearLabel.style.left = `${leftPosition}%`;
            yearLabel.style.top = `${topPosition}%`;

            marker.addEventListener('click', () => {
                currentChapter = index;
                updateContent(currentChapter);
                highlightActiveDot(index); // Highlight the active dot
            });

            timelineContainer.appendChild(marker);
            timelineContainer.appendChild(yearLabel);
            markers.push(marker); // Store marker for later use
        });

        drawConnectingLines(svgContainer, markers);

        function drawConnectingLines(svgContainer, markers) {
            markers.forEach((item, index) => {
                if (index < markers.length - 1) {
                    const x1 = parseFloat(item.style.left);
                    const y1 = parseFloat(item.style.top);
                    const x2 = parseFloat(markers[index + 1].style.left);
                    const y2 = parseFloat(markers[index + 1].style.top);

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

        function updateContent(index) {
            const chapter = chapters[index];
            document.getElementById("chapter-title").innerText = chapter.title;
            document.getElementById("chapter-text").innerHTML = chapter.text;
        
            // Update the image in the p5 sketch
            if (window.p5InstanceTimeline) {
                window.p5InstanceTimeline.updateImage(chapter.image); // Update the image based on the selected chapter
            }
        
            highlightActiveDot(index); // Highlight the active dot
        }
        

        function highlightActiveDot(activeIndex) {
            markers.forEach((marker, index) => {
                if (index === activeIndex) {
                    marker.classList.add('active');
                } else {
                    marker.classList.remove('active');
                }
            });
        }

        // Navigation button event listeners
        document.getElementById("left-arrow").addEventListener("click", () => {
            if (currentChapter > 0) {
                currentChapter--;
                updateContent(currentChapter);
            }
        });

        document.getElementById("right-arrow").addEventListener("click", () => {
            if (currentChapter < chapters.length - 1) {
                currentChapter++;
                updateContent(currentChapter);
            }
        });

        // Initial content load
        updateContent(0);
    })
    .catch(error => console.error('Error loading chapters:', error));