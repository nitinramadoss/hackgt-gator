const modelParams = {
    flipHorizontal: true,  
    maxNumBoxes: 20,      
    iouThreshold: 0.5,     
    scoreThreshold: 0.6,    
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
    });
}

function runDetectionImage(img) {
    model.detect(img).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, img);
    });
}


handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
});

trackButton.addEventListener("click", function(){
    toggleVideo();
});