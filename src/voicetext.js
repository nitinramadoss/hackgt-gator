// status fields and start button in UI
var phraseDiv;
var startRecognizeOnceAsyncButton;

// subscription key and region for speech services.
var subscriptionKey, subscriptionKeyBool, serviceRegion;
var SpeechSDK;
var recognizer;
var currentSpeech = '';
var boardAction;
var preventTimeoutCall = false;

function  checkRequestCanvas(text) {
  console.log("In Check Request Canvas");
  console.log("Checking values: " + text + preventTimeoutCall);
  if (text.includes("canvas") && !preventTimeoutCall)
  {
    console.log(text);

    if (text.includes('canvass')) {
      if (currentSpeech.includes('canvass right')) {
        const writeText = currentSpeech.split('canvass right')[1];
        boardAction = { command: 'write', text: writeText };
        console.log(boardAction);
      } else if (currentSpeech.includes('canvass write')) {
        const writeText = currentSpeech.split('canvass write')[1];
        boardAction = { command: 'write', text: writeText };
        console.log(boardAction);
      } else { boardAction = textNLP(text.split('canvass')[1]); }
    }
    /* if (currentSpeech.includes("write")) {
      let writeText = currentSpeech.split("canvass write")[1];
      boardAction = {command: "write", text: writeText};
    }
    else */
    else if (text.includes('canvas')) {
      if (currentSpeech.includes('canvas right')) {
        const writeText = currentSpeech.split('canvas right')[1];
        boardAction = { command: 'write', text: writeText };
        console.log(boardAction);
      } else if (currentSpeech.includes('canvas write')) {
        const writeText = currentSpeech.split('canvas write')[1];
        boardAction = { command: 'write', text: writeText };
        console.log(boardAction);
      } else { boardAction = textNLP(text.split('canvas')[1]); }
    }
    currentSpeech = '';
    preventTimeoutCall = false;
  } else {
    preventTimeoutCall = false;
  }
  console.log('End of CRC: ' + preventTimeoutCall);
}
document.addEventListener('DOMContentLoaded', function () {
  startRecognizeOnceAsyncButton = document.getElementById('startRecognizeOnceAsyncButton');
  if (window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    startRecognizeOnceAsyncButton.disabled = false;

    //    document.getElementById('content').style.display = 'block';
    //    document.getElementById('warning').style.display = 'none';

    // in case we have a function for getting an authorization token, call it.
    if (typeof RequestAuthorizationToken === 'function') {
      RequestAuthorizationToken();
    }
  }
  subscriptionKey;
  serviceRegion = 'eastus';
  phraseDiv = document.getElementById('phraseDiv');

  startRecognizeOnceAsyncButton.addEventListener('click', function () {
    startRecognizeOnceAsyncButton.disabled = true;
    phraseDiv.innerHTML = '';

    // if we got an authorization token, use the token. Otherwise use the provided subscription key
    var speechConfig;
    console.log(authorizationToken);
    if (authorizationToken) {
      console.log('speech configured');
      speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, serviceRegion);
    } else {
      if (subscriptionKey === '' || subscriptionKey === 'subscription') {
        alert('Please enter your Microsoft Cognitive Services Speech subscription key!');
        return;
      }
      speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    }

    speechConfig.speechRecognitionLanguage = 'en-US';
    var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    console.log(35);
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    recognizer.startContinuousRecognitionAsync();
    var timer;
    console.log(37);
    recognizer.recognizing = (s, e) => {
      phraseDiv.innerHTML = e.result.text;
      console.log(`RECOGNIZING: Text=${e.result.text}`);
      console.log(typeof e.result.text);
      // try {
      //   preventTimeoutCall = true;
      //   clearTimeout(timer);
      //   console.log(preventTimeoutCall);
      //
      // } catch (e) {
      //   console.log("timer not initialized")
      // }
      if (e.result.text.length + 3 > currentSpeech.length) {
        currentSpeech = e.result.text;
        try {
          preventTimeoutCall = true;
          // clearTimeout(timer);
          console.log(preventTimeoutCall);
        } catch (e) {
          console.log('timer not initialized');
        }
        // preventTimeoutCall = false;
        timer = setTimeout(function () {
          checkRequestCanvas(currentSpeech);
          console.log('After setting timer: ' + preventTimeoutCall);
        }, 2000);
        console.log(currentSpeech);
      } else {
        preventTimeoutCall = false;
        clearTimeout(timer);
        console.log('Final Phrase: ' + currentSpeech);
        if (currentSpeech.includes('canvass')) {
          if (currentSpeech.includes('canvass right')) {
            const writeText = currentSpeech.split('canvass right')[1];
            boardAction = { command: 'write', text: writeText };
          } else if (currentSpeech.includes('canvass write')) {
            if (currentSpeech.includes('canvass write')) {
              const writeText = currentSpeech.split('canvass write')[1];
              boardAction = { command: 'write', text: writeText };
            }
          } else { boardAction = textNLP(currentSpeech.split('canvass')[1]); }
        } else if (currentSpeech.includes('canvas')) {
          if (currentSpeech.includes('canvas right')) {
            const writeText = currentSpeech.split('canvas right')[1];
            boardAction = { command: 'write', text: writeText };
          } else if (currentSpeech.includes('canvas write')) {
            if (currentSpeech.includes('canvas write')) {
              const writeText = currentSpeech.split('canvas write')[1];
              boardAction = { command: 'write', text: writeText };
            }
          } else { boardAction = textNLP(currentSpeech.split('canvas')[1]); }
        }
        currentSpeech = e.result.text;
        console.log('NLP RESULT');
        console.log(boardAction);

        if (boardAction !== undefined) {
          boardActionStack.push(boardAction);
        }
      }
    };
    recognizer.sessionStarted = (s, e) => {
      console.log('session started');
    };
    recognizer.speechStartDetected = (s, e) => {
      console.log('phrase logged');
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
      } else if (e.result.reason === ResultReason.NoMatch) {
        console.log('NOMATCH: Speech could not be recognized.');
      }
    };

    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);

      if (e.reason === CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log('CANCELED: Did you update the subscription info?');
      }

      recognizer.stopContinuousRecognitionAsync();
    };

    recognizer.sessionStopped = (s, e) => {
      console.log('\n    Session stopped event.');
      recognizer.stopContinuousRecognitionAsync();
    };

    if (window.SpeechSDK) {
      SpeechSDK = window.SpeechSDK;
      startRecognizeOnceAsyncButton.disabled = false;

      // in case we have a function for getting an authorization token, call it.
      if (typeof RequestAuthorizationToken === 'function') {
        RequestAuthorizationToken();
      }
    }
  });
});
