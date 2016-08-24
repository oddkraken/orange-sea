OrangeSea.GameOver = function(game) {
};

OrangeSea.GameOver.prototype = {
  create: function () {
    ga('send', 'event', 'gameOver');
    OrangeSea.deadMessage = null;
    this.spaceHit = false;
    OrangeSea.thunder.fadeOut(3000);
    OrangeSea.music.fadeOut(3000);

    var fadeColor = 0x000000;
    this.camera.flash(fadeColor, 1000);
    var background = this.add.sprite(0, 0, 'preloadBackground');
    background.tint = 0xAA0000;

    var gameOver = this.add.text(this.camera.width*0.5, this.camera.height*0.5, 'Game Over', { font: "180px great_victorianstandard", fill: "white", wordWrap: true, wordWrapWidth: this.camera.width*.7, align: "center" } );
    gameOver.anchor.setTo(0.5, 0.5);
    gameOver.setShadow(5, 0, 'rgba(0,0,0,0.4)', 5);
    this.gameOverTween = this.add.tween(gameOver).from( { alpha: 0.0 }, 1000, Phaser.Easing.Linear.None, true);

    var spaceToContinueMessage = this.add.sprite(0, 0, 'spaceToContinue');
    spaceToContinueMessage.alpha = 0;
    this.add.tween(spaceToContinueMessage).to( { alpha: 1.0 }, 500, Phaser.Easing.Linear.None, true);

    var spaceBar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    var fKey = this.input.keyboard.addKey(Phaser.KeyCode.F);
    fKey.onDown.add(OrangeSea.toggleFullScreen, this);
    //mobile
    this.input.onTap.add(this.spacePressed, this);
    spaceBar.onDown.add(this.spacePressed, this);

    //reset vars
    OrangeSea.initVals();
  },

  spacePressed: function() {
    if (!this.spaceHit) {
      ga('send', 'event', 'continue', 'startLevel' + OrangeSea.currentLevel);
      this.gameOverTween.stop();
      this.spaceHit = true;
      //stop sounds if they haven't finished fading out
      OrangeSea.thunder.stop();
      OrangeSea.music.stop();
      this.camera.resetFX();
      this.camera.fade(0x000000);
      this.camera.onFadeComplete.add(function(){ this.state.start('ChapterOne')}, this);
    }
  }
};
