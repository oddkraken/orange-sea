var OrangeSea = {
  //declare global variables
  debug: false,
  thunder: null,
  music: null,
  waveSound: null,
  propellerSound: null,
  deadMessage: null,
  showTutorial: true, //show tutorial once when game begins
  toggleFullScreen: function() {
    if (this.scale.isFullScreen)
    {
        this.scale.stopFullScreen();
    }
    else
    {
        this.scale.startFullScreen(false);
    }
  },
  initVals: function() {
    OrangeSea.currentLevel = 0;
    OrangeSea.pearlCount = 0; //ammo
    OrangeSea.totalPearlCount = 0; //total collected
    OrangeSea.vanquished = 0; //total enemies killed
    OrangeSea.maxBalloonHp = 3; //increases at the end of levels
    OrangeSea.balloonHp = 3;
    OrangeSea.phantasmSpeech = true; //show phantasm speech once (and after each Game Over)
  }
};

var Levels = [
  {
    title: "Day One",
    subtitle: "If Pearls Were Slugs",
    fullControl: false,
    duration: 45,
    balloonDelay: 5,
    dayTime: true,
    storm: true,
    clearedMessage: '"The Orange Sea is only a few days across if the winds are charitable. What awaits me on the northern shores?"'
  },
  {
    title: "Night One",
    subtitle: "The Gale",
    duration: 60,
    balloonDelay: 4,
    dayTime: false,
    storm: false,
    phantasmDelay: 4,
    clearedMessage: '"I knew the craft seemed... otherworldly. The phantasms from the depths must have been conjured by the same Evil."'
  },
  {
    title: "Day Two",
    duration: 60,
    balloonDelay: 2,
    dayTime: true,
    storm: false,
    clearedMessage: '"The Enemy\'s numbers are growing by the day. Something tells me their haste and aggression will grow as well."'
  },
  {
    title: "Night Two",
    duration: 60,
    balloonDelay: 1,
    dayTime: false,
    storm: true,
    clearedMessage: '"The Enemy\'s numbers are growing by the day. Something tells me their haste and aggression will grow as well."'
  },
  {
    title: "Day Three",
    duration: 75,
    balloonDelay: 1,
    dayTime: true,
    storm: true,
    clearedMessage: '"The Enemy\'s numbers are growing by the day. Something tells me their haste and aggression will grow as well."'
  },
  {
    title: "Night Three",
    duration: 75,
    balloonDelay: 0.5,
    dayTime: false,
    storm: false,
    clearedMessage: '"The Enemy\'s numbers are growing by the day. Something tells me their haste and aggression will grow as well."'
  }
];

OrangeSea.Boot = function(game) {
};

OrangeSea.Boot.prototype = {
  init: function () {
    OrangeSea.initVals();
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
