fetch('public/howgenaiworks.json')
    .then(response => response.json())
    .then(chapters => {
        let currentChapter = 0;

        function createNavigationButtons(chapters) {
            const buttonContainer = document.getElementById('how-genai-works-chapter');

            chapters.forEach((chapter, index) => {
                const chapterSpan = document.createElement('span');
                chapterSpan.innerText = chapter.title;
                chapterSpan.className = 'page-number';
                chapterSpan.addEventListener('click', () => {
                    currentChapter = index;
                    updateContent(currentChapter);
                });
                buttonContainer.appendChild(chapterSpan);
            });
        }
        
        function updateContent(index) {
            const chapter = chapters[index];
            console.log("Updating content for chapter:", chapter.title);
            
            document.getElementById("how-genai-works-chapter-title").innerText = chapter.title;
            document.getElementById("how-genai-works-chapter-text").innerHTML = chapter.text;
            const imgElement = document.getElementById("how-genai-works-animation");
            const animation = document.getElementById("genai-image-container");

            if (chapter.title === "LATENT SPACE") {
                animation.style.display = 'block';
                imgElement.style.display = 'none'; // Hide the image element when showing the p5 sketch
            } else {
                animation.style.display = 'none';
                imgElement.src = chapter.image;
                imgElement.alt = chapter.title; // Set alt text
                imgElement.style.display = 'block'; // Show the image element when switching back to a chapter with an image
            }
        }

        // Call this function after DOMContentLoaded
        document.addEventListener("DOMContentLoaded", function() {
            loadNewScript('scripts/latentspace-animation.js', 'genai-image-container');
        });
        
        // Initial content load and button creation
        createNavigationButtons(chapters);
        updateContent(currentChapter);
    })
    .catch(error => console.error('Error loading chapters:', error));
