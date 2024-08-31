document.querySelectorAll('.headline').forEach((element) => {
    const words = element.getAttribute('data-words').split(',');
    const transitionDuration = 200;
    const letterSpacing = 2; // Adjust this value for desired letter spacing
    const canvasHeight = 100;
    const textSize = 50;
    const blurStart = 7;
    const blurEnd = 0;

    // Pre-calculate text widths for all words
    let textWidths = [];
    let totalWidth = 0;

    new p5((p) => {
        p.setup = () => {
            let canvas = p.createCanvas(element.clientWidth, canvasHeight);
            canvas.parent(element); // Attach canvas to the specific div
            p.textFont('Poppins');
            p.textStyle(p.REGULAR);
            p.fill('black');
            p.textSize(textSize);
            p.textAlign(p.LEFT, p.CENTER);

            // Calculate text widths once
            words.forEach((word) => {
                let wordWidth = p.textWidth(word);
                textWidths.push(wordWidth);
                totalWidth += wordWidth + letterSpacing * word.length;
            });
        };

        p.draw = () => {
            p.clear();
            let phase = p.frameCount % (transitionDuration * words.length);
            let lerpValue = easeInOutQuad((phase % transitionDuration) / transitionDuration);
            let currentWordIndex = Math.floor(phase / transitionDuration);
            let nextWordIndex = (currentWordIndex + 1) % words.length;
            let startX = 10;

            words.forEach((word, i) => {
                let blur = 0;
                if (i === currentWordIndex) {
                    blur = p.lerp(blurStart, blurEnd, lerpValue);
                } else if (i === nextWordIndex) {
                    blur = p.lerp(blurEnd, blurStart, lerpValue);
                }
                
                p.push();
                p.drawingContext.filter = `blur(${blur}px)`;

                let xPosition = startX;
                for (let char of word) {
                    p.text(char, xPosition, p.height / 2);
                    xPosition += p.textWidth(char) + letterSpacing;
                }

                p.pop();
                startX += textWidths[i] + letterSpacing * word.length; // Use pre-calculated widths
            });
        };

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }
    });
});
