# api-ai-js-sdk
# usage
In your HTML, include `api.ai.sdk.js`
```html
<script src="api.ai.sdk.js"></script>
```
Create an instance of `api.ai.sdk.js`:
```javascript
var options = {
          "subscriptionKey": yourSubscriptionKey,
          "sessionId": SessionId,
          "token": access_token
      };
apiai = new ApiAi(options);
```


 Fired when browser's Speech Recognition engine starts listening
 ```javascript
apiai.onStart = function () {
       //for example change color of microphone icon
    };
  ```
  Fired when some speech identified.
 ```javascript   
apiai.onSpeechResult = function (e) {
    console.log(e);
    if (e.results[0].isFinal) {
        //for example show the final result with black color
    }
    else {
        //it's interim result 
        //for example show the result with grey color
    }

  };
```
  Fired when error is happend
```javascript
apiai.onError = function (e, explain) {
    //do something
};
    
```
    
