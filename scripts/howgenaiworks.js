fetch('public/howgenaiworks.json')
    .then(response => response.json())
    .then(chapters => {
        let currentChapter = 0;

        const buttonContainer = document.getElementById('how-genai-works-chapter');
        const chapterTitleElement = document.getElementById("how-genai-works-chapter-title");
        const chapterTextElement = document.getElementById("how-genai-works-chapter-text");
        const imgElement = document.getElementById("how-genai-works-animation");
        const animation = document.getElementById("genai-image-container");

        preload = function () {
            loadNewScript('scripts/latentspace-animation.js', 'genai-image-container');
        }

        function createNavigationButtons(chapters) {
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
            currentChapter = index;
            const chapter = chapters[index];
            console.log("Updating content for chapter:", chapter.title);

            chapterTitleElement.innerText = chapter.title;
            chapterTextElement.innerHTML = chapter.text;

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

        // Initial content load and button creation
        createNavigationButtons(chapters);
        updateContent(currentChapter);
    })
    .catch(error => console.error('Error loading chapters:', error));
