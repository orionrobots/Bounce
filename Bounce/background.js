chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('bounce_window.html', {
    'outerBounds': {
      'width': 720,
      'height': 500
    },
    'state': 'maximized',
    'frame':  'none'
  });
});
