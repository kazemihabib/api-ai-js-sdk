/**
 *
 * Created by pc on 2/1/2016.
 */

var speechText = document.getElementById('speech-text');
var jsonResult = document.getElementById("json-result");
var micIcon = document.getElementById('mic-icon');
var micButton = document.getElementById("mic-button");
var spinnerIcon = document.getElementById('spinner-icon');
var tokenKey = '';
var subscriptionKey = '';

var apiai;
var isListening = false;
micButton.onclick = function () {
    if (!apiai) {
        tokenKey = document.getElementById('token-key');
        subscriptionKey = document.getElementById("subscription-key");
        var options = {
            "subscriptionKey": subscriptionKey.value,
            "sessionId": "1234567890",
            "token": tokenKey.value
        };
        init(options);
        tokenKey.disabled = true;
        subscriptionKey.disabled = true;
    }
    //It's not listening yet so start it
    if (!isListening) {
        console.log("in if speech");
        isListening = true;
        apiai.start();
    }
    //It's already started so abort it
    else {
        console.log("in else speech");
        isListening = false;
        apiai.abort();
    }
};

function setIconToMic() {
    micIcon.style.display = 'inline-block';
    spinnerIcon.style.display = 'none';
}

function setIconToSpinner(){
    micIcon.style.display = 'none';
    spinnerIcon.style.display = 'inline-block';
}

//var options = {
//    "subscriptionKey": "ccc25635-b18a-4561-963d-76650b268c46",
//    "sessionId": "1234567890",
//    "token": "e2e3f51f83064269bfe3ed587d3389a5"
//};

function init(options) {
    apiai = new ApiAi(options);
    apiai.onStart = function () {
        micIcon.style.color = 'red';
        console.log("started");
    };
    apiai.onSpeechResult = function (e) {
        console.log(e);
        if (e.results[0].isFinal) {
            speechText.innerHTML = e.results[0][0].transcript;
            speechText.style.color = 'black';
            setIconToSpinner();
        }
        else {
            speechText.innerHTML = e.results[0][0].transcript;
            speechText.style.color = 'grey';
        }

    };

    apiai.onError = function (e, explain) {
        console.log(e + explain);
        if (e < 3) {
            jsonResult.innerHTML = explain;
            setIconToMic();
        }
    };


    apiai.onEnd = function () {
        micIcon.style.color = 'black';
    };

    apiai.onResponse = function (e) {
        jsonResult.innerHTML = e;
        setIconToMic();
    };

    apiai.onAudioStart = function () {
        console.log('audio start');
    };
    apiai.onAudioEnd = function () {
        console.log('audioEnd');
    };

    apiai.onSoundStart = function () {
        console.log('sound start');
    };

    apiai.onSoundEnd = function () {
        console.log('sound end');
    };

    apiai.onSpeechStart = function () {
        console.log("speech Start");
        micIcon.style.backgroundColor = 'red';
        micIcon.style.color = 'white';
    };

    apiai.onSpeechEnd = function () {
        console.log('speech end');
        micIcon.style.backgroundColor = 'white';
        micIcon.style.color = 'red';
    };
}

