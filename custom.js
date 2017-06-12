var webPage = require('webpage'),
    system = require('system');

var page = webPage.create(),
    resource = 'https://app.periscopedata.com/shared/e118042f-3278-4d13-b89b-cdc9ad9829bb?data_ts=1497290400&embed=v2',
    fileName = system.args[1],
    width = system.args[2] || 1920,
    height = system.args[3] || 1080,
    pageLoadWait = system.args[4] || 30000;

page.viewportSize = {width: width, height: height };

page.onLoadFinished = function(){
  console.log('Finished loading ', resource);
};

page.onCallback = function(data){
  console.log('Executing callback now. Saving file.');
  console.log('Data: ', data);

  if (data && data.renderNow) {
    console.log('Saving to file: ', fileName);
    page.render(fileName);
    phantom.exit();
  };
};

page.open(resource, function (status){
  if (status !== 'success') {
    console.log('could not open ' + resource);
    phantom.exit(1);
  }

  window.setTimeout(function(){
    console.log('Timed out before executing callback.');
    phantom.exit(1);
  }, pageLoadWait);
});
