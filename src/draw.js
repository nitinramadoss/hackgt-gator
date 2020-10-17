function draw(options) {
    let canvas = document.getElementById('canvas');
    const context = canvas.getContext("2d");
    
    if(options.type === 'rectangle') {
        drawRectangle(options, context)
    } else if(options.type === 'text') {
        drawText(options, context)
    }
}

function drawRectangle(options, context) {
    let coords = options.bbox
    if (canvas.getContext) {
      context.fillRect(coords[0], coords[1], coords[2], coords[3]);
    }
}

function drawText(options, context) {
    let coords = options.bbox    
    let text = document.getElementById("inputBox").value;
    context.font = '48px serif';

    if (text != undefined) {
        context.fillText(text, coords[0], coords[1] + 0.5*coords[3]);
    } else {
        context.fillText("", coords[0], coords[1]);
    }
  }
 

export default draw