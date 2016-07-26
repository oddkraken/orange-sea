OrangeSea.ChapterOne = function(game) {
};

OrangeSea.ChapterOne.prototype = {
  render: function() {
    if (OrangeSea.debug) {
      this.game.debug.text(this.time.fps || '--', 2, 15, "#ffffff");
      // this.game.debug.text(this.timer.ms/1000, 2, 30, "#ffffff");
      // this.game.debug.text(this.boost.x, 2, 45, "#ffffff");
      // this.game.debug.text(this.boost.body.enable, 2, 60, "#ffffff");
      //this.game.debug.text(gyro.getOrientation().gamma, 2, 45, "#ffffff");
      this.game.debug.text("Update time: " + this.perfTimeElapsed, 2, 30, "#ffffff");
      //this.game.debug.body(this.boost);
      // for (var i=0; i<this.stormClouds.length; i++) {
      //   this.game.debug.body(this.stormClouds[i], 'rgba(0,255,0,0.2)');
      // }
    }
  },

  init: function () {
  //  this.game.renderer.renderSession.roundPixels = true;
    this.world.setBounds(0, -720, 1280, 1440);
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 200;
    this.alive = null;
    this.splash = null;
    this.gust = null;
    this.windSound = null;
    this.explosion = null;
    this.hit = null;
    this.balloon = null;
    this.balloonGlowTween = null;
    this.derelict = null;
    this.sky = null;
    this.skyNight = null;
    this.stars = null;
    this.sun = null;
    this.fog = null;
    this.fish = null;
    this.anglerFish = null;
    this.fishTimer = null;
    this.lastFish = 0; //fish should only appear every so often
    this.cursors = null;
    this.waveRopes = [];
    this.waveTiles = [];
    this.rainEmitters = [];
    this.stormClouds = [];
    this.lastStormCloud = null; //last storm cloud. triggers end.
    this.over = false; //level over
    this.backClouds = null;
    this.midClouds = null;
    this.frontClouds = null;
    this.timer = null; //thunder timer
    this.lightningStrike = null;
    this.strikeTimer = null;
    this.prevStrike = 0;
    this.lightning = null;
    this.flash = null;
    this.boost = null;
    this.boostSound = null;
    this.spectralPlane = null;
    this.spectralPlaneSound = null;
    this.inSpectralPlane = false;
    this.foundSpecter = false;
    this.specterReady = false;
    this.desaturation = null;
    this.textGroup = null;
    this.chapterTitle = null;
    this.speech = null;
    this.updateFunctions = []; //update iterates through this and runs them all
    this.pearlCount = 0;
  },

  create: function () {
    this.camera.flash(0x000000, 1000); //fade in
    this.time.advancedTiming = true; //enable FPS calculation
    this.alive = true;

    // Define movement constants
    this.MAX_SPEED = 600; // pixels/second
    this.ACCELERATION = 1400; // pixels/second/second
    this.DRAG_X = 600; // pixels/second
    this.DRAG_Y = 150; // pixels/second
    this.ENV_SPEED = 1.0;
    this.FISH_INTERVAL = 5000; //wait >= 5000ms before sending another fish
    this.fishTimer = this.time.create();
    this.fishTimer.start();

    this.strikeTimer = this.time.create();
    this.strikeTimer.start();


    this.sky = this.add.tileSprite(0, -675, 1280, 1440, 'sky');
    this.skyNight = this.add.tileSprite(0, -675, 1280, 1440, 'skyNight');
    this.stars = this.add.tileSprite(0, -675, 1280, 1440, 'stars');
    this.skyNight.alpha = 0;
    this.stars.alpha = 0;
    this.stars.blendMode = PIXI.blendModes.SCREEN;
    this.updateFunctions.push(function(game) {
      //animate sky on update
      game.sky.tilePosition.x -= (0.4*game.ENV_SPEED);
      game.skyNight.tilePosition.x -= (0.4*game.ENV_SPEED);
      game.stars.tilePosition.x -= (0.4*game.ENV_SPEED);
    });

    this.sun = this.add.sprite(this.camera.width*.4, this.camera.height*-0.1, 'sun');
    this.sun.anchor.setTo(0.5,0.5);
    this.add.tween(this.sun).to( {x: this.camera.width*0.1, y: this.camera.height*0.8 }, Phaser.Timer.SECOND*200, Phaser.Easing.Linear.None, true);

    //lightning bolt
    this.lightning = this.add.sprite(this.camera.width*0.5, -200, 'lightning');
    this.lightning.anchor.setTo(0.5, 0);
    this.lightning.alpha = 0.0;

    //derelict
    this.derelict = this.add.sprite(this.camera.width*10, this.camera.height*0.15, 'derelict');
    this.derelict.anchor.setTo(0.5, 0.1);
    this.derelict.scale.setTo(0.75, 0.75);
    this.derelict.angle = 4;
    this.physics.arcade.enable(this.derelict);
    this.derelict.body.allowGravity = false;
    this.derelict.body.velocity.x = -100;
    //derelict swaying
    this.updateFunctions.push(function(game) {
      if (game.derelict.body.rotation >= 0) {
        game.derelict.body.angularAcceleration = -20;
      } else {
        game.derelict.body.angularAcceleration = 20;
      }
    });
    this.add.tween(this.derelict).to( { y: this.derelict.y + 25 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

    //back clouds
    var cloudTileImage = this.cache.getImage('cloudTile');
    this.backClouds = this.add.tileSprite(0, 125, cloudTileImage.width, cloudTileImage.height, 'cloudTile');
    this.backClouds.scale.setTo(0.7, 0.7);
    this.backClouds.alpha = 0.85;
    this.backClouds.tint = 0xeeeedd;
    this.backClouds.tilePosition.x = -1000;
    this.updateFunctions.push(function(game) {
      //animate clouds on update
      game.backClouds.tilePosition.x -= (0.8*game.ENV_SPEED/game.backClouds.scale.x);
    });

    // this.ship = this.add.sprite(this.camera.width*0.25, 200, 'pirateShip');
    // this.ship.scale.setTo(-0.5, 0.5);
    // this.ship.alpha = 0;

    //mid clouds
    this.MID_CLOUDS_Y = -160;
    this.midClouds = this.add.tileSprite(-200, -150, cloudTileImage.width, cloudTileImage.height, 'cloudTile');
    this.midClouds.alpha = 1.0;
    this.midClouds.tint = 0xeeddcc;
    this.updateFunctions.push(function(game) {
      //animate clouds on update
      game.midClouds.tilePosition.x -= (1.0*game.ENV_SPEED);
      game.midClouds.y = game.MID_CLOUDS_Y - game.camera.y/16;
    });

    // TODO waveropes scrapped until I find a way to tile them
    // this.waveRopes[0] = this.getWaveRope("waves0", -100, this.camera.height*.7, 60, 8, 1.0);
    // this.waveRopes[1] = this.getWaveRope("waves1", -50, this.camera.height*.68, 0, 10, 0.9);

    var waveTile0Image = this.cache.getImage('waves0');
    this.waveTiles[0] = this.add.tileSprite(this.camera.width/2, -655, waveTile0Image.width, waveTile0Image.height, 'waves0');
    this.waveTiles[0].angle = 1;
    this.waveTiles[0].anchor.setTo(0.5, 0);
    this.waveTiles[0].alpha = 1.0;

    var waveTile1Image = this.cache.getImage('waves1');
    this.waveTiles[1] = this.add.tileSprite(this.camera.width/2, -655, waveTile1Image.width, waveTile1Image.height, 'waves1');
    this.waveTiles[1].angle = -1;
    this.waveTiles[1].anchor.setTo(0.5, 0);
    this.waveTiles[1].alpha = 0.9;

    //boost
    this.boostSound = this.add.audio('boostSound');
    this.spectralPlaneSound = this.add.audio('spectralPlaneSound');
    this.boost = this.add.sprite(-7000, 0, 'boost');
    var boostChild = this.add.sprite(0, 0, 'boost');
    boostChild.scale.setTo(1.5, 1.5);
    boostChild.alpha = 0.25;
    this.boost.addChild(boostChild);
    this.physics.arcade.enable(boostChild);
    boostChild.body.allowGravity = false;
    boostChild.anchor.setTo(0.47, 0.58);
    boostChild.body.angularVelocity = -100;

    var boostChild2 = this.add.sprite(0, 0, 'boost');
    boostChild2.scale.setTo(1.25, 1.25);
    boostChild2.alpha = 0.25;
    this.boost.addChild(boostChild2);
    this.physics.arcade.enable(boostChild2);
    boostChild2.body.allowGravity = false;
    boostChild2.anchor.setTo(0.47, 0.58);
    boostChild2.body.angularVelocity = 50;

    this.boost.anchor.setTo(0.47, 0.58);
    this.add.tween(this.boost.scale).to( { x: 1.1, y: 1.1 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    this.boostYTween = this.add.tween(this.boost).to( { y: this.camera.height*0.8 }, 3000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    this.physics.arcade.enable(this.boost);

    this.boost.body.allowGravity = false;
    var scale = 0.25; //scale boost body
    this.boost.body.setSize(this.boost.body.width*scale, this.boost.body.height*scale,
      (this.boost.body.width-this.boost.body.width*scale)/2,
      (this.boost.body.height-this.boost.body.height*scale)/2);
    this.BOOST_SPEED = 250;
    this.boost.body.velocity.x = this.BOOST_SPEED;
    this.boost.body.angularVelocity = 50;
    this.updateFunctions.push(function(game) {
      if (game.inSpectralPlane) {
        game.boost.x = game.balloon.x-5;
        game.boost.y = game.balloon.y+20;
      } else if (game.physics.arcade.intersects(game.balloon.body, game.boost.body) && game.boost.body.enable) {
        if (!game.foundSpecter) {
          game.displaySpeech('"An ethereal being fleeing the Shadow offers to rescue me in a time of need."');
          game.foundSpecter = true;
        }
        if (!game.specterReady) {
          game.specterReady = true;
          game.balloonGlow.alpha = 0;
          game.balloonGlowTween = game.add.tween(game.balloonGlow).to( { alpha: 0.6 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
        }
        game.add.tween(game.boost).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0);
        game.add.tween(game.boost.body.velocity).to( { x: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0);
        game.boost.body.enable = false;
        if (game.balloon.x < game.camera.width*0.8) { //only boost if if won't push balloon off screen
          game.add.tween(game.balloon.body.velocity).to( { x: game.MAX_SPEED }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 0);
          game.balloon.body.acceleration.x = game.ACCELERATION;
        }
        if (!game.boostSound.isPlaying) {
          game.boostSound.play(null, null, 0.5);
        }
      } else if (game.boost.x > game.camera.width*1.5) { //only happens if you miss it
        game.boost.x = -1000+Math.random()*-1000;
      }
    });

    // balloon
    this.balloon = this.add.sprite(this.camera.width*0.5, this.camera.height*0.25, 'balloon');
    this.balloonGlow = this.add.sprite(0, 0, 'balloonGlow');
    this.balloonGlow.alpha = 0.0;
    this.balloon.addChild(this.balloonGlow);
    this.balloon.anchor.setTo(0.5, 0.1);
    this.balloonGlow.anchor.setTo(0.5, 0.1);
    this.balloon.angle = 8;
    this.physics.arcade.enable(this.balloon);
    this.balloonGlow.body.allowGravity = false;
    this.balloon.body.drag.setTo(this.DRAG_X, this.DRAG_Y);
    this.balloon.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);
    this.balloon.body.bounce = new Phaser.Point(1, 1);
    //balloon swaying
    this.updateFunctions.push(function(game) {
      if (game.balloon.body.rotation >= 0) {
        game.balloon.body.angularAcceleration = -60;
      } else {
        game.balloon.body.angularAcceleration = 60;
      }
    });

    // anglerfish
    // TODO fish to kill with pearls
    this.anglerFish = this.add.sprite(this.camera.width*2.2, this.camera.height, 'anglerBody');
    this.anglerMouth = this.add.sprite(110, 85, 'anglerMouth');
    this.anglerFish.addChild(this.anglerMouth);
    this.add.tween(this.anglerFish).to( { y: this.anglerFish.y+25 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    this.anglerFish.angle = 30;
    this.anglerFish.scale.setTo(-1, 1);
    this.anglerMouth.anchor.setTo(0.5, 0.85);
    this.anglerFish.anchor.setTo(0.5, 0.5);
    this.anglerMouth.angle = 50;
    this.add.tween(this.anglerMouth).to( { angle: 60 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    this.add.tween(this.anglerFish).to( { x: -200 }, 20000, Phaser.Easing.Linear.None, true);

    //lightning strike
    this.lightningStrike = this.add.sprite(this.camera.width*0.5, -50, 'lightning2');
    this.lightningStrike.anchor.setTo(0.5, 0);
    this.lightningStrike.alpha = 0.0;

    //front clouds
    var frontCloudTileImage = this.cache.getImage('frontClouds');
    this.FRONT_CLOUDS_Y = -600;
    this.frontClouds = this.add.tileSprite(-200, -350, frontCloudTileImage.width, frontCloudTileImage.height, 'frontClouds');
    this.frontClouds.tint = 0xffeedd;
    this.frontClouds.alpha = 1.0;
    this.updateFunctions.push(function(game) {
      //animate clouds on update
      game.frontClouds.tilePosition.x -= (1.2*game.ENV_SPEED);
      game.lightningStrike.x -= (1.2*game.ENV_SPEED);
      game.frontClouds.y = game.FRONT_CLOUDS_Y - game.camera.y/8;
    });

    this.camera.follow(this.balloon, null, 1, 0.05);
    //use short height for deadzone so camera follows balloon back down
    this.camera.deadzone = new Phaser.Rectangle(0, this.camera.height*0.25, this.camera.width, 10);

    // fish
    this.fish = this.add.sprite(this.balloon.x+200, this.camera.height, 'fish');
    this.fish.scale.setTo(0.75, 0.75);
    this.physics.arcade.enable(this.fish);
    var scale = 0.9; //scale body
    this.fish.body.setSize(this.fish.body.width*scale, this.fish.body.height*scale,
      (this.fish.body.width-this.fish.body.width*scale)/2,
      (this.fish.body.height-this.fish.body.height*scale)/2);
    this.fish.body.offset.setTo(-10, 10);
    this.fish.body.gravity.y = 1000;
    this.fish.body.mass = 10;
    this.fish.body.bounce = new Phaser.Point(0.5, 0.5);
    this.fish.isJumping = false;
    this.updateFunctions.push(function(game) {
      if (game.fish.isJumping && game.fish.y >= game.camera.height && game.fish.body.velocity.y > 0) {
        game.splash.play(null, null, 0.5);
        game.fish.isJumping = false;
      }
    });

    // init pearl
    this.pearl = this.add.sprite(Math.random()*this.camera.width, this.camera.height, 'pearl');
    this.pearlSound = this.add.audio('pearlSound');
    this.physics.arcade.enable(this.pearl);
    this.pearl.body.enable = false;
    this.pearl.body.gravity.y = 300;
    this.pearlGroup = this.add.group(undefined, 'pearlGroup');

    // TODO waveropes scrapped until I find a way to tile them
    // this.waveRopes[2] = this.getWaveRope("waves2", -150, this.camera.height*.65, -60, 12, 0.8);
    // this.startWaveRopesTweens();

    var waveTile2Image = this.cache.getImage('waves2');
    this.waveTiles[2] = this.add.tileSprite(this.camera.width/2, -655, waveTile2Image.width, waveTile2Image.height, 'waves2');
    this.waveTiles[2].angle = 1;
    this.waveTiles[2].anchor.setTo(0.5, 0);
    this.waveTiles[2].alpha = 0.8;

    this.updateFunctions.push(function(game) {
      game.waveTiles[0].tilePosition.x -= (1.0*game.ENV_SPEED+2);
      game.waveTiles[1].tilePosition.x -= (1.6*game.ENV_SPEED+2);
      game.waveTiles[2].tilePosition.x -= (2.6*game.ENV_SPEED+2);
    });
    this.startWaveTilesTweens();

    OrangeSea.music = this.add.audio('theme');
    OrangeSea.music.onDecoded.add(function() {
      OrangeSea.music.loopFull(0.2);
    }, this);

    this.splash = this.add.audio('splash');
    this.splash.allowMultiple = true; //fish and pearl may splash simultaneously
    this.gust = this.add.audio('gust');
    this.hit = this.add.audio('hit');
    this.fishJump = this.add.audio('fishJump');

    this.windSound = this.add.audio('gust', 0);
    this.explosion = this.add.audio('explosion', 0.5);

    //use fog sprite, filter is too slow
    this.fog = this.add.tileSprite(0, 0, 1280, 720, 'fog');
    this.fog.alpha = 0.25;
    this.updateFunctions.push(function(game) {
      game.fog.tilePosition.x -= (2*game.ENV_SPEED);
    });
    this.add.tween(this.fog).to( {alpha: 0.75}, Phaser.Timer.SECOND*120, Phaser.Easing.Linear.None, true, 0, 0, true);

    //set up lightning flash
    this.flash = this.add.sprite(0, -720, 'white');
    this.flash.scale.setTo(1, 2);
    this.flash.alpha = 0;
    if (this.game.renderType == Phaser.CANVAS) { //not supported in WEBGL yet
      this.desaturation = this.add.sprite(0, 0, 'white');
      this.desaturation.alpha = 0;
      this.flash.blendMode = PIXI.blendModes.OVERLAY;
      this.desaturation.blendMode = PIXI.blendModes.SATURATION;
    }

    this.timer = this.time.create();
    OrangeSea.thunder = this.add.audio('thunder');
    OrangeSea.thunder.onDecoded.add(function() {
      //synchronize lightning events with thunder
      var duration = 90; //hard-coding total duration of thunder file
      for (var i=0; i<3; i++) { //thunder sound will loop 3 times
        this.timer.add(Phaser.Timer.SECOND*(duration*i + 4), this.flashLightning, this, 1.0);
        if (i != 2) { //skip last two bolts because storm is over
          this.timer.add(Phaser.Timer.SECOND*(duration*i + 20), this.flashLightning, this, 1.0);
          this.timer.add(Phaser.Timer.SECOND*(duration*i + 64.5), this.flashLightning, this, 1.0);
        }
      }
      OrangeSea.thunder.fadeIn(6000, true);
      this.timer.start();
    }, this);

    //gradually increase rain
    for (var i=1; i<=10; i++) {
      this.timer.add(Phaser.Timer.SECOND*(3+2*i), this.addRainEmitter, this, -150 + 10*i);
    }

    //send storm clouds
    this.stormCloudGroup = this.add.group(undefined, 'stormCloudGroup');
    var secondsBetweenClouds = 5;
    var cloudStartTime = 15;
    var minInterval = 0.7;
    var numStormClouds = 130;
    for (var i=0; i<numStormClouds; i++) {
      if (secondsBetweenClouds > minInterval) {
        secondsBetweenClouds -= 0.1; //gradually increase frequency until 1.0 cloud/sec
      } else if (secondsBetweenClouds != minInterval) {
        secondsBetweenClouds = minInterval;
      }
      var lastOne = false; //last cloud triggers end of level
      if (i == numStormClouds - 1) {
        lastOne = true;
      }
      this.timer.add(Phaser.Timer.SECOND*(cloudStartTime+secondsBetweenClouds), this.sendStormCloud, this, lastOne);
      cloudStartTime += secondsBetweenClouds;
      //console.log(cloudStartTime + ", " + secondsBetweenClouds);
    }
    console.log("Last cloud starting at " + cloudStartTime);

    //send pearls
    this.timer.add(Phaser.Timer.SECOND*10, this.sendPearl, this);
    this.timer.add(Phaser.Timer.SECOND*12, this.displaySpeech, this, '"A colossal mollusk lobs pearls from the depths! These curiosities may prove useful..." Press Space to drop a pearl.');

    //spectral plane in front of everything
    this.spectralPlane = this.add.tileSprite(0, -720, 1280, 1440, 'spectralPlane');
    this.spectralPlane.blendMode = PIXI.blendModes.SCREEN;
    this.spectralPlane.alpha = 0.0;
    this.updateFunctions.push(function(game){
      game.spectralPlane.tilePosition.x += 1;
      game.spectralPlane.tilePosition.y -= 1;
    });

    this.timer.add(Phaser.Timer.SECOND*cloudStartTime, function() {
      this.add.tween(this.stars).to( { alpha: 1.0 }, 10000, Phaser.Easing.Linear.None, true);
      this.add.tween(this.skyNight).to( { alpha: 1.0 }, 20000, Phaser.Easing.Linear.None, true);
    }, this);

    //storm cloud movement and balloon pushing
    this.updateFunctions.push(function(game) {
      for (var i=0; i<game.stormClouds.length; i++) {
        var stormCloudSprite = game.stormClouds[i];
        if (Phaser.Rectangle.containsRect(game.balloon.body, stormCloudSprite.body)) {
          if (!game.inSpectralPlane) {
            game.balloon.body.acceleration.x += stormCloudSprite.speed*10;
          }
          if (!game.windSound.isPlaying) {
            game.windSound.play(null, null, 0.05);
          }
        }
      }
      //parallax effect
      game.stormCloudGroup.y = -game.camera.y/8;
    });

    //evil shadow
    this.shadow = this.add.sprite(-100, 0, 'shadow');
    this.shadow.alpha = 0.0;
    this.updateFunctions.push(function(game) {
      if (game.balloon.x < 300 && game.balloon.x > 0) {
        game.shadow.alpha = (300 - game.balloon.x) / 300;
        game.shadow.x = -game.balloon.x / 4;
      }
    });

    //text group
    this.textGroup = this.add.group(undefined, 'textGroup');
    //pearl count text
    this.pearlCountText = this.add.text(0, -50, "10", { font: "48px great_victorianstandard", fill: "white" } );
    this.pearlCountText.anchor.setTo(0.5, 0.5);
    this.pearlCountText.alpha = 0;

    //display chapter title
    this.timer.add(Phaser.Timer.SECOND*2, this.displayChapterTitle, this);

    //TODO redo speech0 with webfont
    //this.timer.add(Phaser.Timer.SECOND*48, this.displaySpeech, this, 'speech0');

    //init cursors
    this.cursors = this.input.keyboard.createCursorKeys();
    var fKey = this.input.keyboard.addKey(Phaser.KeyCode.F);
    var mKey = this.input.keyboard.addKey(Phaser.KeyCode.M);
    var pKey = this.input.keyboard.addKey(Phaser.KeyCode.P);
    var esc = this.input.keyboard.addKey(Phaser.KeyCode.ESC);
    var spaceBar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    fKey.onDown.add(OrangeSea.toggleFullScreen, this);
    mKey.onDown.add(function(){ this.sound.mute = !this.sound.mute; }, this);
    pKey.onDown.add(this.togglePause, this);
    esc.onDown.add(this.togglePause, this);
    spaceBar.onDown.add(this.dropPearl, this);

    //mobile
    this.input.onDown.add(function() {this.pointerDown = true;}, this);
    this.input.onUp.add(function() {this.pointerDown = false;}, this);
  },

  dropPearl: function() {
    if (this.pearlCount > 0) {
      this.pearlCount--;
      this.showPearlCount();
      var droppedPearl = this.add.sprite(this.balloon.x, this.balloon.y+50, 'pearl');
      this.pearlGroup.add(droppedPearl);
      this.physics.arcade.enable(droppedPearl);
      droppedPearl.body.velocity.x = this.balloon.body.velocity.x/2;
      droppedPearl.body.velocity.y = this.balloon.body.velocity.y/2;
      droppedPearl.body.gravity.y = 300;
    }
  },

  //send pearl and destroy if caught or falls back in the water
  sendPearl: function() {
    this.fishJump.play(null, null, 0.5);
    this.pearl.body.reset(this.pearl.x, this.pearl.y);
    this.pearl.x = Math.random()*this.camera.width*0.8;
    this.pearl.y = this.camera.height;
    this.pearl.body.enable = true;
    //this.pearl.body.velocity.y = -1100 + Math.random()*400; // [-1100, -700)
    this.pearl.body.velocity.y = -900 + Math.random()*400;
    this.pearl.body.velocity.x = Math.random()*300;
    if (this.pearl.x > (this.camera.width*.4)) {
      this.pearl.body.velocity.x *= -1;
    }
    console.log(this.pearl.x);
    var caught = false;

    //catch or splash and destroy
    this.updateFunctions.push(function(game) {
      if (game.physics.arcade.intersects(game.balloon.body, game.pearl.body) && game.pearl.body.enable) {
        //show pearl count text
        game.pearlCount++;
        game.showPearlCount();

        game.pearlSound.play(null, null, 0.5);
        game.pearl.y = game.camera.height;
        game.pearl.body.enable = false;
        if (!game.over) {
          game.timer.add(Phaser.Timer.SECOND*(10*Math.random()), function() {
            this.sendPearl();
          }, game);
        }

      } else if (game.pearl.body.enable && game.pearl.y > game.camera.height) {
        game.splash.play(null, null, 0.5);
        game.pearl.body.enable = false;
        if (!game.over) {
          game.timer.add(Phaser.Timer.SECOND*(10*Math.random()), function() {
            this.sendPearl();
          }, game);
        }
      }
    });
  },

  showPearlCount: function() {
    this.pearlCountText.setText(this.pearlCount);
    this.pearlCountText.x = this.balloon.x;
    this.pearlCountText.y = this.balloon.y;
    this.pearlCountText.alpha = 1.0;
    this.add.tween(this.pearlCountText).to( {y: this.pearlCountText.y - 100, alpha: 0}, 2000, null, true);
  },

  // user may become invincible briefly after collecting specters
  enterSpectralPlane: function() {
    this.balloonGlowTween.stop();
    this.inSpectralPlane = true;
    this.specterReady = false;
    this.add.tween(this.balloon).to( { alpha: 0.4 }, 500, Phaser.Easing.Sinusoidal.InOut, true);
    this.add.tween(this.stormCloudGroup).to( { alpha: 0.6 }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
    this.add.tween(this.balloonGlow).to( { alpha: 0.9 }, 500, Phaser.Easing.Sinusoidal.InOut, true);
    this.add.tween(this.boost).to( { alpha: 1.0 }, 500, Phaser.Easing.Linear.None, true); //use boost as balloon "glow" while in spectral plane
    this.boostYTween.pause();
    this.add.tween(this.spectralPlane).to( { alpha: 0.5 }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
    if (!this.spectralPlaneSound.isPlaying) {
      this.spectralPlaneSound.play(null, null, 0.5);
    }
    this.timer.add(7*Phaser.Timer.SECOND, function() {
      this.inSpectralPlane = false;
      this.add.tween(this.balloon).to( { alpha: 1.0 }, 500, Phaser.Easing.Sinusoidal.InOut, true);
      this.add.tween(this.stormCloudGroup).to( { alpha: 1.0 }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
      this.add.tween(this.balloonGlow).to( { alpha: 0 }, 500, Phaser.Easing.Sinusoidal.InOut, true);
      var fadeOutTween = this.add.tween(this.boost).to( { alpha: 0.0 }, 100, Phaser.Easing.Linear.None, true);
      var moveTween = this.add.tween(this.boost).to( { x: -100 }, 100, Phaser.Easing.Linear.None, false);
      fadeOutTween.chain(moveTween); //fade out boost and move it off screen
      this.add.tween(this.spectralPlane).to( { alpha: 0 }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
      //after leaving spectral plane, time next specter
      var randSeconds = Math.random()*20; //between 0 and 20 seconds
      this.timer.add(randSeconds*Phaser.Timer.SECOND, function() {
        this.boostYTween.resume();
        this.boost.alpha = 1.0;
        this.boost.body.velocity.x = this.BOOST_SPEED;
        this.boost.body.enable = true;
      }, this);
    }, this);
  },

  sendFish: function() {
    if (this.fishTimer.ms - this.lastFish > this.FISH_INTERVAL) {
      this.fishJump.play();
      this.fish.isJumping = true;
      //direction based on balloon x. don't want to push player forward off screen
      var direction;
      if (this.balloon.x > this.camera.width*0.75) {
        direction = 1;
      } else {
        direction = Math.random() > 0.5 ? 1 : -1
      }
      var fishDistance = Math.random() > 0.75 ? 100 : 300;
      this.fish.x = this.balloon.x+fishDistance*direction;
      this.fish.y = this.camera.height;
      this.fish.body.reset(this.fish.x, this.fish.y);
      this.lastFish = this.fishTimer.ms;
      //account for ENV speed
      if (direction == -1) {
        this.fish.body.velocity.x=-direction*400;
      } else {
        this.fish.body.velocity.x=-direction*500;
      }
      this.fish.body.velocity.y=-700;
      this.fish.angle = direction*70;
      this.fish.body.angularVelocity = -direction*110;
      this.fish.outOfBoundsKill = true;
      if (direction == -1) {
        this.fish.scale.setTo(-0.75, 0.75);
      } else {
        this.fish.scale.setTo(0.75, 0.75);
      }
    }
  },

  sendStormCloud: function(lastOne) {
    var cloudImage = 'stormCloud2';
    var stormCloudSprite = this.add.sprite(this.camera.width*2, 0, cloudImage);
    this.stormCloudGroup.add(stormCloudSprite);
    stormCloudSprite.tint = 0xffeedd;
    var reverse = Math.random() > 0.5 ? 1 : -1; //flip horizontally half of the time
    this.physics.arcade.enable(stormCloudSprite);
    stormCloudSprite.body.allowGravity = false;
    var scale = 0.8; //scale body
    stormCloudSprite.body.setSize(stormCloudSprite.body.width*scale, stormCloudSprite.body.height*scale,
      (stormCloudSprite.body.width-stormCloudSprite.body.width*scale)/2,
      (stormCloudSprite.body.height-stormCloudSprite.body.height*scale)/2);

    stormCloudSprite.anchor.setTo(0.5, 0.5);
    stormCloudSprite.alpha = Math.random()*0.2 + 0.8;
    var randScale = Math.random()/2 + 0.5; //[0.5, 1)
    stormCloudSprite.scale.setTo(reverse*randScale, randScale);
    var randHeight = this.balloon.y + Math.random()*200 - 100;
    stormCloudSprite.x = this.camera.width + Math.abs(stormCloudSprite.width);
    stormCloudSprite.y = randHeight;
    stormCloudSprite.speed = -120*Math.random() - 120; // [-120, -240)
    stormCloudSprite.body.velocity.x = stormCloudSprite.speed*2;
    stormCloudSprite.body.drag.setTo(0,0);

    if (lastOne) {
      //trigger end of level
      this.lastStormCloud = stormCloudSprite;
      this.updateFunctions.push(function(game) {
        if (!game.over && game.lastStormCloud.x < 0) {
          game.over = true;
          //fade in glow
          var glow = game.add.sprite(game.camera.width, 0, 'glow');
          glow.alpha = 0.0;
          glow.anchor.setTo(1, 0);
          var fadeIn = game.add.tween(glow).to( { alpha: 1.0 }, 2000, Phaser.Easing.Linear.None, true);
          var blink = game.add.tween(glow).to( { alpha: 0.5 }, 1000, Phaser.Easing.Linear.None, false, 0, -1, true);
          fadeIn.chain(blink);
          for (var i=0; i<game.rainEmitters.length; i++) {
            game.timer.add(Phaser.Timer.QUARTER*i, function() {
              this.on = false;
            }, game.rainEmitters[i]);
          }
          OrangeSea.thunder.fadeOut(6000, true);
          game.add.tween(game.backClouds).to( { alpha: 0 }, 4000, Phaser.Easing.Linear.None, true);
          game.add.tween(game.midClouds).to( { alpha: 0 }, 4000, Phaser.Easing.Linear.None, true);
          game.add.tween(game.frontClouds).to( { alpha: 0 }, 4000, Phaser.Easing.Linear.None, true);
        }
      });
    }

    //destroy storm cloud when done
    this.timer.add(40*Phaser.Timer.SECOND, function(){
      stormCloudSprite.destroy();
      var index = this.stormClouds.indexOf(stormCloudSprite);
      this.stormClouds.splice(index, 1);
    }, this);

    this.stormClouds.push(stormCloudSprite);
  },

  togglePause: function() {
    if (this.game.paused) {
      this.game.paused = false;
    } else {
      this.game.paused = true;
    }
  },

  addRainEmitter: function(height) {
    var emitter = this.add.emitter(this.world.centerX, height, 90);
  	emitter.width = this.world.width*1.2;
  	emitter.makeParticles('rain');
  	emitter.minParticleScale = 0.1;
  	emitter.maxParticleScale = 0.4;
  	emitter.setYSpeed(600, 1000);
  	emitter.setXSpeed(-100, -100);
  	emitter.minRotation = 10;
  	emitter.maxRotation = 10;
    emitter.setAlpha(.3, .6);
  	emitter.start(false, 1600, 1, 0);
    this.rainEmitters.push(emitter);
  },

  displayChapterTitle: function() {
    //fade in chapter title
    var titleText;
    if (OrangeSea.deadMessage) {
      titleText = this.add.text(this.camera.width/2, this.camera.height/2, OrangeSea.deadMessage, { font: "90px great_victorianstandard", fill: "white" } );
      titleText.anchor.setTo(0.5, 0.5);
    } else {
      titleText = this.add.text(this.camera.width/2, 296, "Part One", { font: "72px great_victorianstandard", fill: "white" } );
      titleText.anchor.setTo(0.5, 0.5);
      var partTitle = this.add.text(0, 56, "The Squall", { font: "120px great_victorianstandard", fill: "white" } );
      partTitle.anchor.setTo(0.5, 0.5);
      titleText.addChild(partTitle);
    }
    titleText.fixedToCamera = true;
    this.textGroup.add(titleText);
    var fadeIn = this.add.tween(titleText).from( { alpha: 0.0 }, 2000, Phaser.Easing.Linear.None, true);
    var fadeOut = this.add.tween(titleText).to({ alpha: 0.0 }, 2000, Phaser.Easing.Linear.None, false, 2000);
    fadeIn.chain(fadeOut);
  },

  displaySpeech: function(speechText) {
    //fade in speech
    var style = { font: "50px great_victorianstandard", fill: "white", wordWrap: true, wordWrapWidth: this.camera.width*.6, align: "center" };
    this.speech = this.add.text(this.camera.width/2, this.camera.height*.8, speechText, style);
    this.speech.anchor.setTo(0.5, 0.5);
    this.speech.fixedToCamera = true;
    this.textGroup.add(this.speech);
    this.speech.bringToTop();
    var fadeIn = this.add.tween(this.speech).from( { alpha: 0.0 }, 2000, Phaser.Easing.Linear.None, true);
    var fadeOut = this.add.tween(this.speech).to({ alpha: 0.0 }, 2000, Phaser.Easing.Linear.None, false, 8000);
    fadeIn.chain(fadeOut);
  },

  flashLightning: function(brightness) {
    this.flash.alpha = brightness;
    this.flash.bringToTop();
    var fadeInFlash = this.add.tween(this.flash).from( {alpha: 0.0}, 100, Phaser.Easing.Exponential.In, true);
    var fadeOutFlash = this.add.tween(this.flash).to( {alpha: 0.0}, 500, Phaser.Easing.Exponential.Out, false, 50);
    fadeInFlash.chain(fadeOutFlash);
    if (this.desaturation) {
      this.desaturation.alpha = brightness;
      var fadeInDesaturation = this.add.tween(this.desaturation).from( {alpha: 0.0}, 100, Phaser.Easing.Exponential.In, true);
      var fadeOutDesaturation = this.add.tween(this.desaturation).to( {alpha: 0.0}, 500, Phaser.Easing.Exponential.Out, false, 50);
      fadeInDesaturation.chain(fadeOutDesaturation);
    }
    //get random size, scale, and location for lightning, and tween it
    var scale = Math.random() * (1.2-0.75) + 0.75;
    var angle = 45 * (scale - 0.75) * (1 / (1.2 - 0.75));
    if (Math.random() > 0.5) angle = -angle;
    this.lightning.x =Math.random()*this.camera.width/2+this.camera.width/4;
    this.lightning.scale.setTo(scale, scale);
    this.lightning.angle = angle;
    this.lightning.alpha = 1.0;
    var fadeInLightning = this.add.tween(this.lightning).from( {alpha: 0.0}, 100, Phaser.Easing.Linear.None, true, 0);
    var fadeOutLightning = this.add.tween(this.lightning).to( {alpha: 0.0}, 500, Phaser.Easing.Linear.None, false, 100);
    fadeInLightning.chain(fadeOutLightning);
  },

  getWaveRope: function(image, x, y, frequencyOffset, magnitude, alpha) {
    var count = 0;
    var length = this.cache.getImage(image).width / 20;
    var points = [];
    for (var i = 0; i < 20; i++)
    {
      points.push(new Phaser.Point(i * length, 0));
    }
    var waveRope = this.add.rope(x, y, image, null, points);
    waveRope.scale.set(1.1);
    waveRope.alpha = alpha;
    waveRope.updateAnimation = function() {
      count += 0.05;
      for (var i = 0; i < this.points.length; i++)
      {
        this.points[i].y = Math.sin(i * 0.5 + count + frequencyOffset) * magnitude;
      }
    };
    return waveRope;
  },

  startWaveRopesTweens: function() {
    var tween = this.add.tween(this.waveRopes[0]).to( { x: -50 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1);
    tween.yoyo(true, 0);
    tween = this.add.tween(this.waveRopes[1]).to( { x: -100 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1);
    tween.yoyo(true, 0);
    tween = this.add.tween(this.waveRopes[2]).to( { x: -10 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1);
    tween.yoyo(true, 0);
  },

  startWaveTilesTweens: function() {
    //up and down
    var tween = this.add.tween(this.waveTiles[0]).to( { y: this.waveTiles[0].position.y+10 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1);
    tween.yoyo(true, 0);
    tween = this.add.tween(this.waveTiles[1]).to( { y: this.waveTiles[1].position.y+-10 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1);
    tween.yoyo(true, 0);
    tween = this.add.tween(this.waveTiles[2]).to( {  y: this.waveTiles[2].position.y+10 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1);
    tween.yoyo(true, 0);
    //angle
    tween = this.add.tween(this.waveTiles[0]).to( { angle: -this.waveTiles[0].angle }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1);
    tween.yoyo(true, 0);
    tween = this.add.tween(this.waveTiles[1]).to( { angle: -this.waveTiles[1].angle }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1);
    tween.yoyo(true, 0);
    tween = this.add.tween(this.waveTiles[2]).to( { angle: -this.waveTiles[2].angle }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1);
    tween.yoyo(true, 0);
  },

  update: function () {
    var perfTimeStart = window.performance.now();
    // this.ship.y = this.waveRopes[0].y + this.waveRopes[0].points[5].y - 105;
    // this.ship.x += 0.5;

    //fish collision
    if (!this.inSpectralPlane) {
      this.physics.arcade.collide(this.balloon, this.fish, function(balloon, fish) {
        if (!this.hit.isPlaying) {
          this.hit.play(null, null, 0.4);
        }
      }, null, this);
    }
    if (this.balloon.y > 450 && this.balloon.y <= 650) {
      this.sendFish();
    }

    if (this.alive) {
      this.steerBalloon();
      this.ENV_SPEED = 1 + (5 * this.balloon.x / this.camera.width);
    }

    for (var i = 0; i < this.updateFunctions.length; i++) {
      this.updateFunctions[i](this);
    }

    //balloon world limits
    if (this.balloon.x > this.camera.width*0.8 && this.balloon.body.velocity.x > 0 && !this.over) {
      this.balloon.body.acceleration.x = -this.ACCELERATION;
    }
    if (this.balloon.y < 0) {
      if (this.balloon.body.velocity.y < 0) {
        this.balloon.body.acceleration.y = this.ACCELERATION;
      }
      if (this.balloon.y < -100 && !this.inSpectralPlane) { //STRUCK BY LIGHTNING!
        this.strike();
      }
    }

    //WINNING
    if (this.balloon.x > this.camera.width*1.1 && this.over && this.alive) {
      ga('send', 'event', 'cleared');
      this.balloon.body.immovable = true;
      this.camera.fade(0x000000);
      this.camera.onFadeComplete.add(function(){ this.state.start('Cleared')}, this);
      this.alive = false;
    }

    //dying
    if (this.balloon.y > 650 && this.alive && !this.inSpectralPlane) {
      //specter saves you!
      if (this.specterReady) {
        this.balloon.body.acceleration.y = -this.ACCELERATION;
        this.balloon.body.velocity.y = -this.MAX_SPEED;
        this.enterSpectralPlane();
      } else {
        ga('send', 'event', 'dead', 'lostAtSea');
        OrangeSea.deadMessage = 'He was lost at sea.';
        this.splash.play(null, null, 0.5);
        //this.windSound.pause();
        OrangeSea.thunder.fadeOut(500);
        OrangeSea.music.fadeOut(500);
        this.camera.fade(0x000000);
        this.camera.onFadeComplete.add(function(){
          this.state.start('ChapterOne');
        }, this);
        this.alive = false;
        this.balloon.body.acceleration.x = 0;
        this.balloon.body.acceleration.y = 0;
      }
    }
    if (this.balloon.x < -300 && this.alive && !this.inSpectralPlane) {
      //specter saves you!
      if (this.specterReady) {
        this.balloon.x = 0;
        this.balloon.body.acceleration.x = this.ACCELERATION;
        this.balloon.body.velocity.x = this.MAX_SPEED;
        this.enterSpectralPlane();
      } else {
        ga('send', 'event', 'dead', 'lostInShadow');
        this.balloon.body.immovable = true;
        OrangeSea.deadMessage = 'He was lost in the Shadow.';
        //this.windSound.pause();
        this.gust.play(null, null, 0.25);
        OrangeSea.thunder.fadeOut(500);
        OrangeSea.music.fadeOut(500);
        this.camera.fade(0x000000);
        this.camera.onFadeComplete.add(function(){
          this.state.start('ChapterOne');
        }, this);
        this.alive = false;
      }
    }

    this.perfTimeElapsed = window.performance.now() - perfTimeStart;
  },

  steerBalloon: function() {
    if (this.game.device.desktop) {
      if (this.cursors.up.isDown) {
        this.balloon.body.acceleration.y = -this.ACCELERATION;
      } else if (this.cursors.down.isDown) {
        this.balloon.body.acceleration.y = this.ACCELERATION;
      } else {
        this.balloon.body.acceleration.y = 0;
      }

      if (this.cursors.right.isDown) {
        this.balloon.body.acceleration.x = this.ACCELERATION;
      }
      else if (this.cursors.left.isDown) {
        this.balloon.body.acceleration.x = -this.ACCELERATION;
      }
      else {
        this.balloon.body.acceleration.x = 0;
      }
    } else { //mobile control
      if (this.pointerDown) { //mobile or mouse control
        var xDiff = this.input.position.x - this.balloon.x;
        var yDiff = this.input.position.y - this.balloon.y;
        var hypotenuse = Math.sqrt(xDiff*xDiff + yDiff*yDiff);
        this.balloon.body.acceleration.x = this.ACCELERATION*xDiff / hypotenuse;
        this.balloon.body.acceleration.y = this.ACCELERATION*yDiff / hypotenuse;
      } else {
        this.balloon.body.acceleration.x = 0;
        this.balloon.body.acceleration.y = 0;
      }
    }
  },

  strike: function() {
    var now = this.strikeTimer.ms;
    if (now - this.prevStrike > 10000 && !this.over) { // wait at least 10 seconds between strikes
      this.explosion.play();
      this.camera.shake(0.003);
      this.balloon.body.velocity.y = this.MAX_SPEED;
      this.balloon.body.acceleration.y = this.ACCELERATION;
      this.prevStrike = now;

      var brightness = 1.0;
      this.flash.bringToTop();
      this.flash.alpha = brightness;
      var fadeInFlash = this.add.tween(this.flash).from( {alpha: 0.0}, 100, Phaser.Easing.Exponential.In, true);
      var fadeOutFlash = this.add.tween(this.flash).to( {alpha: 0.0}, 500, Phaser.Easing.Exponential.Out, false, 50);
      fadeInFlash.chain(fadeOutFlash);
      if (this.desaturation) {
        this.desaturation.alpha = brightness;
        var fadeInDesaturation = this.add.tween(this.desaturation).from( {alpha: 0.0}, 100, Phaser.Easing.Exponential.In, true);
        var fadeOutDesaturation = this.add.tween(this.desaturation).to( {alpha: 0.0}, 500, Phaser.Easing.Exponential.Out, false, 50);
        fadeInDesaturation.chain(fadeOutDesaturation);
      }
      //get random size, scale, and location for lightning, and tween it
      var scale = Math.random()*0.2 + 1;
      var reverse = Math.random() > 0.5 ? 1 : -1;
      //var angle = 45 * (scale - 0.75) * (1 / (1.2 - 0.75));
      //if (Math.random() > 0.5) angle = -angle;
      this.lightningStrike.x = this.balloon.x;
      this.lightningStrike.y = -this.camera.height*.55;
      this.lightningStrike.scale.setTo(reverse*scale, scale);
      //this.lightningStrike.angle = angle;
      this.lightningStrike.alpha = 1.0;
      var fadeInLightning = this.add.tween(this.lightningStrike).from( {alpha: 0.0}, 100, Phaser.Easing.Linear.None, true, 0);
      var fadeOutLightning = this.add.tween(this.lightningStrike).to( {alpha: 0.0}, 500, Phaser.Easing.Linear.None, false, 100);
      fadeInLightning.chain(fadeOutLightning);
    }
  }
};
