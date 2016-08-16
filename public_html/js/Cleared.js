OrangeSea.Cleared = function(game) {
};

OrangeSea.Cleared.prototype = {
  create: function () {
    OrangeSea.deadMessage = null;
    this.spaceHit = false;
    OrangeSea.thunder.fadeOut(3000);
    OrangeSea.music.fadeOut(3000);

    var fadeColor = 0x000000;
    this.camera.flash(fadeColor, 1000); //fade in
    var background = this.add.sprite(0, 0, 'clearedBackground1'); //winner background

    var message = this.add.text(this.camera.width/2, this.camera.height/2,
      'Pearls: ' + OrangeSea.pearlCount + '\nEnemies Felled: ' + OrangeSea.vanquished,
      { font: "90px great_victorianstandard", fill: "#ede3d6", align: "left" } );
    message.anchor.setTo(0.5, 0.5);

    var spaceToContinueMessage = this.add.sprite(0, 0, 'spaceToContinue');
    spaceToContinueMessage.alpha = 0;
    this.add.tween(spaceToContinueMessage).to( { alpha: 1.0 }, 500, Phaser.Easing.Linear.None, true);

    var spaceBar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    var fKey = this.input.keyboard.addKey(Phaser.KeyCode.F);
    fKey.onDown.add(OrangeSea.toggleFullScreen, this);
    //mobile
    this.input.onTap.add(this.spacePressed, this);
    spaceBar.onDown.add(this.spacePressed, this);

    OrangeSea.currentLevel++;
  },

  spacePressed: function() {
    if (!this.spaceHit) {
      ga('send', 'event', 'continue', 'startLevel' + OrangeSea.currentLevel);
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
