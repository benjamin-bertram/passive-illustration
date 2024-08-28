function latentspaceAnimation(p) {
    let canvassize = 700;
    let vx, vy, cp1x, cp1y, vx1, vy1, cp2x, cp2y, vx2, vy2, cp3x, cp3y, vx3, vy3, cp4x, cp4y, vx4, vy4, c;
    let corners = {
        // Triangle
        tl: { 
          x: 50, 
          y: 50,
          params: {
          vx: canvassize/2, vy: canvassize/3,
          cp1x: canvassize/12*7, cp1y: canvassize/2,
          vx1: canvassize/3*2, vy1: canvassize/3*2,
          cp2x: canvassize/2, cp2y: canvassize/3*2,
          vx2: canvassize/3, vy2: canvassize/3*2,
          cp3x: canvassize/12*5, cp3y: canvassize/2,
          vx3: canvassize/2, vy3: canvassize/3,
          cp4x: canvassize/2, cp4y: canvassize/3,
          vx4: canvassize/2, vy4: canvassize/3,
          c: 'hsb(60, 100%, 90%)'}
        },
        
        // Square
        tr: { 
          x: 550, 
          y: 50, 
          params: {
          vx: canvassize/3*2, vy: canvassize/3,
          cp1x: canvassize/3*2, cp1y: canvassize/2,
          vx1: canvassize/3*2, vy1: canvassize/3*2,
          cp2x: canvassize/2, cp2y: canvassize/3*2,
          vx2: canvassize/3, vy2: canvassize/3*2,
          cp3x: canvassize/3, cp3y: canvassize/2,
          vx3: canvassize/3, vy3: canvassize/3,
          cp4x: canvassize/2, cp4y: canvassize/3,
          vx4: canvassize/3*2, vy4: canvassize/3,
          c:'hsb(360, 100%, 80%)'}
        },
        // Line (approximation using quadratic curves)
        bl: { 
          x: 550, 
          y: 550, 
          params: {
          vx: canvassize/2, vy: canvassize/3,
          cp1x: canvassize/2, cp1y: canvassize/2,
          vx1: canvassize/2, vy1: canvassize/3*2,
          cp2x: canvassize/2, cp2y: canvassize/3*2,
          vx2: canvassize/2, vy2: canvassize/3*2,
          cp3x: canvassize/2, cp3y: canvassize/2,
          vx3: canvassize/2, vy3: canvassize/3,
          cp4x: canvassize/2, cp4y: canvassize/3,
          vx4: canvassize/2, vy4: canvassize/3,
          c: 'hsb(120, 100%, 100%)'}
        },
        // Circle (approximation using quadratic curves)
        br: { 
          x: 300, 
          y: 550, 
          params: {
          vx: canvassize/3*2, vy: canvassize/3,
          cp1x: canvassize*5/6, cp1y: canvassize/2,
          vx1: canvassize/3*2, vy1: canvassize/3*2,
          cp2x: canvassize/2, cp2y: canvassize*5/6,
          vx2: canvassize/3, vy2: canvassize/3*2,
          cp3x: canvassize/6, cp3y: canvassize/2,
          vx3: canvassize/3, vy3: canvassize/3,
          cp4x: canvassize/2, cp4y: canvassize/6,
          vx4: canvassize/3*2, vy4: canvassize/3,
          c: 'hsb(240, 80%, 100%)'}
        }
      };

    p.setup = function() {
    const canvas = p.createCanvas(canvassize, canvassize);
    canvas.parent('how-genai-works-animation'); // Ensure this ID matches your HTML element
    };

    p.draw = function() {
        //p.background(0);
        p.clear();

        let params = getParamsFromMouse();
        
        p.beginShape();
            p.fill(params.c);
            p.noStroke();
            p.strokeWeight(4);
            p.vertex(params.vx, params.vy);
            p.quadraticVertex(params.cp1x, params.cp1y, params.vx1, params.vy1);
            p.quadraticVertex(params.cp2x, params.cp2y, params.vx2, params.vy2);
            p.quadraticVertex(params.cp3x, params.cp3y, params.vx3, params.vy3);
            p.quadraticVertex(params.cp4x, params.cp4y, params.vx4, params.vy4);
        p.endShape(p.CLOSE);

        //p.fill(corners.tl.params.c);
        //triangle(30, 75, 58, 20, 86, 75);

    };

    function getParamsFromMouse() {
    let tu = lerpObj(corners.tl.params, corners.tr.params, p.constrain(p.mouseX / p.width, 0, 1));
    let bu = lerpObj(corners.bl.params, corners.br.params, p.constrain(p.mouseX / p.width, 0, 1));
    return lerpObj(tu, bu, p.constrain(p.mouseY / p.height, 0, 1));
    };

    function lerpObj(a, b, t) {
    return {
        vx: p.lerp(a.vx, b.vx, t),
        vy: p.lerp(a.vy, b.vy, t),
        cp1x: p.lerp(a.cp1x, b.cp1x, t),
        cp1y: p.lerp(a.cp1y, b.cp1y, t),
        vx1: p.lerp(a.vx1, b.vx1, t),
        vy1: p.lerp(a.vy1, b.vy1, t),
        cp2x: p.lerp(a.cp2x, b.cp2x, t),
        cp2y: p.lerp(a.cp2y, b.cp2y, t),
        vx2: p.lerp(a.vx2, b.vx2, t),
        vy2: p.lerp(a.vy2, b.vy2, t),
        cp3x: p.lerp(a.cp3x, b.cp3x, t),
        cp3y: p.lerp(a.cp3y, b.cp3y, t),
        vx3: p.lerp(a.vx3, b.vx3, t),
        vy3: p.lerp(a.vy3, b.vy3, t),
        cp4x: p.lerp(a.cp4x, b.cp4x, t),
        cp4y: p.lerp(a.cp4y, b.cp4y, t),
        vx4: p.lerp(a.vx4, b.vx4, t),
        vy4: p.lerp(a.vy4, b.vy4, t),
        c: p.lerpColor(p.color(a.c), p.color(b.c), t)
    }
    }
};

if (!window.p5InstanceLatentSpace) {
    let p5InstanceLatentSpace = new p5(latentspaceAnimation);
    window.p5InstanceLatentSpace = p5InstanceLatentSpace;
}