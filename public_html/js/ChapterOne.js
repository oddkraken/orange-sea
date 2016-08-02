OrangeSea.ChapterOne = function(game) {
};

OrangeSea.ChapterOne.prototype = {
  render: function() {
    if (OrangeSea.debug) {
      this.game.debug.text(this.time.fps || '--', 2, 15, "#ffffff");
      this.game.debug.text(this.timer.ms/1000, 2, 30, "#ffffff");
      // this.game.debug.text(this.badBalloonGroup.total, 2, 30, "#ffffff");
      //this.game.debug.text(gyro.getOrientation().gamma, 2, 45, "#ffffff");
      //this.game.debug.text("Update time: " + this.perfTimeElapsed, 2, 30, "#ffffff");
      //this.game.debug.body(this.balloon);
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
    this.badBalloon = null;
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
    this.desaturation = null;
    this.textGroup = null;
    this.chapterTitle = null;
    this.speech = null;
    this.updateFunctions = []; //update iterates through this and runs them all
    this.pearlCount = 0; //ammo
    this.totalPearlCount = 0; //total collected
    this.pearlThrowDirection = 1;
    this.gameEndTime = 60;
    this.escapedBalloons = 0;
    this.glow = null; //end game glow
  },

  create: function () {
    this.camera.flash(0x000000, 1000); //fade in
    this.time.advancedTiming = true; //enable FPS calculation
    this.alive = true;

    // Define movement constants
    this.MAX_SPEED = 600; // pixels/second
    this.ACCELERATION = 2000; // pixels/second/second
    this.DRAG_X = 1200; // pixels/second
    this.DRAG_Y = 1200; // pixels/second
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

    this.sun = this.add.sprite(this.camera.width*.4, this.camera.height*-0.3, 'sun');
    this.sun.anchor.setTo(0.5,0.5);

    //lightning bolt
    this.lightning = this.add.sprite(this.camera.width*0.5, -200, 'lightning');
    this.lightning.anchor.setTo(0.5, 0);
    this.lightning.alpha = 0.0;

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

    // init pearl
    this.pearlSound = this.add.audio('pearlSound');
    this.thrownPearlGroup = this.add.group(undefined, 'thrownPearlGroup');
    this.lobbedPearlGroup = this.add.group(undefined, 'lobbedPearlGroup');

    // balloon
    this.balloon = this.add.sprite(this.camera.width*0.5, this.camera.height*0.25, 'balloon');
    this.balloon.anchor.setTo(0.5, 0.1);
    this.balloon.angle = 8;
    this.physics.arcade.enable(this.balloon);
    this.balloon.body.allowGravity = false;
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

    this.badBalloonGroup = this.add.group(undefined, 'badBalloonGroup');

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
    this.gunshot = this.add.audio('gunshot');
    this.gunshot.allowMultiple = true;
    this.pop = this.add.audio('pop');
    this.pop.allowMultiple = true;
    this.click = this.add.audio('click');
    this.click.allowMultiple = true;
    this.gust = this.add.audio('gust');
    this.hit = this.add.audio('hit');
    this.fishJump = this.add.audio('fishJump');
    this.deadSound = this.add.audio('dead');

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

    //bad balloon behavior
    this.updateFunctions.push(function(game) {
      //destroy offscreen balloons
      game.badBalloonGroup.filter(function(balloon) {
        //3 escaped balloons triggers loss!
        if (balloon.x < -100 && !balloon.popped) {
          game.escapedBalloons++;
          if (game.escapedBalloons >= 1) {
            ga('send', 'event', 'dead', 'balloonEscaped');
            OrangeSea.deadMessage = 'The Shadow consumed all.';
            game.deadSound.play(null, null, 0.5);
            OrangeSea.thunder.fadeOut(500);
            OrangeSea.music.stop();
            game.camera.fade(0x000000);
            game.camera.onFadeComplete.add(function(){
              game.state.start('ChapterOne');
            }, game);
            game.alive = false;
            game.balloon.body.acceleration.x = 0;
            game.balloon.body.acceleration.y = 0;
          }
        }
        return (balloon.x < -100 || balloon.y > game.camera.height);
      }).callAll('destroy');
      //update all badBalloons
      game.badBalloonGroup.forEach(function(child) {
        if (child.body.rotation >= 0) {
          child.body.angularAcceleration = -60;
        } else {
          child.body.angularAcceleration = 60;
        }
        game.physics.arcade.collide(game.balloon, child, function() { game.hit.play(null, null, 0.2); });
        game.thrownPearlGroup.forEach(function(pearl) {
          if (game.physics.arcade.intersects(pearl, child) && !child.popped) {
            game.pop.play(null, null, 0.25);
            child.popped = true;
            var balloonHole = game.add.sprite(0, 10, 'balloonHole');
            balloonHole.anchor.setTo(0.5, 0.5);
            child.addChild(balloonHole);
            typeof child.onPopped === 'function' && child.onPopped(game);
            child.body.acceleration.y = 100;
            child.body.velocity.y = 200;
            child.body.velocity.x = pearl.body.velocity.x*.25;
            child.tween.stop();
          }
          if (pearl.x > game.camera.width || pearl.y > game.camera.height) {
            pearl.destroy();
          }
        });
      });
    });

    //pearl behavior
    this.updateFunctions.push(function(game) {
      game.lobbedPearlGroup.forEach(function(pearl) {
        if (game.physics.arcade.intersects(game.balloon.body, pearl.body)) {
          //show explanation if first pearl
          if (game.totalPearlCount == 0 && OrangeSea.showTutorial) {
            game.displaySpeech('"A colossal mollusk lobs pearls from the depths! These will have to suffice..."\nPress Space to fire.', 5);
          }
          //show pearl count text
          game.totalPearlCount++;
          game.pearlCount++;
          game.showPearlCount();
          game.pearlSound.play(null, null, 0.5);
          pearl.destroy();
        } else if (pearl.y > game.camera.height) {
          game.splash.play(null, null, 0.5);
          pearl.destroy();
        }
      });
    });

    //send bad balloon
    if (OrangeSea.showTutorial) {
      this.beginTutorial();
    } else {
      this.sendPearl();
      this.startGame();
    }

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
    spaceBar.onDown.add(this.throwPearl, this);

    //mobile
    this.input.onDown.add(function() {this.pointerDown = true;}, this);
    this.input.onUp.add(function() {this.pointerDown = false;}, this);
    this.input.onTap.add(this.throwPearl, this);
  },

  beginTutorial: function() {
    this.tutorialInProgress = true;
    this.timer.add(Phaser.Timer.SECOND*8, this.displaySpeech, this, '"A servant of the Shadow approaches! I must not let it pass. If only I had some ammunition..."', 5);
    //send pearls
    this.timer.add(Phaser.Timer.SECOND*18, this.sendPearl, this);
    var firstBadBalloon = this.sendBadBalloon(-1, 10, 1.5);
    firstBadBalloon.onPopped = function(game) {
      game.timer.add(Phaser.Timer.SECOND*10, function() {
        this.displaySpeech('"They won\'t fly at night...\nI need only hold them off until dusk."', 8);
      }, game);
      OrangeSea.showTutorial = false;
      game.tutorialInProgress = false;
      game.startGame();
    };
  },

  startGame: function() {
    this.add.tween(this.sun).to( {x: this.camera.width*0.1, y: this.camera.height*0.8 }, Phaser.Timer.SECOND*this.gameEndTime, Phaser.Easing.Linear.None, true);
    this.sendBadBalloon(5);
    this.timer.add(Phaser.Timer.SECOND*this.gameEndTime, function() {
      this.add.tween(this.stars).to( { alpha: 1.0 }, 10000, Phaser.Easing.Linear.None, true);
      this.add.tween(this.skyNight).to( { alpha: 1.0 }, 20000, Phaser.Easing.Linear.None, true);
      this.over = true;
    }, this);

    //when to end the game
    this.updateFunctions.push(function(game) {
      if (game.over && game.badBalloonGroup.total == 0 && this.glow == null) {
        //no more balloons, fade in glow
        this.glow = game.add.sprite(game.camera.width, 0, 'glow');
        this.glow.alpha = 0.0;
        this.glow.anchor.setTo(1, 0);
        var fadeIn = game.add.tween(this.glow).to( { alpha: 1.0 }, 2000, Phaser.Easing.Linear.None, true);
        var blink = game.add.tween(this.glow).to( { alpha: 0.5 }, 1000, Phaser.Easing.Linear.None, false, 0, -1, true);
        fadeIn.chain(blink);
      }
    });

  },

  //use delay = -1 to send only one
  sendBadBalloon: function(delay, maxVelocity, size) {
    if (this.over) {
      return;
    }
    console.log("Sending. Next in " + delay);
    if (!maxVelocity) {
      maxVelocity = this.MAX_SPEED;
    }
    //bad balloon
    var height = this.camera.height*(Math.random()*0.4 + 0.3);
    var badBalloon = this.add.sprite(this.camera.width*1.1, height, 'badBalloon');
    if (!size) {
      size = Math.random()+0.5;
    }
    badBalloon.scale.setTo(size, size);
    //badBalloon.alpha = 0.6;
    this.physics.arcade.enable(badBalloon);
    badBalloon.anchor.setTo(0.5, 0.1);
    badBalloon.angle = 8;
    badBalloon.body.allowGravity = false;
    badBalloon.tween = this.add.tween(badBalloon).to({ y: badBalloon.y - 200}, 3000 + Math.random()*3000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    badBalloon.body.acceleration.x = -50;
    badBalloon.body.maxVelocity.setTo(maxVelocity, this.MAX_SPEED);
    badBalloon.body.drag.setTo(this.DRAG_X, this.DRAG_Y);
    badBalloon.body.mass = 10;
    badBalloon.body.bounce = new Phaser.Point(1, 1);
    this.badBalloonGroup.add(badBalloon);

    if (delay < 0) {
      return badBalloon; //don't send any more
    }
    var nextDelay = delay;
    if (nextDelay > 2) {
      nextDelay -= 0.25;
    }
    this.timer.add(Phaser.Timer.SECOND*delay, this.sendBadBalloon, this, nextDelay, Math.random()*this.MAX_SPEED + this.MAX_SPEED);
  },

  throwPearl: function() {
    if (this.pearlCount > 0) {
      this.gunshot.play(null, null, 0.4);
      this.pearlCount--;
      this.showPearlCount();
      var thrownPearl = this.add.sprite(this.balloon.x, this.balloon.y+50, 'pearl');
      this.thrownPearlGroup.add(thrownPearl);
      this.physics.arcade.enable(thrownPearl);
      thrownPearl.body.velocity.x = this.pearlThrowDirection*1200;
      thrownPearl.body.velocity.y = -100;
    } else {
      this.click.play(null, null, 0.25);
    }
  },

  //send pearl and destroy if caught or falls back in the water
  sendPearl: function() {
    if (!(this.tutorialInProgress && this.pearlCount >= 2)) { //don't let player collect much more than 3 pearls during tutorial
      pearl = this.add.sprite(Math.random()*this.camera.width, this.camera.height, 'pearl');
      this.physics.arcade.enable(pearl);
      pearl.body.gravity.y = 300;
      this.fishJump.play(null, null, 0.5);
      pearl.x = Math.random()*this.camera.width*0.8;
      pearl.y = this.camera.height;
      //pearl.body.velocity.y = -1100 + Math.random()*400; // [-1100, -700)
      pearl.body.velocity.y = -900 + Math.random()*400;
      pearl.body.velocity.x = Math.random()*300;
      if (pearl.x > (this.camera.width*.4)) {
        pearl.body.velocity.x *= -1;
      }
      this.lobbedPearlGroup.add(pearl);
    }
    if (!this.over) {
      this.timer.add(Phaser.Timer.SECOND*Math.random()*3, function() {
        this.sendPearl();
      }, this);
    }
  },

  showPearlCount: function() {
    this.pearlCountText.setText(this.pearlCount);
    this.pearlCountText.x = this.balloon.x;
    this.pearlCountText.y = this.balloon.y;
    this.pearlCountText.alpha = 1.0;
    this.add.tween(this.pearlCountText).to( {y: this.pearlCountText.y - 100, alpha: 0}, 2000, null, true);
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
      var partTitle = this.add.text(0, 56, "The Airship Armada", { font: "120px great_victorianstandard", fill: "white" } );
      partTitle.anchor.setTo(0.5, 0.5);
      titleText.addChild(partTitle);
    }
    titleText.fixedToCamera = true;
    this.textGroup.add(titleText);
    var fadeIn = this.add.tween(titleText).from( { alpha: 0.0 }, 2000, Phaser.Easing.Linear.None, true);
    var fadeOut = this.add.tween(titleText).to({ alpha: 0.0 }, 2000, Phaser.Easing.Linear.None, false, 2000);
    fadeIn.chain(fadeOut);
  },

  displaySpeech: function(speechText, seconds) {
    if (!seconds) {
      seconds = 8;
    }
    //fade in speech
    var style = { font: "50px great_victorianstandard", fill: "white", wordWrap: true, wordWrapWidth: this.camera.width*.7, align: "center" };
    this.speech = this.add.text(this.camera.width/2, this.camera.height*.8, speechText, style);
    this.speech.anchor.setTo(0.5, 0.5);
    this.speech.fixedToCamera = true;
    this.textGroup.add(this.speech);
    this.speech.bringToTop();
    var fadeIn = this.add.tween(this.speech).from( { alpha: 0.0 }, 2000, Phaser.Easing.Linear.None, true);
    var fadeOut = this.add.tween(this.speech).to({ alpha: 0.0 }, 2000, Phaser.Easing.Linear.None, false, seconds*Phaser.Timer.SECOND);
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
    this.add.tween(this.waveTiles[0]).to( { y: this.waveTiles[0].position.y+10 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    this.add.tween(this.waveTiles[1]).to( { y: this.waveTiles[1].position.y+-10 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    this.add.tween(this.waveTiles[2]).to( {  y: this.waveTiles[2].position.y+10 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    //angle
    this.add.tween(this.waveTiles[0]).to( { angle: -this.waveTiles[0].angle }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    this.add.tween(this.waveTiles[1]).to( { angle: -this.waveTiles[1].angle }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    this.add.tween(this.waveTiles[2]).to( { angle: -this.waveTiles[2].angle }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
  },

  update: function () {
    var perfTimeStart = window.performance.now();
    // this.ship.y = this.waveRopes[0].y + this.waveRopes[0].points[5].y - 105;
    // this.ship.x += 0.5;

    //fish collision
    this.physics.arcade.collide(this.balloon, this.fish, function(balloon, fish) {
      this.hit.play(null, null, 0.4);
    }, null, this);
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
      if (this.balloon.y < -100) { //STRUCK BY LIGHTNING!
        this.strike();
      }
    }

    //WINNING
    if (this.balloon.x > this.camera.width*1.1 && this.over && this.alive && this.badBalloonGroup.total == 0) {
      ga('send', 'event', 'cleared');
      this.balloon.body.immovable = true;
      this.camera.fade(0x000000);
      this.camera.onFadeComplete.add(function(){ this.state.start('Cleared')}, this);
      this.alive = false;
    }

    //dying
    if (this.balloon.y > 650 && this.alive) {
      ga('send', 'event', 'dead', 'lostAtSea');
      OrangeSea.deadMessage = 'He was lost at sea.';
      this.splash.play(null, null, 0.5);
      this.deadSound.play(null, null, 0.5);
      //this.windSound.pause();
      OrangeSea.thunder.fadeOut(500);
      OrangeSea.music.stop();
      this.camera.fade(0x000000);
      this.camera.onFadeComplete.add(function(){
        this.state.start('ChapterOne');
      }, this);
      this.alive = false;
      this.balloon.body.acceleration.x = 0;
      this.balloon.body.acceleration.y = 0;
    }
    if (this.balloon.x < -300 && this.alive) {
      ga('send', 'event', 'dead', 'lostInShadow');
      this.balloon.body.immovable = true;
      OrangeSea.deadMessage = 'He was lost in the Shadow.';
      this.deadSound.play(null, null, 0.5);
      //this.windSound.pause();
      this.gust.play(null, null, 0.25);
      OrangeSea.thunder.fadeOut(500);
      OrangeSea.music.stop();
      this.camera.fade(0x000000);
      this.camera.onFadeComplete.add(function(){
        this.state.start('ChapterOne');
      }, this);
      this.alive = false;
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
        this.pearlThrowDirection = 1; //right
      }
      else if (this.cursors.left.isDown) {
        this.balloon.body.acceleration.x = -this.ACCELERATION;
        this.pearlThrowDirection = -1; //left
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
