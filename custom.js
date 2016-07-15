var webPage = require('webpage'),
    system = require('system'),
    base64 = require('/src/helpers/base64');

var page = webPage.create(),
    resource = system.args[1],
    fileName = system.args[2],
    width = system.args[3] || 1920,
    height = system.args[4] || 1080;

page.viewportSize = {width: width, height: height };

var waitFor = function(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
        // If not time-out yet and condition not yet fulfilled
        condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
      } else {
        if(!condition) {
          // If condition still not fulfilled (timeout but condition is 'false')
          phantom.exit(1);
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        }
      }
    }, 250); //< repeat check every 250ms
};

var checkForLoaders = function(){
  var loaders = document.getElementsByClassName('loader');
  if (loaders.length === 0) { return false;}

  for (var i = 0; i < loaders.length; i++) {
    if (loaders[i].style.display !== 'none') {
      return false;
    }
  }

  return true;
}

var onReady = function(){
  page.render(fileName);
  phantom.exit();
}

page.open(base64.decode(resource), function (status){
  if (status !== 'success') {
    console.log('could not open ' + resource);
    phantom.exit(1);
  }

  waitFor(function(){
    return page.evaluate(checkForLoaders);
  }, onReady, 60000);

});
