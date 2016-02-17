# Create Instance:

  create an instance like this:
  ```javascrip
var options = {
      "subscriptionKey": yourSubscriptionKey,
      "sessionId": SessionId,
      "token": access_token
  };
apiai = new ApiAi(options);
  ```
#### params:
* **Object** *options*

# Options

*options is an object for setting properties*

    token: your token key.
    
    subscriptionKey:  your subscription key.
    
    sessionId: session Id
    
    timeout:    timout of api.ai request (mseconds).defult is 10000ms.
    
    autoRestart: if you set this to "true" you need to call start method just one time
                but if you set it to 'false' each time speech detected the                                                                    
                recognition stops and you should call the start method again.
                default is 'true'
    
    server: the server of api.ai default is 'https://api.api.ai/v1/query?v=20150910'
    
    timezone: your timezone default is GMT +03:30
  
## Example:

  ```javascript
    var options = {
            "subscriptionKey": your subscriptionKey,
            "sessionId": "1234567890",
            "token": your token,
            "timeOut":8000,
            "autoRestart":true,
            "server":'https://api.api.ai/v1/query?v=20150910',
            "timezone":"GMT +03:30"
            
        };
  ```
# Methods:
### start()
    Start it.
### stop()
     Stop listening to more audio and to try to process the audio that is already received.

### abort()
     Stop the listening and stop recognizing and  abort the request if it has already been sent to api.ai server.

### isListening()
     return if it's listening now;
     
* **return** *boolean*

### setLanguage(language)
    Set the language the user will speak in.If this method is not called, defaults to 'EN'
see [languages](https://docs.api.ai/docs/languages)

#### params:
* **String** *language*
    


# Callbacks:

### onStart
    Fired when browser's Speech Recognition engine starts listening
### onEnd 
    Fired when browser's Speech Recognition engine stops listening.
    If autoRestart has been set to 'true' it will automatically restart so after 
    this onStart will be fired.
### onSpeechResult
    Fired when some speech identified

### onResponse 
    Fired when there is response form api.ai

### onError 
    Fired when error is happend
    
##### callbacks of speech recognition you can read more about them [here](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-events)
    
        onAudioStart 
        onAudioEnd 
        onSoundStart 
        onSoundEnd 
        onSpeechStart 
        onSpeechEnd 




  
    
