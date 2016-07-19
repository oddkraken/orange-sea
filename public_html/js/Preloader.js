OrangeSea.Preloader = function(game) {
  this.loaded = false;
  this.story = null;
  this.storyTween = null; //may need to interrupt
  this.oneMomentPleaseMessage = null;
  this.spaceToContinueMessage = null;
  this.controlsMessage = null;
  this.ready = false;
  this.timer = null;
};

OrangeSea.Preloader.prototype = {
	preload: function () {
    //  We need this because the assets are on Amazon S3
    //  Remove the next 2 lines if running locally
    // this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue003/';
    //this.load.crossOrigin = 'anonymous';
    this.load.image('balloon', 'assets/images/balloon_small.png');
    this.load.image('balloonGlow', 'assets/images/balloonGlow_small.png');
    this.load.image('derelict', 'assets/images/derelict_small.png');
    this.load.image('pirateShip', 'assets/images/pirateShip_small.png');
    this.load.image('sky', 'assets/images/tallSky.jpg');
    this.load.image('skyNight', 'assets/images/tallSkyNight.jpg');
    this.load.image('stars', 'assets/images/stars.jpg');
    this.load.image('sun', 'assets/images/sun.png');
    this.load.image('fog', 'assets/images/fog.png');
    this.load.image('fish', 'assets/images/fish_sm.png');
    this.load.image('waves0', 'assets/images/waveTile0.png');
    this.load.image('waves1', 'assets/images/waveTile1.png');
    this.load.image('waves2', 'assets/images/waveTile2.png');
    // this.load.image('waves0', 'assets/images/waves0.png');
    // this.load.image('waves1', 'assets/images/waves1.png');
    // this.load.image('waves2', 'assets/images/waves2.png');
    this.load.image('cloudTile', 'assets/images/cloudTile.png');
    this.load.image('frontClouds', 'assets/images/frontClouds.png');
    this.load.image('stormCloud2', 'assets/images/stormCloud2_crop.png');
    this.load.image('rain', 'assets/images/rain5.png');
    this.load.image('lightning', 'assets/images/lightning.png');
    this.load.image('lightning2', 'assets/images/lightning2.png');
    this.load.image('cloudLightning', 'assets/images/cloudLightning.png');
    this.load.image('white', 'assets/images/white.png');
    this.load.image('glow', 'assets/images/glow.png');
    this.load.image('shadow', 'assets/images/shadow.png');
    this.load.image('boost', 'assets/images/boost.png');
    this.load.image('spectralPlane', 'assets/images/spectralPlane.jpg');
    this.load.image('clearedBackground1', 'assets/images/clearedBackground1.jpg');

    this.load.image('chapterOne', 'assets/text/chapterOne.png');
    this.load.image('spaceToContinue', 'assets/text/spaceToContinue.png');
    this.load.image('speech0', 'assets/text/speech0.png');
    this.load.image('speech1', 'assets/text/speech1.png');
    this.load.image('controls', 'assets/text/controls.png');
    this.load.image('spectralPlaneText', 'assets/text/spectralPlaneText.png');
    this.load.image('lostAtSea', 'assets/text/lostAtSea.png');
    this.load.image('lostInGloom', 'assets/text/lostInGloom.png');
    this.load.image('thanks', 'assets/text/thanks.png');

    this.load.audio('theme', 'assets/audio/theme2.mp3');
    this.load.audio('thunder', 'assets/audio/thunder2.mp3');
    this.load.audio('waveSound', 'assets/audio/waves.mp3');
    this.load.audio('splash', 'assets/audio/splash.mp3');
    this.load.audio('gust', 'assets/audio/gust.mp3');
    this.load.audio('hit', 'assets/audio/hit.mp3');
    this.load.audio('fishJump', 'assets/audio/fishJump.mp3');
    this.load.audio('explosion', 'assets/audio/explosion.mp3');
    this.load.audio('boostSound', 'assets/audio/boost.mp3');
    this.load.audio('spectralPlaneSound', 'assets/audio/spectralPlaneSound.mp3');

    if (!OrangeSea.debug) {
      //time when to display 'press space to continue' message
      this.timer = this.time.create();
      this.timer.start();
      this.timer.add(Phaser.Timer.SECOND*3, this.displayOneMomentPlease, this);

      this.preloadBackground = this.add.sprite(0, 0, 'preloadBackground');
      var fKey = this.input.keyboard.addKey(Phaser.KeyCode.F);
      fKey.onDown.add(OrangeSea.toggleFullScreen, this);
      var spaceBar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
      spaceBar.onDown.add(this.spacePressed, this);
      this.displayStoryText();

      //mobile
      this.input.onTap.add(this.spacePressed, this);
    }

    var loadingBar = this.add.sprite(0, 50, "loading");
    //loadingBar.anchor.setTo(0.5,1);
    this.load.setPreloadSprite(loadingBar,0);
	},

	create: function () {
    //set up wavesound to fade in and loop
    OrangeSea.waveSound = this.add.audio('waveSound');
    OrangeSea.waveSound.onDecoded.add(function() {
      //start silent and fade in with tween
      //fadeIn method only allows fading to volume 1.0
      OrangeSea.waveSound.loopFull(0.0);
      this.add.tween(OrangeSea.waveSound).to( { volume: 0.2 }, 2000, "Linear", true);
    }, this);
    if (OrangeSea.debug) {
      this.state.start('ChapterOne'); //skip story and control screen
    } else {
      this.loaded = true;
      if (this.oneMomentPleaseMessage) {
        this.add.tween(this.oneMomentPleaseMessage).to( { alpha: 0.0 }, 500, Phaser.Easing.Linear.None, true);
        this.displaySpaceMessage();
      }
    }
	},

  displaySpaceMessage: function() {
    if (this.loaded) {
      this.spaceToContinueMessage = this.add.sprite(0, 0, 'spaceToContinue');
      this.spaceToContinueMessage.alpha = 0;
      this.add.tween(this.spaceToContinueMessage).to( { alpha: 1.0 }, 500, Phaser.Easing.Linear.None, true);
    }
  },

  spacePressed: function() {
    if (this.loaded) {
      if (this.controlsMessage) {
        this.ready = true;
      } else {
        this.controlsMessage = this.add.sprite(0, 0, 'controls');
        this.story.alpha = 0;
        this.storyTween.stop();
        this.add.tween(this.story).to( { alpha: 0.0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.controlsMessage).to( { alpha: 1.0}, 500, Phaser.Easing.Linear.None, true);
      }
    } else {
      this.displayOneMomentPlease();
    }
  },

  //if still not loaded, display this message, otherwise, display spaceToContinue
  displayOneMomentPlease: function() {
    if (!this.loaded) {
      if (!this.oneMomentPleaseMessage) {
        this.oneMomentPleaseMessage = this.add.sprite(0, 0, 'oneMomentPlease');
        this.add.tween(this.oneMomentPleaseMessage).from( { alpha: 0.0 }, 500, Phaser.Easing.Linear.None, true);
      }
    } else {
      this.displaySpaceMessage();
    }
  },

  displayStoryText: function() {
    this.story = this.add.sprite(0, 0, 'story');
    this.storyTween = this.add.tween(this.story).from( { alpha: 0.0 }, 1000, Phaser.Easing.Linear.None, true);
  },

	update: function () {
    if (this.ready) {
      this.camera.fade(0x000000);
      this.camera.onFadeComplete.add(function(){ this.state.start('ChapterOne')}, this);
    }
	}

};
