fetch('public/howgenaiworks.json')
    .then(response => response.json())
    .then(chapters => {
        let currentChapter = 0;

        function createNavigationButtons(chapters) {
            const buttonContainer = document.getElementById('how-genai-works-chapter');
            buttonContainer.innerHTML = ''; // Clear existing buttons

            chapters.forEach((chapter, index) => {
                const button = document.createElement('button');
                button.id = chapter.title.replace(/\s+/g, '-'); // Unique ID for each button
                button.className = 'page-number';
                button.innerText = chapter.title;
                button.addEventListener('click', () => {
                    currentChapter = index;
                    updateContent(currentChapter);
                });
                buttonContainer.appendChild(button);
            });
        }
        
        function updateContent(index) {
            const chapter = chapters[index];
            document.getElementById("how-genai-works-chapter-title").innerText = chapter.title;
            document.getElementById("how-genai-works-chapter-text").innerHTML = chapter.text;
        
            if (chapter.title === "LATENT SPACE") {
                // Load the script for Latent Space animation
                loadNewScript('scripts/latentspace-animation.js', 'how-genai-works-animation');
            } else {
                // Check if p5 instance for HowGenAiWorks exists, otherwise create it
                if (!window.p5InstanceHowGenAiWorks) {
                    loadNewScript('scripts/howgenaiworks-animation.js', 'how-genai-works-animation')
                        .then(() => {
                            if (chapter.image) {
                                window.p5InstanceHowGenAiWorks.updateImage(chapter.image);
                            }
                        })
                        .catch(error => console.error(error)); // Handle loading errors
                } else {
                    // Update the image in the existing p5 instance if it exists
                    if (window.p5InstanceHowGenAiWorks && chapter.image) {
                        window.p5InstanceHowGenAiWorks.updateImage(chapter.image);
                    }
                }
            }
        }
        
        
        
        function loadNewScript(scriptUrl, divId) {
            return new Promise((resolve, reject) => {
                // Clear existing p5 instances and their WebGL contexts
                if (window.p5InstanceHowGenAiWorks) {
                    window.p5InstanceHowGenAiWorks.remove();
                    delete window.p5InstanceHowGenAiWorks;
                }
                if (window.p5InstanceLatentSpace) {
                    window.p5InstanceLatentSpace.remove();
                    delete window.p5InstanceLatentSpace;
                }
        
                const div = document.getElementById(divId);
                div.innerHTML = ''; // Clear any existing content
        
                const script = document.createElement('script');
                script.src = scriptUrl;
                script.onload = () => {
                    console.log(`${scriptUrl} loaded successfully`);
                    resolve(); // Resolve the promise when the script is loaded
                };
                script.onerror = () => {
                    console.error(`Failed to load script: ${scriptUrl}`);
                    reject(new Error(`Failed to load script: ${scriptUrl}`)); // Reject the promise if the script fails to load
                };
                div.appendChild(script);
            });
        }
        

        // Initial content load and button creation
        createNavigationButtons(chapters);
        updateContent(currentChapter);
    })
    .catch(error => console.error('Error loading chapters:', error));
