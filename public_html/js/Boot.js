var OrangeSea = {
  //declare global variables
  debug: false,
  thunder: null,
  music: null,
  waveSound: null,
  deadMessage: null,
  showTutorial: true, //show tutorial once when game begins
  currentLevel: 0,
  pearlCount: 0, //ammo
  totalPearlCount: 0, //total collected
  vanquished: 0, //total enemies killed
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

var Levels = [
  {
    title: "Day One",
    duration: 45,
    balloonDelay: 10,
    dayTime: true,
    storm: true
  },
  {
    title: "Night One",
    duration: 45,
    balloonDelay: 8,
    dayTime: false,
    storm: false
  },
  {
    title: "Day Two",
    duration: 60,
    balloonDelay: 6,
    dayTime: true,
    storm: false
  },
  {
    title: "Night Two",
    duration: 60,
    balloonDelay: 4,
    dayTime: false,
    storm: true
  },
  {
    title: "Day Three",
    duration: 75,
    balloonDelay: 2,
    dayTime: true,
    storm: true
  },
  {
    title: "Night Three",
    duration: 75,
    balloonDelay: 1,
    dayTime: false,
    storm: false
  }
];

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
