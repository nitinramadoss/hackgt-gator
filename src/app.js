const modelParams = {
    flipHorizontal: true,   
    imageScaleFactor: 0.7, 
    maxNumBoxes: 6,        
    iouThreshold: 0.5,      
    scoreThreshold: 0.80,    
  }
  

navigator.getUserMedia = 
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

const video = document.querySelector('#video');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
let model;



handTrack.startVideo(video).then(status => {
    if(status){
        navigator.getUserMedia(
            {video: {}}, 
            stream => {
                video.srcObject = stream;
                setInterval(runDetection, 1000)
            },
            err => console.log(err)
        );
    }
});

function runDetection(){
    model.detect(video)
        .then(predictions => {
            console.log(predictions);
            model.renderPredictions(predictions, canvas, context, video);
        });
}


handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
});