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


function runDetection() {
    model.detect(video).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);
        
        if (isVideo) {
            requestAnimationFrame(runDetection);     
        }

        if(predictions[0] !== undefined) {
            const options = {
                bbox: predictions[0].bbox,
                type: 'rectangle',
                opacity: 'shaded',
            }
            draw(options)
        }
    });
}

function drawRectangle(coords) {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      context.fillRect(coords[0], coords[1], coords[2], coords[3]);
    }
}

function drawText(coords) {
    var text = document.getElementById("inputBox").value;
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = '48px serif';

    if (text != undefined) {
        ctx.fillText(text, coords[0], coords[1] + 0.5*coords[3]);
    } else {
        ctx.fillText("", coords[0], coords[1]);
    }
  }
 

handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
});

trackButton.addEventListener("click", function(){
    toggleVideo();
});

