function latentspaceAnimation(p) {
  let canvassize = 600;
  const halfCanvas = canvassize/2;
  const thirdCanvas = canvassize/3;
  const twoThirdCanvas = canvassize*2/3;
  const fiveSixthCanvas = canvassize*5/6
  const sixthCanvas = canvassize/6


  let corners = {
    // Triangle
    tl: { 
      x: 50, 
      y: 50,
      params: {
      vx: halfCanvas, vy: thirdCanvas,
      cp1x: canvassize/12*7, cp1y: halfCanvas,
      vx1: twoThirdCanvas, vy1: twoThirdCanvas,
      cp2x: halfCanvas, cp2y: twoThirdCanvas,
      vx2: thirdCanvas, vy2: twoThirdCanvas,
      cp3x: canvassize/12*5, cp3y: halfCanvas,
      vx3: halfCanvas, vy3: thirdCanvas,
      cp4x: halfCanvas, cp4y: thirdCanvas,
      vx4: halfCanvas, vy4: thirdCanvas,
      c: 'yellow'}
    },
    
    // Square
    tr: { 
      x: 550, 
      y: 50, 
      params: {
      vx: twoThirdCanvas, vy: thirdCanvas,
      cp1x: twoThirdCanvas, cp1y: halfCanvas,
      vx1: twoThirdCanvas, vy1: twoThirdCanvas,
      cp2x: halfCanvas, cp2y: twoThirdCanvas,
      vx2: thirdCanvas, vy2: twoThirdCanvas,
      cp3x: thirdCanvas, cp3y: halfCanvas,
      vx3: thirdCanvas, vy3: thirdCanvas,
      cp4x: halfCanvas, cp4y: thirdCanvas,
      vx4: twoThirdCanvas, vy4: thirdCanvas,
      c:'red'}
    },
    // Line (approximation using quadratic curves)
    bl: { 
      x: 550, 
      y: 550, 
      params: {
      vx: halfCanvas, vy: thirdCanvas,
      cp1x: halfCanvas, cp1y: halfCanvas,
      vx1: halfCanvas, vy1: twoThirdCanvas,
      cp2x: halfCanvas, cp2y: twoThirdCanvas,
      vx2: halfCanvas, vy2: twoThirdCanvas,
      cp3x: halfCanvas, cp3y: halfCanvas,
      vx3: halfCanvas, vy3: thirdCanvas,
      cp4x: halfCanvas, cp4y: thirdCanvas,
      vx4: halfCanvas, vy4: thirdCanvas,
      c: 'green'}
    },
    // Circle (approximation using quadratic curves)
    br: { 
      x: 300, 
      y: 550, 
      params: {
      vx: twoThirdCanvas, vy: thirdCanvas,
      cp1x: fiveSixthCanvas, cp1y: halfCanvas,
      vx1: twoThirdCanvas, vy1: twoThirdCanvas,
      cp2x: halfCanvas, cp2y: fiveSixthCanvas,
      vx2: thirdCanvas, vy2: twoThirdCanvas,
      cp3x: sixthCanvas, cp3y: halfCanvas,
      vx3: thirdCanvas, vy3: thirdCanvas,
      cp4x: halfCanvas, cp4y: sixthCanvas,
      vx4: twoThirdCanvas, vy4: thirdCanvas,
      c: 'blue'}
    }
  };

  p.setup = function() {
    const canvas = p.createCanvas(canvassize, canvassize);
    canvas.parent('genai-image-container');
    drawStaticShapes();
  };

  p.draw = function() {
    p.background(255)
    let params = getParamsFromMouse();
    drawDynamicShape(params)
  };

  function drawStaticShapes() {
    p.fill(corners.tl.params.c);
    p.triangle(0, 55, 28, 0, 56, 55);
    p.fill(corners.tr.params.c);
    p.square(550, 0, 50);
    p.fill(corners.br.params.c);
    p.circle(575, 575, 50);
    p.stroke(corners.bl.params.c);
    p.strokeWeight(5);
    p.line(0, 550, 0, 600);
  };

  function drawDynamicShape(params) {
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

    drawStaticShapes(params);
  }


  function getParamsFromMouse() {
    const mouseXConstrained = p.constrain(p.mouseX / p.width, 0, 1);
    const mouseYConstrained = p.constrain(p.mouseY / p.height, 0, 1);

    let tu = lerpObj(corners.tl.params, corners.tr.params, mouseXConstrained);
    let bu = lerpObj(corners.bl.params, corners.br.params, mouseXConstrained);

    return lerpObj(tu, bu, mouseYConstrained);
  }

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

new p5(latentspaceAnimation);