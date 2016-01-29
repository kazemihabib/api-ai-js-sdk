/**
 *
 * Created by pc on 1/29/2016.
 */

(function () {
    var url = 'https://api.api.ai/v1/query?v=20150910';

    /**
     *varible used for stop listening when json send to apiAi server
     * @type {boolean}
     */
    var isListening = false;

    /**
     * Error codes
     */
    var ERR_AJAX = 0;
    var ERR_AJAX_TIMEOUT = 1;
    var ERR_AJAX_RESPONSE = 2;
    var ERR_SPEECH = 3;


    function apiAi(options) {
        options = options || {};
        //setProperties
        this.server = options.server || url;
        this.token = 'Bearer ' + options.token || 'Bearer ';
        this.timezone = options.timezone || "GMT +03:30";

        this.subscriptionKey = options.subscriptionKey || '';
        this.sessionId = options.sessionId || '';
        this.timeout = options.timeout || 10000;

        //set callBacks
        this.onStart = doNothing;
        this.onStop = doNothing;
        this.onSpeechResult = doNothing;
        this.onResponse = doNothing();
        this.onError = doNothing();

        this.initXHR();
        function doNothing() {
        }

    }

    apiAi.prototype.initXHR = function () {
        var that = this;

        that.xhr = new XMLHttpRequest();

        that.xhr.timeout = that.timeout;
        that.xhr.ontimeout = function () {
            that.onError(ERR_AJAX_TIMEOUT, "connection timed out");
            //that.recognition._start(56);
        };
        that.xhr.onError = function (e) {
            that.onError(ERR_AJAX, "error");
            console.log("rn started at 60  ");
            that.recognition._start();
        };

        that.xhr.onreadystatechange = function () {
            if (that.xhr.readyState == 4) {
                if (that.xhr.status = 200) {
                    that.onResponse(that.xhr.response);
                }
                else
                    that.onError(ERR_AJAX_RESPONSE, that.xhr.status);

                that.recognition._start();
            }
        };

    };
    /**
     * send json object to apiAi server
     * @param jsonObject
     * @param callBack
     */

    apiAi.prototype.sendJson = function (jsonObject, callBack) {

        console.log(jsonObject);
        var that = this;
        var contentType = "application/json;";// charset=utf-8";
        that.xhr.open('POST', that.server, true);


        that.xhr.setRequestHeader("Authorization", that.token);
        that.xhr.setRequestHeader("ocp-apim-subscription-key", that.subscriptionKey);
        that.xhr.setRequestHeader("Content-Type", contentType);

        that.xhr.send(JSON.stringify(jsonObject));
    };

    /**
     * initialize speech recognition.
     */
    apiAi.prototype.initSpeech = function () {

        var that = this;
        that.recognition = new webkitSpeechRecognition();
        that.recognition.interimResults = true;


        that.recognition.onresult = function (event) {

            if (event.results[0].isFinal) {

                var json = {
                    "query": event.results[0][0].transcript,
                    "timezone": that.timezone,
                    "lang": "en",
                    "sessionId":that.sessionId
                };

                that.recognition._stop();
                that.sendJson(json, that.recognition._start);
            }
            that.onSpeechResult(event);
        };

        that.recognition._stop = function () {
            that.recognition.stop();
            isListening = false;
        };
        that.recognition._start = function (line) {
            that.recognition.start();
            isListening = true;
        };

        that.recognition.onend = function () {
            if (isListening)
                that.recognition._start();
        };

        that.recognition.enerror = function (error) {
            that.onError(ERR_SPEECH, error);
        };

        that.recognition.onstart = function () {
            that.recognition.start
            isListening = true;
        };

    };
    /**
     * start the speechRecognition.
     */
    apiAi.prototype.start = function () {
        var that = this;
        /**
         * if recognition already created start it
         * else create it then start it.
         */
        if (that.recognition) {
            that.recognition._start();
        }
        else {
            that.initSpeech();
            that.recognition._start();
        }
    };

    /**
     * stop listening to more audio and to try to process the audio that is already received.
     */

    apiAi.prototype.stop = function () {
        var that = this;

        /**
         * if recognition already created stop it
         */
        if (that.recognition) {
            that.recognition._stop();
        }

    };
    /**
     * it will stop the listening and stop recognizing and  abort the request if it has already been sent to api.ai server.
     */
    apiAi.prototype.abort = function () {
        var that = this;

        that.recognition.abort();
        that.xhr.abort();

    }
    window.apiAi = apiAi;
})();
