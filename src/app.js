import draw from './draw.js'

const modelParams = {
    flipHorizontal: true,  
    maxNumBoxes: 20,      
    iouThreshold: 0.5,     
    scoreThreshold: 0.90    
}

let isVideo = false;
let model = null;

const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
let trackButton = document.getElementById("trackbutton");
const context = canvas.getContext("2d");
context.globalAlpha = 0.7;


let latestOptions = {}
let shapes = []
let placed = false

async function getAction() {
  var action = await boardAction;
  return action;
}

function toggleVideo() {
    if (!isVideo) {
        console.log("Starting video");
        startVideo();
    } else {       
        handTrack.stopVideo(video)
        isVideo = false;
    }
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("Initiating camera", status);
        if (status) {
            isVideo = true
            runDetection()
        } else {
            console.log("Camera failed to start");
        }
    });
}

var currentCommand 

async function runDetection() {
    model.detect(video).then(async (predictions) => {
        model.renderPredictions(predictions, canvas, context, video);

        drawPersist()
        
        if (isVideo) {
            requestAnimationFrame(runDetection);     
        }

        if(predictions[0] !== undefined) {
            let action = await getAction();

            let options = null;
            if(action !== undefined && action !== null) {
                options = action
                if (action.command === 'draw') {
                    var shape = action.shape;
                    options.bbox = predictions[0].bbox

                  if (shape === 'square') {
                    currentCommand = "drawRectangle";
                  } else if (shape === 'circle')  {    
                    currentCommand = "drawCircle";
                  } else if (shape === 'arrow')  { 
                    currentCommand = "drawArrow";
                  } else if (shape === 'line')  {                     
                    currentCommand = "drawLine";
                  }
                  latestOptions = options

                  latestOptions.bbox = predictions[0].bbox
                  if (currentCommand == "drawRectangle") {
                    drawRectangle(latestOptions);
                  } else if (currentCommand == "drawCircle") {
                    drawCircle(latestOptions);  
                  } else if (currentCommand == "drawArrow") {
                    drawArrow(latestOptions);  
                  } else if (currentCommand == 'drawLine') {
                      drawLine(latestOptions)
                  }

                  placed = false
            
                } else if (action.command == 'write') {
                    options.shape = 'text'
                    options.text = action.text;
                    options.bbox = predictions[0].bbox
                    
                    latestOptions = options;
                    drawText(options)
                    placed = false
                } else if (action.command === 'place' && !placed) {
                    shapes.push(latestOptions)
                    console.log(shapes)
                    console.log(latestOptions.bbox)

                    placed = true
                }

                
            }
        }
    });
}

function drawRectangle(options) {
    var coords = options.bbox;

    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      context.fillStyle = options.color  
      context.globalAlpha = 0.5;
      context.fillRect(coords[0], coords[1], coords[2], coords[3]);
    }
}

function drawText(options) {
    var coords = options.bbox;
    context.globalAlpha = 1;

    var text = options.text;
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = '48px serif';

    if (text != undefined) {
        ctx.fillText(text, coords[0], coords[1] + 0.5*coords[3]);
    } else {
        ctx.fillText("", coords[0], coords[1]);
    }
}

function drawCircle(options) {
    let coords = options.bbox;
    context.globalAlpha = 0.5;

    if (canvas.getContext) {
        context.beginPath();
        context.arc(coords[0] + 0.5*coords[2], coords[1]+0.5*coords[3], coords[3] / 3, 0, 2 * Math.PI, false);
        context.fillStyle = options.color;
        context.fill();
    }
}

function drawArrow(options) {
    let coords = options.bbox;
    context.globalAlpha = 0.5;

    var headlen = 10; 
    var dx = coords[2];
    var dy = coords[3];
    var angle = Math.atan2(dy, dx);
    context.beginPath();
    context.moveTo(coords[0], coords[1]);
    context.lineTo(dx + coords[0], dy + coords[1]);
    context.lineTo(dx + coords[0] - headlen * Math.cos(angle - Math.PI / 6), dy + coords[1] - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(dx + coords[0], dy + coords[1]);
    context.lineTo(dx + coords[0] - headlen * Math.cos(angle + Math.PI / 6), dy + coords[1] - headlen * Math.sin(angle + Math.PI / 6));
    context.lineWidth = 10;
    context.strokeStyle = options.color
    context.stroke();
    
}

function drawLine(options) {
    let coords = options.bbox;
    context.beginPath()
    context.moveTo(coords[0], coords[1])
    context.lineTo(coords[0] + 0.5 * coords[2], coords[1] + 0.5 * coords[3])
    context.lineWidth = 10;
    context.strokeStyle = options.color

    context.stroke();
}
 

function drawPersist() {
    shapes.forEach(options => {
        if (options.shape == "square") {
            drawRectangle(options);
          } else if (options.shape == "text") {
            drawText(options);  
          } else if (options.shape == "circle") {
            drawCircle(options);  
          } else if (options.shape == "arrow") {
            drawArrow(options);  
          } else if (options.shape == "line") {
            drawLine(options)
          }
    })
}

handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
});

trackButton.addEventListener("click", function(){
    toggleVideo();
});


