var webPage = require('webpage'),
    system = require('system'),
    base64 = require('/src/helpers/base64');

var page = webPage.create(),
    resource = system.args[1],
    fileName = system.args[2],
    width = system.args[3] || 1920,
    height = system.args[4] || 1080,
    pageLoadWait = system.args[5] || 30000;

page.viewportSize = {width: width, height: height };

var waitFor = function(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis || 3000,
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
        // If not time-out yet and condition not yet fulfilled
        condition = testFx();
      } else {
        if(!condition) {
          // If condition still not fulfilled (timeout but condition is 'false')
          phantom.exit(1);
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          onReady(); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        }
      }
    }, 250); //< repeat check every 250ms
};

// DEPRECATED
var checkForLoaders = function(){
  var loaders = document.getElementsByClassName('loader');
  if (loaders.length === 0) { return false;}

  for (var i = 0; i < loaders.length; i++) {
    if (loaders[i].offsetParent === null) {
      return false;
    }
  }

  return true;
};

var onReady = function(){
  setTimeout(function() {
    page.render(fileName);
    phantom.exit();
  }, pageLoadWait);
};

page.onCallback = function(data){
  if (data && data.returnNow === true) {
    page.render(fileName);
    phantom.exit();
  };
};

page.open(base64.decode(resource), function (status){
  if (status !== 'success') {
    console.log('could not open ' + resource);
    phantom.exit(1);
  }

  waitFor(function(){
    return page.evaluate(checkForLoaders);
  }, onReady, 180000); // timeout after 3 minutes. 60 seconds might not be long enough
});
