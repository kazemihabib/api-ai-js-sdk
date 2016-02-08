# api-ai-js-sdk

#Demo
[Test api-ai-js-sdk with your token key](https://kazemihabib.github.io/api-ai-js-sdk/)
 
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


 
 ```javascript
apiai.onStart = function () {
       //for example change color of microphone icon
    };
  ```
  Fired when browser's Speech Recognition engine starts listening
  
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
 
Fired when some speech identified
```javascript
apiai.onResponse = function (e) {
       //do something with response
    };
 ```
 Fired when there is response form api.ai

 
```javascript
apiai.onError = function (e, explain) {
    //do something
};
    
```
 Fired when error is happend

