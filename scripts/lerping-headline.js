document.querySelectorAll('.headline').forEach((element) => {
    let words = element.getAttribute('data-words').split(',');
    let transitionDuration = 200;
    let letterSpacing = 2; // Adjust this value for desired letter spacing


    new p5((p) => {
        p.setup = () => {
            let canvas = p.createCanvas(element.clientWidth, 100);
            canvas.parent(element); // Attach canvas to the specific div
            p.textFont('Poppins');
            p.textStyle(p.REGULAR);
            p.fill('black');
            p.textSize(50);
            p.textAlign(p.LEFT, p.CENTER);
        };

        p.draw = () => {
            p.clear();
            let phase = p.frameCount % (transitionDuration * words.length);
            let lerpValue = easeInOutQuad((phase % transitionDuration) / transitionDuration);
            let currentWordIndex = p.floor(phase / transitionDuration);
            //let startX = (p.width - totalTextWidth()) / 2; //for centred alignment
            let startX = 10

            words.forEach((word, i) => {
                let blur = i === currentWordIndex ? p.lerp(7, 0, lerpValue) : i === (currentWordIndex + 1) % words.length ? p.lerp(0, 7, lerpValue) : 0;
                p.push();
                p.drawingContext.filter = `blur(${blur}px)`;

                //p.text(word, startX + p.textWidth(word) / 2, p.height / 2);

                // Draw each letter with added spacing
                let xPosition = startX;
                for (let char of word) {
                    p.text(char, xPosition, p.height / 2);
                    xPosition += p.textWidth(char) + letterSpacing; // Add custom letter spacing
                }
                
                p.pop();
                //startX += p.textWidth(word) + 10;
                startX += p.textWidth(word) + letterSpacing * word.length; // Adjust the spacing between words

            });
        };

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }
    });
});
