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


    function ApiAi(options) {
        options = options || {};
        //setProperties
        this.language = "EN"; // default, change it with setLanguage function
        this.server = options.server || url;
        this.token = 'Bearer ' + options.token || 'Bearer ';
        this.timezone = options.timezone || "GMT +03:30";

        this.subscriptionKey = options.subscriptionKey || '';
        this.sessionId = options.sessionId || '';
        this.timeout = options.timeout || 10000;

        this.autoRestart = options.autoRestart || true;

        //set callBacks
        this.onStart = doNothing;
        this.onEnd = doNothing;
        this.onSpeechResult = doNothing;
        this.onResponse = doNothing();
        this.onError = doNothing();


        this.initXHR();
        function doNothing() {
        }

    }

    /**
     * Set language
     * @param lang
     * @returns {*}
     */
    ApiAi.prototype.setLanguage = function (lang) {
        var that = this;
        var language = {
            //google speech language: api.ai language
            "PT-BR": "PT-BR",
            "ZH-HK": "ZH-HK",
            "ZH-CN": "ZH-CN",
            "ZH-TW": "ZH-TW",
            "EN-US": "EN",
            "EN-AU": 'EN',
            "EN-CA": "EN",
            "EN-IN": "EN",
            "EN-NZ": "EN",
            "EN-ZA": "EN",
            "EN-GB": "EN",
            "NL-NL": "NL",
            "FR-FR": "FR",
            "DE-DE": "DE",
            "IT-IT": "IT",
            "JA": "Ja",
            "KO": "kO",
            "PT-PT": "PT",
            "RU": "RU",
            "ES-AR": "ES",
            "ES-BO": "ES",
            "ES-CL": "ES",
            "ES-CO": "ES",
            "ES-CR": "ES",
            "ES-DO": "ES",
            "ES-GT": "ES",
            "ES-HN": "ES",
            "ES-MX": "ES",
            "ES-NI": "ES",
            "ES-PA": "ES",
            "ES-PY": "ES",
            "ES-PE": "ES",
            "ES-PR": "ES",
            "ES-ES": "ES",
            "ES-US": "ES",
            "ES-UY": "ES",
            "ES-VE": "ES",
            "UK": "UK"
        };

        if (typeof language[lang.toUpperCase()] != 'undefined') {
            that.language = language[lang.toUpperCase()];
            that.recognition.lang = lang;
            return "language changed";
        }
        else {
            return "language is undefined";
        }
    };
    /**
     * Initialise new xmlHttpRequest
     */
    ApiAi.prototype.initXHR = function () {
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
            if (that.autoRestart)
                that.recognition._start();
        };

        that.xhr.onreadystatechange = function () {
            if (that.xhr.readyState == 4) {
                if (that.xhr.status = 200) {
                    that.onResponse(that.xhr.response);
                }
                else
                    that.onError(ERR_AJAX_RESPONSE, that.xhr.status);
                if (that.autoRestart)
                    that.recognition._start();
            }
        };

    };


    /**
     * Send json object to apiAi server
     * @param jsonObject
     */

    ApiAi.prototype.sendJson = function (jsonObject) {

        var that = this;
        var contentType = "application/json;";// charset=utf-8";
        that.xhr.open('POST', that.server, true);


        that.xhr.setRequestHeader("Authorization", that.token);
        that.xhr.setRequestHeader("ocp-apim-subscription-key", that.subscriptionKey);
        that.xhr.setRequestHeader("Content-Type", contentType);

        that.xhr.send(JSON.stringify(jsonObject));
    };

    /**
     * Initialize speech recognition.
     */
    ApiAi.prototype.initSpeech = function () {

        var that = this;
        that.recognition = new webkitSpeechRecognition();
        that.recognition.interimResults = true;


        that.recognition.onresult = function (event) {

            if (event.results[0].isFinal) {

                var json = {
                    "query": event.results[0][0].transcript,
                    "timezone": that.timezone,
                    "lang":that.language,
                    "sessionId": that.sessionId
                };

                that.recognition._stop();
                that.sendJson(json);
            }
            that.onSpeechResult(event);
        };

        that.recognition._stop = function () {
            that.recognition.stop();
            isListening = false;
        };
        that.recognition._start = function () {
            that.recognition.start();
            isListening = true;
        };

        that.recognition.onend = function () {
            //don't restart if it's waiting for response from api.ai server or auto restart is false;
            if (isListening && that.autoRestart)
                that.recognition._start();
            that.onEnd();
        };

        that.recognition.enerror = function (event) {
            that.onError(ERR_SPEECH, event.error);
        };

        that.recognition.onstart = function () {
            that.onStart();
        };

    };


    /**
     * Start the speechRecognition.
     */
    ApiAi.prototype.start = function () {
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
     * Stop listening to more audio and to try to process the audio that is already received.
     */

    ApiAi.prototype.stop = function () {
        var that = this;

        /**
         * if recognition already created stop it
         */
        if (that.recognition) {
            that.recognition._stop();
        }

    };

    /**
     * Stop the listening and stop recognizing and  abort the request if it has already been sent to api.ai server.
     * @private
     */
    ApiAi.prototype.abort = function () {
        var that = this;

        that.recognition.abort();
        that.xhr.abort();

    };
    window.ApiAi = ApiAi;
})();
