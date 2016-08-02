var OrangeSea = {
  //declare global variables
  debug: false,
  thunder: null,
  music: null,
  waveSound: null,
  deadMessage: null,
  showTutorial: true, //show tutorial once when game begins
  minBalloonDelay: 2, //gets shorter as levels progress
  toggleFullScreen: function() {
    if (this.scale.isFullScreen)
    {
        this.scale.stopFullScreen();
        this.game.canvas.style.cursor = "default";
    }
    else
    {
        this.scale.startFullScreen(false);
        this.game.canvas.style.cursor = "none";
    }
  }
};

OrangeSea.Boot = function(game) {
};

OrangeSea.Boot.prototype = {
  init: function () {
    this.input.maxPointers = 1; //Change if need multitouch
    if (this.game.device.desktop)
    {
      this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
    }
    else
    {
      alert("Mobile support is highly experimental! Proceed with low expectations. Orient device horizontally and tap to control.");
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      this.time.desiredFps = 30;
    }
  },
  preload: function () {
    this.load.image('preloadBackground', 'assets/images/preloadBackground.jpg');
    this.load.image('story', 'assets/text/story.png');
    this.load.image('loading', 'assets/images/loading.png');
    this.load.image('oneMomentPlease', 'assets/text/oneMomentPlease.png');
  },

  create: function () {
    this.state.start('Preloader');
  }
};
