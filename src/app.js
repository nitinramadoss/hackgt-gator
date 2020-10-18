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
                } else if ((action.command === 'place' || action.command === 'drop') && !placed) {
                    shapes.push(latestOptions)
                    console.log(shapes)
                    console.log(latestOptions.bbox)

                    placed = true
                } else if (action.command === 'delete') {
                    shapes = []
                    placed = false

                  // let dist = 30000000.0
                  // let handPos = [predictions[0].bbox[0], predictions[0].bbox[1]]
                  // let tempDist
                  // let minIndex
                  // let i = 0
                  // shapes.forEach(option => {
                  //   tempDist = (handPos[0] - option.bbox[0]) * (handPos[0] - option.bbox[0]) + (handPos[1] - option.bbox[1]) * (handPos[1] - option.bbox[1])

                  //   if(tempDist < dist) {
                  //     minIndex = i
                  //     dist = tempDist
                  //   }
                  //   i++
                  // })
                  // shapes.splice(minIndex, 1)
                  // boardAction = null
                }

                
            }
        }
    });
}

function drawRectangle(options) {
    var coords = options.bbox;
    context.globalAlpha = 0.7;

    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {  
       if (options.opacity === 'solid') { 
          context.fillStyle = options.color;  
          context.fillRect(coords[0], coords[1], coords[2], coords[3])
       } else {
         context.lineWidth = 10;
         context.strokeStyle = options.color
         context.strokeRect(coords[0], coords[1], coords[2], coords[3])
       }
    }
}

function drawText(options) {
    var coords = options.bbox;
    context.globalAlpha = 1;

    var text = options.text;

    context.font = '48px serif';
    context.fillStyle = 'black'

    if (text != undefined) {
        context.fillText(text, coords[0], coords[1] + 0.5*coords[3]);
    } else {
        context.fillText("", coords[0], coords[1]);
    }
}

function drawCircle(options) {
    let coords = options.bbox;
    context.globalAlpha = 0.7;

    if (canvas.getContext) {
        context.beginPath();
        context.arc(coords[0] + 0.5*coords[2], coords[1]+0.5*coords[3], coords[3] / 2, 0, 2 * Math.PI, false);

        if(options.opacity === 'solid') {
          context.fillStyle = options.color;
          context.fill();
        } else {
          context.lineWidth = 10;
          context.strokeStyle = options.color
          context.stroke();
        }
    }
}

function drawArrow(options) {
  let coords = options.bbox;
  context.globalAlpha = 0.7;

  let scale = 0.5;
  
  let dx = scale * coords[2];
  let dy = scale * coords[3];
  let angle2 = options.angle * Math.PI / 180;
  let new_dy = dy - (dx * Math.tan(angle2));
  
  var headlen = 10; 

  var angle = Math.atan2(dy, dx);
  context.beginPath();
  context.moveTo(coords[0], coords[1] + dy);
  context.lineTo(dx + coords[0], new_dy + coords[1]);
  context.lineTo(dx + coords[0] - headlen * Math.cos(angle - Math.PI / 6), new_dy + coords[1] - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(dx + coords[0], new_dy + coords[1]);
  context.lineTo(dx + coords[0] - headlen * Math.cos(angle + Math.PI / 6), new_dy + coords[1] - headlen * Math.sin(angle + Math.PI / 6));
  context.lineWidth = 10;
  context.strokeStyle = options.color
  context.stroke();
  
}

function drawLine(options) {
  let coords = options.bbox;
  let scale = 0.5;

  let dx = scale * coords[2];
  let dy = scale * coords[3];
  let angle = options.angle * Math.PI / 180;
  let new_dy = dy - (dx * Math.tan(angle));

  context.beginPath()
  context.moveTo(coords[0], dy + coords[1])
  context.lineTo(coords[0] + dx, coords[1] + new_dy)
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


