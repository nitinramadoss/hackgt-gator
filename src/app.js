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

var currentCommand = "";

async function runDetection() {
    model.detect(video).then(async (predictions) => {
        model.renderPredictions(predictions, canvas, context, video);
        
        if (isVideo) {
            requestAnimationFrame(runDetection);     
        }

        if(predictions[0] !== undefined) {
            let action = await getAction();

            options = {
                bbox: predictions[0].bbox,
                type: 'rectangle',
                angle: 0,
                text: "",
                opacity: 1,
            }
            
            if (action.command == 'draw') {
                var shape = action.shape;

              if (shape == 'square') {
                //options.opacity = action.opacity;  
                currentCommand = "drawRectangle";
              } else if (shape == 'circle')  {   
                //options.opacity = parseInt(action.opacity);        
                currentCommand = "drawCircle";
              } else if (shape == 'arrow')  {         
                currentCommand = "drawArrow";
              } else if (shape == 'line')  {         
                currentCommand = "drawLine";
              }
            } else if (action.command == 'write') {
                options.text = action.text;
                currentCommand = "drawWrite";
            }

          if (currentCommand == "drawRectangle") {
            drawRectangle(options);
          } else if (currentCommand == "drawText") {
            drawText(options);  
          } else if (currentCommand == "drawCircle") {
            drawCircle(options);  
          } else if (currentCommand == "drawArrow") {
            drawArrow(options);  
          }
        }
    });
}

function drawRectangle(options) {
    var coords = options.bbox;

    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      context.globalAlpha = options.opacity;
      context.fillRect(coords[0], coords[1], coords[2], coords[3]);
    }
}

function drawText(options) {
    var coords = options.bbox;

    var text = document.getElementById("inputBox").value;
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

    if (canvas.getContext) {
        context.beginPath();
        context.arc(coords[0], coords[1], 0.5*coords[2], 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
    }
}

function drawArrow(options) {
    let coords = options.bbox;

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
    context.stroke();
}
 

handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
});

trackButton.addEventListener("click", function(){
    toggleVideo();
});


